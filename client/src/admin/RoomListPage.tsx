import React, { useState, useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import SocketIOClient from 'socket.io-client';
import {
  GameState,
  GameStatus,
  LobbyState,
  SocketMessages,
  RescueResource,
  LobbyStatus
} from '../metadata/types';
import client from '../axios-client';
import fileSave from 'file-saver';
import { Jumbotron, Table, Button, Badge, Modal} from 'react-bootstrap';
import styled from 'styled-components';
import { PortalGlobal, Title, Wrapper, NavBar } from './styles';
import { formatTime, localeTimeString } from '../time-format-utils';
import { API_BASE_URL } from '../config';

const LobbyControls = styled.div`
  min-width: 350px;
  display: table;
  margin: 0 auto;
`;

const Time = styled.span`
  font-family: 'Courier New', Courier, monospace;
`;

export default () => {
  const { code } = useParams<{ code?: string }>();

  const [_, setSocket] = useState<SocketIOClient.Socket>();
  const [duration, setDuration] = useState(0);
  const [countdownMinutes, setCountdownMinutes] = useState(0);
  const [countdownSeconds, setCountdownSeconds] = useState(0);
  const [createTime, setCreateTime] = useState<string>();
  const [rooms, setRooms] = useState<{ [name: string]: GameState }>({});
  const [status, setStatus] = useState<LobbyStatus>();
  const [notFound, setNotFound] = useState(false);

  const [startGameStatus, setStartGameStatus] = useState<string | boolean>(false);
  const [configCountdownStatus, setConfigCountdownStatus] = useState<string | boolean>(false);
  const [showModal, setShowModal] = useState(false);
  const [restartModal, setRestartModal] = useState<string>();

  const stateRef = useRef<{ [name: string]: GameState }>();
  stateRef.current = rooms;

  useEffect(() => {
    client.get(`${API_BASE_URL}/lobbies/${code}`, {
      headers: { Authorization: `bearer ${localStorage.getItem('token')}` }
    })
      .then((res) => {
        setCreateTime(localeTimeString(res.data.createTime));
      })
      .catch((err) => {
        if (err.response?.status === 404) {
          setNotFound(true);
        }
      });
    
    const newSocket = SocketIOClient(`${API_BASE_URL}`, {
      path: '/lobbies/socket',
      query: {
        lobby: code,
        token: localStorage.getItem('token'),
      }
    });
    setSocket(newSocket);

    newSocket.on(SocketMessages.LobbyUpdate, (data: string) => {
      const state = JSON.parse(data) as LobbyState;
      setStatus(state.status);
      setDuration(state.gameDuration.duration);
      setCountdownMinutes(Math.floor(state.gameDuration.countdown / 60));
      setCountdownSeconds(state.gameDuration.countdown % 60);
      if (Object.keys(state.updatedRooms).length > 0) {
        const newRooms = {...stateRef.current};
        Object.keys(state.updatedRooms).forEach((name) => {
          newRooms[name] = state.updatedRooms[name];
        });
        setRooms(newRooms);
      }
    });

    newSocket.on('disconnect', () => {
      setSocket(undefined);
    });

    newSocket.on('connect_error', () => {
      setSocket(undefined);
    });
  }, []);

  function onKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === 'Enter') {
      setGameCountdown();
    }
  }

  function onMinutesChange(e: React.ChangeEvent<HTMLInputElement>) {
    const value = parseInt(e.target.value);
    if (isNaN(value) || !Number.isInteger(value)) {
      setCountdownMinutes(0);
      return;
    }
    if (value < 1 || value > 999) {
      return;
    }
    setCountdownMinutes(value);
  }

  function onSecondsChange(e: React.ChangeEvent<HTMLInputElement>) {
    const value = parseInt(e.target.value);
    if (isNaN(value) || !Number.isInteger(value)) {
      setCountdownSeconds(0);
      return;
    }
    if (value < 0 || value >= 60) {
      return;
    }
    setCountdownSeconds(value);
  }

  function startGames() {
    client.put(`${API_BASE_URL}/lobbies/start/${code}`, {}, {
      headers: { Authorization: `bearer ${localStorage.getItem('token')}` }
    })
      .then(() => {
        setShowModal(false);
      })
      .catch((err) => {
        setStartGameStatus(err.response.data);
      });
  }

  function setGameCountdown() {
    const countdownInSeconds = countdownMinutes * 60 + countdownSeconds;
    client.put(`${API_BASE_URL}/lobbies/countdown/${code}`, { 
        countdown: countdownInSeconds
      }, {
        headers: { Authorization: `bearer ${localStorage.getItem('token')}` }
    })
      .then(() => {
        setConfigCountdownStatus(true);
        setTimeout(() => setConfigCountdownStatus(false), 5000);
      })
      .catch((err) => {
        setConfigCountdownStatus(err.response.data);
      });
  }

  function restartGame(room: string) {
    client.post(`${API_BASE_URL}/rooms/restart/${code}/${room}`, {},
      { headers: { Authorization: `bearer ${localStorage.getItem('token')}` }}
    )
      .then(() => setRestartModal(undefined));
  }

  function exportSnapshot() {
    const lines = Object.keys(rooms).reduce((accumulator: string[], name: string) => {
      const stats = rooms[name].gameStats;
      const strings = [
        name,
        stats.dropOffTimes[RescueResource.O2ReplacementCells],
        stats.dropOffTimes[RescueResource.OxygenRepairTeam],
        stats.dropOffTimes[RescueResource.WaterRepairTeam],
        stats.dropOffTimes[RescueResource.FoodRepairTeam],
        stats.dropOffTimes[RescueResource.MedicalRepairTeam],
        stats.scientistsRemaining,
        rooms[name].endTime ? formatTime(rooms[name].endTime! - rooms[name].startTime + rooms[name].accumulatedTime) : '',
        rooms[name].status,
      ];
      accumulator.push(`${strings.join(',')}\n`);
      return accumulator;
    }, ['Name,O2-temp,Oxygen,Water,Food,Medical,Scientists,Day,Duration,Status\n']);
    const blob = new Blob(lines, { type: 'text/plain;charset=utf-8', endings: 'native' });
    fileSave.saveAs(blob, `lobby_${code} at ${createTime}.csv`);
  }

  return <>
    <PortalGlobal />
    <NavBar />
    <Wrapper>
      {
        createTime ?
        <>
          <Jumbotron>
            <Title>Lobby {code}</Title>
            <LobbyControls>
              <p>
                Time created: {createTime}
              </p>
              <p>
                {'Lobby status: '}
                <Badge
                  style={{ fontSize: '16px' }}
                  variant='secondary'
                >{status ?? 'Unknown'}</Badge>
                {'  '}
                <Button
                  variant='outline-success'
                  size='sm'
                  onClick={() => setShowModal(true)}
                  disabled={status !== LobbyStatus.Waiting}
                >Start Games</Button>
                {
                  startGameStatus ?
                  (
                    typeof startGameStatus === 'string' ?
                    <span style={{ color: 'red' }}> {startGameStatus}</span> : <>&#10003;</>
                  )
                  :
                  <></>
                }
              </p>
              <p>
                {'Time remaining: '}
                {
                  status === LobbyStatus.Waiting ?
                  <>
                    <input    
                      value={countdownMinutes > 0 ? `${countdownMinutes}`.replace(/^0+/, ''): 0}
                      onChange={onMinutesChange}
                      onFocus={(e) => e.target.select()}
                      disabled={status !== LobbyStatus.Waiting}
                      type='number'
                      min={0}
                      max={999}
                      step={1}
                      onKeyDown={onKeyDown}
                    />
                    :
                    <input
                      value={countdownSeconds > 0 ? `${countdownSeconds}`.replace(/^0+/, ''): 0}
                      onChange={onSecondsChange}
                      onFocus={(e) => e.target.select()}
                      disabled={status !== LobbyStatus.Waiting}
                      type='number'
                      min={0}
                      max={59}
                      step={1}
                      onKeyDown={onKeyDown}
                    />
                  </>
                  :
                  <Time>{formatTime(countdownMinutes * 60 + countdownSeconds)}</Time>
                }
                {'  '}
                <Button
                  variant='outline-success'
                  size='sm'
                  onClick={setGameCountdown}
                  disabled={status !== LobbyStatus.Waiting}
                >Set</Button>
                {
                  configCountdownStatus ?
                  (
                    typeof configCountdownStatus === 'string' ?
                    <span style={{ color: 'red' }}> {configCountdownStatus}</span> : <>&#10003;</>
                  )
                  :
                  <></>
                }
              </p>
            </LobbyControls>
          </Jumbotron>
          <Button
            variant='outline-info'
            onClick={exportSnapshot}
          >Export lobby snapshot as csv file</Button>
          <p style={{ margin: '10px 0' }}>
            Teams: {Object.keys(rooms).length}, not finished: {
              Object.values(rooms).reduce((accumulator: number, state: GameState) => {
                if (state.status === GameStatus.NotStarted || state.status === GameStatus.Started) {
                  return accumulator + 1;
                }
                return accumulator;
              }, 0)
            }
          </p>
          <Table striped bordered hover size='sm'>
            <tbody>
              <tr>
                <th>Crew Name</th>
                <th>O2-temp<br/>(day 6)</th>
                <th>Oxygen<br/>(day 21)</th>
                <th>Water<br/>(day 23)</th>
                <th>Food<br/>(day 24)</th>
                <th>Medical<br/>(day 25)</th>
                <th>Scientists</th>
                <th>Day Count</th>
                <th>Mission Time</th>
                <th>Mission Status</th>
                <th>Restart</th>
              </tr>
              {
                Object.keys(rooms).map((name, index) => {
                  const game = rooms[name];
                  const dropOffTimes = game.gameStats.dropOffTimes;
                  return <tr key={index}>
                    <td>{name}</td>
                    {
                      [
                        RescueResource.O2ReplacementCells,
                        RescueResource.OxygenRepairTeam,
                        RescueResource.WaterRepairTeam,
                        RescueResource.FoodRepairTeam,
                        RescueResource.MedicalRepairTeam,
                      ].map((resource, index) => <td key={index}>
                        {dropOffTimes[resource] >= 0 ? dropOffTimes[resource] : '-'}
                      </td>)
                    }
                    <td>
                      {
                        `${game.gameStats.scientistsRemaining}/20`
                      }
                    </td>
                    <td>{game.time}</td>
                    <td>
                      <Time>
                        {
                          game.status === GameStatus.NotStarted ?
                          '00:00'
                          :
                          formatTime((game.endTime ?? duration) - game.startTime + game.accumulatedTime)
                        }
                      </Time>
                    </td>
                    <td>{game.status}</td>
                    <td style={{ textAlign: 'center', padding: '0.1em' }}>
                      <Button
                        disabled={game.status === GameStatus.Started
                          || status === LobbyStatus.Waiting
                          || status === LobbyStatus.Finished
                        }
                        size='sm'
                        variant='outline-danger'
                        onClick={() => setRestartModal(name)}
                      >Restart</Button>
                    </td>
                  </tr>;
                })
              }
            </tbody>
          </Table>
        </>
        :
        <Jumbotron>
          <Title>
            {
              notFound ?
              `Lobby ${code} does not exist.`
              :
              `Loading lobby ${code}...`
            }
          </Title>
        </Jumbotron>
      }
    </Wrapper>
    <Modal
      show={showModal}
      onHide={() => setShowModal(false)}
    >
      <Modal.Header closeButton>
        <h4>About to start games</h4>
      </Modal.Header>
      <Modal.Body>
        <p>Are you sure to start games?</p>
        <p>It cannot be undone.</p>
        <p>No rooms can be added afterwards.</p>
      </Modal.Body>
      <Modal.Footer>
        <Button
          variant='secondary'
          onClick={() => setShowModal(false)}
        >Cancel</Button>
        <Button
          variant='primary'
          onClick={startGames}
        >Yes, let's start</Button>
      </Modal.Footer>
    </Modal>
    <Modal
      show={restartModal !== undefined}
      onHide={() => setRestartModal(undefined)}
    >
      <Modal.Header closeButton>
        <h4>About to restart room {restartModal}</h4>
      </Modal.Header>
      <Modal.Body>
        <p>Are you sure to restart mission for room {restartModal}?</p>
        <p>It cannot be undone and data of the current mission will be lost.</p>
      </Modal.Body>
      <Modal.Footer>
        <Button
          variant='secondary'
          onClick={() => setRestartModal(undefined)}
        >Cancel</Button>
        <Button
          variant='danger'
          onClick={() => restartGame(restartModal ?? '')}
        >Yes, restart</Button>
      </Modal.Footer>
    </Modal>
  </>;
}
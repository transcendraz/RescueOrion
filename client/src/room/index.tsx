import React, { useState, useEffect } from 'react';
import GameBoard from './GameBoard';
import SocketContext from './game-context';
import { GameDuration, GameState, SocketMessages } from '../metadata/types';
import styled, { createGlobalStyle } from 'styled-components';
import SocketIOClient from 'socket.io-client';
import { Location } from 'history';
import queryString from 'query-string';
import { API_BASE_URL } from '../config';

const GlobalStyle = createGlobalStyle`
  body {
    background-color: black;
  }
`;

const SocketError = styled.div`
  background-color: rgb(240, 240, 240);
  font-size: 18px;
  display: inline-block;
  padding: 5px;
  position: absolute;
  top: 0;
  left: 50%;
  transform: translate(-50%, 0);
  z-index: 100;
`;

export default (props: {
  location: Location,
}) => {
  const { lobby, room } = queryString.parse(props.location.search);

  const [socket, setSocket] = useState<SocketIOClient.Socket>();
  const [gameState, setGameState] = useState<GameState>();
  const [gameDuration, setGameDuration] = useState<GameDuration>();

  async function setup() {
    let newSocket = SocketIOClient(`${API_BASE_URL}`, {
      path: '/rooms/socket',
      query: {
        lobby: lobby,
        room: room,
      },
    });
    setSocket(newSocket);

    newSocket.on(SocketMessages.StateUpdate, (data: string) => {
      const message = JSON.parse(data);
      const newState = message as GameState;
      setGameState(newState);
    });

    newSocket.on(SocketMessages.TimeUpdate, (data: string) => {
      const d = JSON.parse(data) as GameDuration;
      setGameDuration(d);
    });

    newSocket.on('disconnect', () => {
      setSocket(undefined);
    });

    newSocket.on('connect_error', () => {
      setSocket(undefined);
    });
  }

  useEffect(() => {
    if (!lobby || !room) {
      return;
    }
    setup();
  }, [lobby, room]);

  return <>
    <GlobalStyle />
    {
      socket ?
      <></>
      :
      <SocketError>
        Cannot connect to Rescue Orion server... Try refreshing the page or report to your commander!
      </SocketError>
    }  
    {
      gameState && gameDuration ?
      (
        <SocketContext.Provider value={{
          socket: socket,
          gameState: gameState,
          gameDuration: gameDuration,
        }}>
          <GameBoard />
        </SocketContext.Provider>
      )
      :
      (
        <div>Loading</div>
      )
    }
  </>
}

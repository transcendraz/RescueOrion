import React, { useState, useLayoutEffect, useEffect, useRef } from 'react';
import ButtonGroup from './ButtonGroup';
import SpaceStation from './SpaceStation'
import { GameState, GameStatus, Message } from '../metadata/types';
import styled from 'styled-components';
import { locationData, spaceStationData } from '../metadata';
import * as IDs from '../metadata/agent-ids';
import MessageModal from './modal/MessageModal';
import { PixelPosition } from '../metadata/types';
import ResourcePanel from './ResourcePanel';
import RebalanceResourceModal from './modal/RebalanceResourceModal';
import AbortGameModal from './modal/AbortGameModal';
import ConfirmMoveModal from './modal/ConfirmMoveModal';
import SuccessMissionModal from './modal/SuccessMissionModal';
import { useSelector } from './redux-hook-adapters';
import Clock from './Clock';
import AbortMissionModal from './modal/ConfirmAbortMissionModal';
import WaitModal from './modal/WaitModal';
import OutOfResourceModal from './modal/OutOfResourceModal';
import TimeOutModal from './modal/TimeOutModal';
import OutOfO2Modal from './modal/OutOfO2Modal';

const GEMINI_LEFT_OFFSET = 45;
const GEMINI_TOP_OFFSET = 50;
const GAME_BOARD_WIDTH = 1440;
const GAME_BOARD_HEIGHT = 810;

const GameBoard = styled.div`
  background-image: url(${`${process.env.PUBLIC_URL}/game_map.jpg`});
  height: ${GAME_BOARD_HEIGHT}px;
  width: ${GAME_BOARD_WIDTH}px;
  background-size: contain;
  position: relative;
  margin: 0 auto;
`;

const GeminiShip = styled.div`
  width: 80px;
  height: 80px;
  display: block;
  position: absolute;
  background-size: contain;
`;
const Gemini1 = styled(GeminiShip)`
  background-image: url(${`${process.env.PUBLIC_URL}/Gemini1.png`});
  top: ${(props: { position: PixelPosition }) => `${props.position.top - GEMINI_TOP_OFFSET}px`};
  left: ${(props: { position: PixelPosition }) => `${props.position.left - GEMINI_LEFT_OFFSET}px`};
`;
const Gemini2 = styled(GeminiShip)`
  background-image: url(${`${process.env.PUBLIC_URL}/Gemini2.png`});
  top: ${(props: { position: PixelPosition }) => `${props.position.top - GEMINI_TOP_OFFSET}px`};
  left: ${(props: { position: PixelPosition }) => `${props.position.left - GEMINI_LEFT_OFFSET}px`};
`;
const Gemini12 = styled(GeminiShip)`
  background-image: url(${`${process.env.PUBLIC_URL}/Gemini12.png`});
  top: ${(props: { position: PixelPosition }) => `${props.position.top - GEMINI_TOP_OFFSET}px`};
  left: ${(props: { position: PixelPosition }) => `${props.position.left - GEMINI_LEFT_OFFSET}px`};
`;

const ActionButton = styled.div`
  width: 120px;
  height: 40px;
  position: absolute;
  background-size: cover;
  cursor: pointer;
`;

const ConfirmMoveButton = styled(ActionButton)`
  background-image: url(${`${process.env.PUBLIC_URL}/buttons/confirm_move.png`});
  top: 10px;
  left: 30px;
  cursor: ${(props: { noMove: Boolean }) => !props.noMove ? 'cursor': `not-allowed`};
  :hover {
    background-image: ${(props: { noMove: Boolean }) => props.noMove ? `url(${process.env.PUBLIC_URL}/buttons/confirm_move.png)`: `url(${process.env.PUBLIC_URL}/buttons/confirm_move_hover.png)`};
  }
`;

const MoveResourceButton = styled(ActionButton)`
  background-image: url(${`${process.env.PUBLIC_URL}/buttons/move_resources.png`});
  top: 580px;
  left: 100px;
  cursor: ${(props: { disabled: Boolean }) => !props.disabled ? 'cursor': `not-allowed`};
  :hover {
    background-image: ${(props: { disabled: Boolean }) => !props.disabled ? `url(${process.env.PUBLIC_URL}/buttons/move_resources_hover.png)`: `url(${process.env.PUBLIC_URL}/buttons/move_resources.png)`};
  }
`;

const TerminateGameButton = styled(ActionButton)`
  background-image: url(${`${process.env.PUBLIC_URL}/buttons/abort_mission.png`});
  top: 55px;
  left: 30px;
  :hover {
    background-image: url(${`${process.env.PUBLIC_URL}/buttons/abort_mission_hover.png`});
  }
`;

export default function() {
  const gameState = useSelector((state: GameState) => state);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  const [gemini1NextMove, setGemini1NextMove] = useState<string | undefined>();
  const [gemini2NextMove, setGemini2NextMove] = useState<string | undefined>();
  const [messages, setMessages] = useState<Message[]>([]);
  const [showRebalanceModal, setShowRebalanceModal] = useState(false);
  const [showConfirmMoveModal, setShowConfirmMoveModal] = useState(false);
  const [showAbortMissionModal, setShowAbortMissionModal] = useState(false);
  const [showTimePortalRoute, setShowTimePortalRoute] = useState(false);

  useLayoutEffect(() => {
    setGemini1NextMove(undefined);
    setGemini2NextMove(undefined);
  }, [gameState.time]);
  
  useEffect(() => {
    setMessages(messages.concat(gameState.messages));
  }, [gameState.messages]);
  
  const selectedMove = gemini1NextMove && gemini2NextMove;
  
  const gemini_1 = gameState.spaceships[IDs.GEMINI_1];
  const gemini_2 = gameState.spaceships[IDs.GEMINI_2];
  const gemini1CurrentLocation = gemini_1.location;
  const gemini2CurrentLocation = gemini_2.location
  const gemini1Location = gemini1NextMove ?? gemini1CurrentLocation;
  const gemini2Location = gemini2NextMove ?? gemini2CurrentLocation;
  const position1 = locationData[gemini1Location].pixelPosition;
  const position2 = locationData[gemini2Location].pixelPosition;

  const canRebalanceResource = gemini1CurrentLocation === gemini2CurrentLocation &&
  (gemini_1.timePortalRoute.length > 0) === (gemini_2.timePortalRoute.length > 0);

  function popMessageModal() {
    const remainingMessages = messages.slice(0);
    remainingMessages.pop();
    setMessages(remainingMessages);
  }
  
  // draw a line
  const drawLine = (context: CanvasRenderingContext2D, start: PixelPosition, end: PixelPosition, color = 'rgba(252,196,9,0.3)') => {
    context.beginPath();
    context.moveTo(start.left, start.top);
    context.lineTo(end.left, end.top);
    context.strokeStyle = color;
    context.lineWidth = 20;
    context.stroke();
  }

  const drawLineWithRoute = (context: CanvasRenderingContext2D, timePortalRoute: string[], currentLocation: string, color?: string) => {
    timePortalRoute.forEach((point, i) => {
      if(i >= 1) {
        drawLine(context, locationData[timePortalRoute[i-1]].pixelPosition, locationData[point].pixelPosition, color);
      }
    })
    if(timePortalRoute.length > 0) {
      drawLine(context, locationData[timePortalRoute[timePortalRoute.length-1]].pixelPosition, locationData[currentLocation].pixelPosition, color);
    }
  }

  useEffect(() => {
    const canvas = canvasRef.current;
    const context = canvas !== null ? canvas.getContext('2d'): null;
    const travelTogether = gemini_1.location === gemini_2.location && gemini1NextMove === gemini2NextMove;
    if(context !== null) {
      context.clearRect(0, 0, GAME_BOARD_WIDTH, GAME_BOARD_HEIGHT);
      if(travelTogether) {
        drawLineWithRoute(context, gemini_1.timePortalRoute, gemini_1.location);
      }
      else {
        drawLineWithRoute(context, gemini_1.timePortalRoute, gemini_1.location);
        drawLineWithRoute(context, gemini_2.timePortalRoute, gemini_2.location, 'rgba(70,179,232,0.3)');
      }
    }
  }, [gemini_1.timePortalRoute, gemini_2.timePortalRoute, showTimePortalRoute]) 

  return <>
    <GameBoard>
      <ConfirmMoveButton 
        data-testid="confirm-move-dialog"
        noMove={!selectedMove}
        onClick={() => {
          if(selectedMove) {
            setShowConfirmMoveModal(true);
          }
        }}
        ></ConfirmMoveButton>
      <MoveResourceButton
        data-testid="move-resource-dialog"
        disabled={!canRebalanceResource}
        onClick={() => {
          if (canRebalanceResource) {
            setShowRebalanceModal(true)
          }
        }}
      ></MoveResourceButton>
      <TerminateGameButton 
        data-testid="abort-mission-dialog"
        onClick={() => {
          setShowAbortMissionModal(true);
        }}
      ></TerminateGameButton>
      {
        gemini1Location === gemini2Location ? 
        <Gemini12 position={position1} /> :
        <>
          <Gemini1 position={position1} />
          <Gemini2 position={position2} />
        </>
      }
      {
        Object.entries(gameState.nextMoves).map((location, index) => {
          return (
            <ButtonGroup 
              data-testid={`move-${location[0]}`}
              key={index}
              id={location[0]}
              gemini1NextMove={gemini1NextMove === location[0]}
              gemini2NextMove={gemini2NextMove === location[0]}
              setGemini1NextMove={setGemini1NextMove}
              setGemini2NextMove={setGemini2NextMove}
              setShowTimePortalRoute={setShowTimePortalRoute}
              shipReachability={location[1]}
            />
          );
        })
      }
      {
        Object.entries(spaceStationData).map((spaceStation, index) => {
          return <SpaceStation
            key={index}
            id={spaceStation[0]}
          />;
        })
      }
      {
        messages.map((message: Message, index: number) => {
          return <MessageModal
            key={index}
            message={message}
            onClose={popMessageModal}
          />;
        })
      }
      {
        showRebalanceModal ?
        <RebalanceResourceModal
          onClose={() => setShowRebalanceModal(false)}
        /> : <></>
      }
      {
        gameState.status === GameStatus.NotStarted ?
        <WaitModal /> : <></>
      }
      {
        gameState.status === GameStatus.MissionAborted ?
        <AbortGameModal/> : <></>
      }
      {
        showConfirmMoveModal ?
        <ConfirmMoveModal
          gemini1NextMove={gemini1Location}
          gemini2NextMove={gemini2Location}
          onClose={() => {
            setShowConfirmMoveModal(false)
          }}
        /> : <></>
      }
      {
        showAbortMissionModal ?
        <AbortMissionModal
          onClose={() => {
            setShowAbortMissionModal(false);
          }}
        /> : <></>
      }

      <ResourcePanel
        gemini1={gameState.spaceships[IDs.GEMINI_1]}
        gemini2={gameState.spaceships[IDs.GEMINI_2]}
        time={gameState.time}
      ></ResourcePanel>

      {
        showTimePortalRoute ? 
        <canvas id="canvas" 
          ref={canvasRef}
          width={GAME_BOARD_WIDTH}
          height={GAME_BOARD_HEIGHT}  
        /> : <></>
      }

      {
        gameState.status === GameStatus.MissionSucceeded ? 
        <SuccessMissionModal /> : <></>
      }

      {
        gameState.status === GameStatus.OutOfResource ? 
        <OutOfResourceModal /> : <></>
      }

      {
        gameState.status === GameStatus.MissionTimeOut ? 
        <TimeOutModal /> : <></>
      }

      {
        gameState.status === GameStatus.OxygenProblem ? 
        <OutOfO2Modal /> : <></>
      }

      <Clock />

    </GameBoard>
  </>;
}

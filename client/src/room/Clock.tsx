import React, { useContext } from 'react';
import styled from 'styled-components';
import GameContext from './game-context';

const Clock = styled.div`
  position: absolute;
  top: 0;
  right: 0;
  padding: 10px;
  color: white;
  font-weight: bold;
  font-size: 36px;
  font-family: monospace;
`;

function pad(n: number): string {
  let digits = 0;
  let copy = n;
  while (copy > 0) {
    copy = Math.floor(copy / 10);
    ++digits;
  }
  if (digits < 2) {
    return `0${n}`;
  } else {
    return `${n}`;
  }
}

export default () => {
  const context = useContext(GameContext);
  let countdown: number;
  if (context.gameState!.endTime) {
    const lobbyCountdown = context.gameDuration!.countdown + context.gameDuration!.duration;
    countdown = lobbyCountdown - context.gameState!.endTime;
  } else {
    countdown = context.gameDuration!.countdown;
  }
  const minutes = Math.floor(countdown / 60);
  const seconds = countdown % 60;
  
  return <Clock>
    {pad(minutes)}:{pad(seconds)}
  </Clock>;
}

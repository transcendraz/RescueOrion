import Game from '../repository/classes/Game';
import CountdownClock from '../repository/countdown-clock';
import { jest, describe, expect, it, beforeEach } from '@jest/globals'
import { GameStatus } from '../metadata/types';

describe('game to gameState', () => {
  let game: Game;
  let clock: CountdownClock;
  let accumulatedTime: number;

  beforeEach(() => {
    clock = new CountdownClock(75 * 60);
    game = new Game(clock, 0, (time) => {
      accumulatedTime += time;
    });
    game.load();
    accumulatedTime = 0;
    clock.start();
  })

  it('does/does not dump messages', () => {
    jest.useFakeTimers();
    game.startMission();
    expect(game.toGameState(false)).toEqual(game.toGameState(false));
    // messages dumped so not equal
    expect(game.toGameState(true)).not.toEqual(game.toGameState(true));
  });

  it('accumulates time correctly', () => {
    jest.useFakeTimers();
    game.startMission();
    jest.advanceTimersByTime(10 * 1000);
    game.endMission(GameStatus.MissionAborted);
    jest.advanceTimersByTime(30 * 1000);
    expect(accumulatedTime).toBe(10);
    game = new Game(clock, accumulatedTime, (time) => {
      accumulatedTime += time;
    });
    game.load();
    game.startMission();
    jest.advanceTimersByTime(30 * 1000);
    game.endMission(GameStatus.MissionSucceeded);
    expect(accumulatedTime).toBe(10 + 30);
  });
});
import MockSocket from './mock-socket';
import { jest, describe, expect, it, beforeAll, beforeEach, afterEach } from '@jest/globals'
import { Room } from '../repository';
import CountdownClock from '../repository/countdown-clock';
import { ABORT_MISSION, TRANSFER_ENERGY_CELLS } from '../metadata/types';
import * as IDs from '../metadata/agent-ids';

describe('room', () => {
  let room: Room;
  let clock: CountdownClock;
  
  beforeAll(() => {
    jest.useFakeTimers();
  });

  beforeEach(() => {
    clock = new CountdownClock(75 * 60);
    room = new Room(clock);
  });

  it('handles socket properly', () => {
    const mockSocket = new MockSocket();
    room.setSocketAndPushUpdate(mockSocket);
    expect(mockSocket.emitInvoked).toBe(2);
    const mockSocket2 = new MockSocket();
    room.setSocketAndPushUpdate(mockSocket2);
    expect(mockSocket.disconnected).toBeTruthy();
    expect(mockSocket2.emitInvoked).toBe(2);
    room.destroy();
    room = null;
    expect(mockSocket2.disconnected).toBeTruthy();
  });

  it('handles state updates', () => {
    const mockSocket = new MockSocket();
    room.setSocketAndPushUpdate(mockSocket);
    room.startGameIfNot();
    clock.start();
    room.startGameIfNot();
    room.startGameIfNot();
    expect(mockSocket.emitInvoked).toBe(3);
    jest.advanceTimersByTime(1000);
    expect(mockSocket.emitInvoked).toBe(4);
    room.applyGameAction({
      type: TRANSFER_ENERGY_CELLS,
      payload: {
        from: IDs.GEMINI_1,
        to: IDs.GEMINI_2,
        count: 10,
      }
    });
    jest.advanceTimersByTime(1000);
    expect(mockSocket.emitInvoked).toBe(6);

    // stay put for two minutes and time sensitive message pops up
    jest.advanceTimersByTime(2 * 60 * 1000);
    expect(mockSocket.emitInvoked).toBe(6 + 120 + 1);
    room.applyGameAction({ type: ABORT_MISSION });
    expect(mockSocket.emitInvoked).toBe(6 + 120 + 1 + 1);
    jest.advanceTimersByTime(30 * 1000);
    expect(mockSocket.emitInvoked).toBe(6 + 120 + 1 + 1);
  });

  it('restarts game properly', () => {
    const mockSocket = new MockSocket();
    room.setSocketAndPushUpdate(mockSocket);
    expect(mockSocket.emitInvoked).toBe(2);
    room.restartGame();
    expect(mockSocket.emitInvoked).toBe(2);  // Restarting before game start - not effective
    room.startGameIfNot();
    room.restartGame();
    expect(mockSocket.emitInvoked).toBe(4);
  });

  afterEach(() => {
    room?.destroy();
  })
  
});
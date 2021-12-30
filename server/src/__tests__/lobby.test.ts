import { LobbyStatus, LobbyState, ABORT_MISSION } from "../metadata/types";
import repository, { Lobby } from "../repository";
import MockSocket from './mock-socket';
import {jest, describe, expect, it, beforeAll, beforeEach, afterEach } from '@jest/globals'

describe('lobby', () => {
  let lobby: Lobby;

  beforeAll(() => {
    jest.useFakeTimers();
  });

  beforeEach(() => {
    lobby = new Lobby(12306, 'admin');
  })

  it('shuts down after 2 hrs not starting the game', () => {
    jest.advanceTimersByTime(2 * 60 * 60 * 1000);
    expect(repository.adminLobbies.admin.length).toBe(0);
    expect(repository.lobbies[12306]).toBeUndefined();
    lobby = null;
  });

  it('cancels shutdown if game starts within 2 hrs', () => {
    jest.advanceTimersByTime(2 * 60 * 60 * 1000 - 1);
    expect(repository.adminLobbies.admin.length).toBe(1);
    expect(repository.lobbies[12306]).toBeDefined();
    lobby.startGames();
    jest.advanceTimersByTime(35 * 60);  // some time in the middle of games
    expect(repository.adminLobbies.admin.length).toBe(1);
    expect(repository.lobbies[12306]).toBeDefined();
  });

  it('shuts down correctly after game ends', () => {
    lobby.setCountdown(1);
    lobby.startGames();

    // Finishes after 1 second
    jest.advanceTimersByTime(1000);
    expect(lobby.status).toBe(LobbyStatus.Finished);

    // Should be destroyed after 2 hrs
    jest.advanceTimersByTime(2 * 60 * 60 * 1000);
    expect(repository.adminLobbies.admin.length).toBe(0);
    expect(repository.lobbies[12306]).toBeUndefined();
    lobby = null;
  });

  it('manages rooms correctly', () => {
    expect(lobby.isRoomNameTaken('room')).toBeFalsy();
    expect(lobby.findRoom('room')).toBeUndefined();
    lobby.insertRoom('room');
    expect(lobby.isRoomNameTaken('room')).toBeTruthy();
    expect(lobby.findRoom('room')).toBeDefined();
  });

  it('adds socket and pushes updates', () => {
    const mockSocket = new MockSocket();
    lobby.addSocket(mockSocket);
    expect(mockSocket.emitInvoked).toBe(1);
    lobby.insertRoom('room');
    expect(mockSocket.emitInvoked).toBe(2);
    {
      const obj = JSON.parse(mockSocket.latestEmittedMessage) as LobbyState;
      expect(obj.updatedRooms).toHaveProperty('room');
    }
    lobby.insertRoom('room2');
    expect(mockSocket.emitInvoked).toBe(3);
    {
      const obj = JSON.parse(mockSocket.latestEmittedMessage) as LobbyState;
      expect(Object.keys(obj.updatedRooms)).toHaveLength(1);
      expect(obj.updatedRooms).toHaveProperty('room2');
    }

    lobby.startGames();
    jest.advanceTimersByTime(1000);
    expect(mockSocket.emitInvoked).toBe(4);
    {
      const obj = JSON.parse(mockSocket.latestEmittedMessage) as LobbyState;
      expect(Object.keys(obj.updatedRooms)).toHaveLength(2);
    }
    jest.advanceTimersByTime(1000);
    expect(mockSocket.emitInvoked).toBe(5);
    {  // no update from rooms, no .updatedRooms
      const obj = JSON.parse(mockSocket.latestEmittedMessage) as LobbyState;
      expect(Object.keys(obj.updatedRooms)).toHaveLength(0);
    }
    const room = lobby.findRoom('room');
    room.applyGameAction({ type: ABORT_MISSION });
    jest.advanceTimersByTime(1000);
    expect(mockSocket.emitInvoked).toBe(6);
    {  // no update from rooms, no .updatedRooms
      const obj = JSON.parse(mockSocket.latestEmittedMessage) as LobbyState;
      expect(Object.keys(obj.updatedRooms)).toHaveLength(1);
      expect(obj.updatedRooms).toHaveProperty('room');
    }
  });

  it('streams end event', () => {
    const mockSocket = new MockSocket();
    lobby.addSocket(mockSocket);
    expect(mockSocket.emitInvoked).toBe(1);
    lobby.setCountdown(1);
    expect(mockSocket.emitInvoked).toBe(2);
    lobby.startGames();
    expect(mockSocket.emitInvoked).toBe(2);
    jest.advanceTimersByTime(1000);
    expect(mockSocket.emitInvoked).toBe(4);
    const obj = JSON.parse(mockSocket.latestEmittedMessage) as LobbyState;
    expect(obj.status).toBe(LobbyStatus.Finished);
  });

  afterEach(() => {
    lobby?.destroy();
  });
});
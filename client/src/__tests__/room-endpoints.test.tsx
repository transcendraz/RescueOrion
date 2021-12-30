import '@testing-library/jest-dom';
import SocketIOClient from 'socket.io-client';
import axios from 'axios';
import {
  GameAction,
  GameState,
  GameStatus,
  RescueResource,
  SocketMessages,
  TRANSFER_LIFE_SUPPORT_PACKS
} from '../metadata/types';
import { API_BASE_URL } from '../config';
import { abortMission, moveSpaceship, transferEnergyCells, transferRescueResource } from '../room/actions';
import * as IDs from '../metadata/agent-ids';

let socket: SocketIOClient.Socket;

function runner(actions: { action: any, verify?: (newState: GameState) => void}[], done: () => void) {
  socket.on(SocketMessages.StateUpdate, (data: string) => {
    const newState = JSON.parse(data) as GameState;
    newState.messages = [];
    const { verify } = actions.splice(0, 1)[0];
    verify && verify(newState);
    while (actions.length > 0 && !actions[0].verify) {
      const { action } = actions.splice(0, 1)[0];
      socket.emit(SocketMessages.Action, JSON.stringify(action));
    }
    if (actions.length === 0) {
      done();
      return;
    }
    const { action } = actions[0];
    socket.emit(SocketMessages.Action, JSON.stringify(action));
  });

  while (actions.length > 0 && !actions[0].verify) {
    const { action } = actions.splice(0, 1)[0];
    socket.emit(SocketMessages.Action, JSON.stringify(action));
  }
  const { action } = actions[0];
  socket.emit(SocketMessages.Action, JSON.stringify(action));
}

describe('socket.io client in rooms without lobby', () => {

  it('disconnects immediately after when lobby is not created', (done) => {
    const socket = SocketIOClient(`${API_BASE_URL}`, {
      path: '/rooms/socket',
      query: {
        lobby: 'something',
        room: 'room',
      },
    });
    socket.on(SocketMessages.StateUpdate, () => done(new Error('Not supposed to receive game')));
    socket.on('disconnect', () => done());
  });
});

describe('socket.io client in rooms with bad inputs', () => {
  let token: string;
  let lobbyCode: number;
  const roomName = 'test room';
  let state: GameState;

  beforeAll(async (done) => {
    // admin log in
    const res = await axios.post(`${API_BASE_URL}/admin/login`,
      { username: 'RoomTest', password: 'randompasswordfortesting1023' }
    );
    token = res.data.token;
    // create a lobby
    const res2 = await axios.post(`${API_BASE_URL}/lobbies`, {}, {
      headers: { Authorization: `bearer ${token}` }
    });
    lobbyCode = res2.data.code;
    // player join the game with lobby code
    await axios.post(`${API_BASE_URL}/rooms`, {
      lobby: lobbyCode,
      room: roomName,
    });

    await axios.put(`${API_BASE_URL}/lobbies/start/${lobbyCode}`, {}, {
      headers: { Authorization: `bearer ${token}` }
    });
    done();
  });

  beforeEach((done) => {
    socket = SocketIOClient(`${API_BASE_URL}`, {
      path: '/rooms/socket',
      query: {
        lobby: lobbyCode,
        room: roomName,
      },
    });
    socket.on(SocketMessages.StateUpdate, (data: string) => {
      state = JSON.parse(data) as GameState;
      state.messages = [];
      socket.removeListener(SocketMessages.StateUpdate);
      done();
    });
  });

  it('handles legal and illegal moves correctly', (done) => {
    const actions = [
      {
        action: moveSpaceship({ gemini_1: 't1', gemini_2: 'b19' }),
      },
      {
        action: moveSpaceship({ gemini_1: 'blahhh', gemini_2: 't1' }), 
      },
      {
        action: moveSpaceship({ gemini_1: 'b19', gemini_2: 'b19' }),
      },
      {
        action: moveSpaceship({ gemini_3: 'b19', gemini_2: 'blahhh' }),
      },
      {
        action: moveSpaceship({ gemini_1: 't1', gemini_2: 'b3' }),
        verify: (newState: GameState) => {
          expect(newState.time).toBe(1);
        }
      },
    ];
    runner(actions, done);
  });

  it('ignores illegal transfer resource request', (done) => {
    const actions: { action: GameAction, verify?: (newState: GameState) => void }[] = [
      {
        action: transferEnergyCells({  // no dropping off supplies to space station
          from: IDs.GEMINI_1,
          to: IDs.SAGITTARIUS,
          count: 10,
        }),
      },
      {
        action: transferRescueResource({
          from: IDs.GEMINI_1,
          to: IDs.ORION,
          type: RescueResource.O2ReplacementCells
        }),
      },
      {
        action: transferRescueResource({
          from: IDs.GEMINI_1,
          to: IDs.SAGITTARIUS,
          type: RescueResource.OxygenRepairTeam,
        }),
      },
      {
        action: transferRescueResource({
          from: IDs.GEMINI_1,
          to: IDs.SAGITTARIUS,
          type: RescueResource.OxygenRepairTeam,
        }),
      },
      {
        action: transferRescueResource({
          from: IDs.GEMINI_1,
          to: IDs.SAGITTARIUS,
          type: RescueResource.O2ReplacementCells
        }),
        verify: (newState: GameState) => {
          expect(newState.spaceStations[IDs.SAGITTARIUS].rescueResources).toHaveLength(1);
          expect(newState.spaceships[IDs.GEMINI_1].rescueResources).toHaveLength(0);
        }
      }
    ];
    runner(actions, done);
  });

  it('does not crash given malformed requests', (done) => {
    const actions = [
      {
        action: {
          type: 'NoType',
        }
      },
      {
        action: {
          type: TRANSFER_LIFE_SUPPORT_PACKS,
          noPayload: 'lol',
        }
      },
      {
        action: {
          type: TRANSFER_LIFE_SUPPORT_PACKS,
          noPayload: {
            from: 'hey',
            to: IDs.GEMINI_2,
            counter: 444,
          }
        }
      },
      {
        action: {
          type: TRANSFER_LIFE_SUPPORT_PACKS,
          noPayload: {
            from: 'hey',
            to: IDs.GEMINI_2,
            counter: 444,
          }
        }
      },
      {
        action: {
          type: TRANSFER_LIFE_SUPPORT_PACKS,
          noPayload: {
            from: IDs.GEMINI_2,
            to: IDs.GEMINI_2,
            counter: 10,
          },
        },
        verify: (newState: GameState) => expect(newState).toEqual(state),
      },
    ];
    runner(actions, done);
  });

  it('does not respond to actions after game ends', (done) => {
    let hasResponse = false;
    const actions = [
      {
        action: abortMission(),
        verify: (newState: GameState) => {
          expect(newState.status).toBe(GameStatus.MissionAborted);
        }
      },
      {
        action: moveSpaceship({ gemini_1: 't1', gemini_2: 't1' }),
        verify: (newState: GameState) => {
          hasResponse = true;
        }
      }
    ];
    runner(actions, done);
    setTimeout(() => hasResponse ? done(new Error('Should not receive a message')) : done());
  });

  afterEach(async (done) => {
    socket.disconnected || socket.disconnect();
    await axios.post(`${API_BASE_URL}/rooms/restart/${lobbyCode}/${roomName}`, {}, {
      headers: { Authorization: `bearer ${token}` }
    });
    done();
  });

  afterAll(async (done) => {
    await axios.delete(`${API_BASE_URL}/lobbies/${lobbyCode}`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    done();
  });
});

import '@testing-library/jest-dom';
import axios from 'axios';
import SocketIOClient, { Socket } from 'socket.io-client';
import { API_BASE_URL } from '../config';
import waitFor from 'wait-for-expect';
import { LobbyState, SocketMessages } from '../metadata/types';

describe('lobby endpoints', () => {
  let token1: string;
  let token2: string;
  
  beforeAll(async (done) => {
    {
      const res = await axios.post(`${API_BASE_URL}/admin/login`, {
        username: 'LobbyTest',
        password: 'randompasswordfortesting1023',
      });
      token1 = res.data.token;
    }
    {
      const res = await axios.post(`${API_BASE_URL}/admin/login`, {
        username: 'LobbyTest2',
        password: 'randompasswordfortesting1023',
      });
      token2 = res.data.token;
    }
    done();
  });

  it('creates a lobby', async (done) => {
    let newLobbyCode;
    let newLobbyCreateTime;
    let lobbyList1, lobbyList2;
    {
      let res = await axios.get(`${API_BASE_URL}/lobbies`, {
        headers: { Authorization: `Bearer ${token1}`}
      });
      lobbyList1 = res.data;
      res = await axios.get(`${API_BASE_URL}/lobbies`, {
        headers: { Authorization: `Bearer ${token2}`}
      });
      lobbyList2 = res.data;
    }
    {
      const res = await axios.post(`${API_BASE_URL}/lobbies`, {}, {
        headers: { Authorization: `Bearer ${token1}` }
      });
      newLobbyCode = res.data.code;
      newLobbyCreateTime = res.data.createTime;
    }
    {
      const res = await axios.get(`${API_BASE_URL}/lobbies/${newLobbyCode}`, {
        headers: { Authorization: `Bearer ${token1}` }
      });
      expect(res.data.createTime).toBe(newLobbyCreateTime);
      try {
        await axios.get(`${API_BASE_URL}/lobbies/${newLobbyCode}`, {
          headers: { Authorization: `Bearer ${token2}` }
        });
      } catch (err) {
        expect(err.response.status).toBe(404);
      }
    }
    {
      let res = await axios.get(`${API_BASE_URL}/lobbies`, {
        headers: { Authorization: `Bearer ${token1}`}
      });
      expect(res.data).toHaveLength(lobbyList1.length + 1);
      expect(res.data[0].code).toBe(newLobbyCode);
      res = await axios.get(`${API_BASE_URL}/lobbies`, {
        headers: { Authorization: `Bearer ${token2}`}
      });
      expect(res.data).toHaveLength(lobbyList2.length);
    }
    try {
      let res = await axios.get(`${API_BASE_URL}/lobbies/${newLobbyCode}`, {
        headers: { Authorization: `Bearer ${token1} `}
      });
      expect(res).toBeDefined();
      res = await axios.get(`${API_BASE_URL}/lobbies/${newLobbyCode}`, {
        headers: { Authorization: `Bearer ${token2} `}
      });
      done(new Error('Should\'ve failed'));
    } catch (err) { }
    await axios.delete(`${API_BASE_URL}/lobbies/${newLobbyCode}`, {
      headers: { Authorization: `Bearer ${token1} `}
    });
    done();
  });

  it('deletes a lobby', async (done) => {
    const res = await axios.get(`${API_BASE_URL}/lobbies`, {
      headers: { Authorization: `Bearer ${token1}`}
    });
    let lobbies;
    {
      let res = await axios.get(`${API_BASE_URL}/lobbies`, {
        headers: { Authorization: `Bearer ${token1}`}
      });
      lobbies = res.data;
    }
    try {
      await axios.delete(`${API_BASE_URL}/lobbies/${res.data.code}`, {
        headers: { Authorization: `Bearer ${token1} `}
      });
      expect(1).toBe(1);
      await axios.delete(`${API_BASE_URL}/lobbies/${res.data.code}`, {
        headers: { Authorization: `Bearer ${token1} `}
      });
      done(new Error('Should\'ve failed'));
    } catch (err) {
      expect(err.response.status).toBe(404);
    }
    {
      let res = await axios.get(`${API_BASE_URL}/lobbies`, {
        headers: { Authorization: `Bearer ${token1}`}
      });
      expect(res.data).toEqual(lobbies);
    }
    done();
  });
});

describe('lobby socket and endpoints', () => {
  let token: string;
  let sockets: SocketIOClient.Socket[];
  let lobby: number;

  beforeAll(async (done) => {
    const res = await axios.post(`${API_BASE_URL}/admin/login`, {
      username: 'LobbyTest',
      password: 'randompasswordfortesting1023',
    });
    token = res.data.token;
    jest.setTimeout(10000);
    done();
  });

  beforeEach(async (done) => {
    const res = await axios.post(`${API_BASE_URL}/lobbies`, {}, {
      headers: { Authorization: `Bearer ${token}` }
    });
    lobby = res.data.code;
    sockets = [
      SocketIOClient(`${API_BASE_URL}`, {
        path: '/lobbies/socket',
        query: {
          lobby: lobby,
          token: token,
        },
      }),
      SocketIOClient(`${API_BASE_URL}`, {
        path: '/lobbies/socket',
        query: {
          lobby: lobby,
          token: token,
        },
      }),
    ];
    done();
  });

  it('both receive lobby status (including bad inputs)', async (done) => {
    let callCount = 0;
    sockets.forEach((socket) => socket.on(SocketMessages.LobbyUpdate, () => {
      ++callCount;
    }));
    waitFor(() => expect(callCount).toBe(2));

    await axios.put(`${API_BASE_URL}/lobbies/countdown/${lobby}`, {
      countdown: 3600,
    }, {
      headers: { Authorization: `Bearer ${token}` }
    });
    waitFor(() => expect(callCount).toBe(4));

    await axios.put(`${API_BASE_URL}/lobbies/start/${lobby}`, {}, {
      headers: { Authorization: `Bearer ${token}` }
    });
    
    let ticks = [0, 0];
    sockets.forEach((socket, index) => {
      socket.removeListener(SocketMessages.LobbyUpdate);
      socket.on(SocketMessages.LobbyUpdate, (data: string) => {
        const state = JSON.parse(data) as LobbyState;
        expect(state.gameDuration.duration).toBe(++ticks[index]);
        if (ticks[index] > 3) {
          done();
        }
      });
    });
  });

  it('cannot set time or join after start', async (done) => {

    await axios.put(`${API_BASE_URL}/lobbies/start/${lobby}`, {}, {
      headers: { Authorization: `Bearer ${token}` }
    });

    try {
      await axios.put(`${API_BASE_URL}/lobbies/countdown/${lobby}`, {
        countdown: 3600,
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      done(new Error('Should not reach here'));
    } catch (err) {
      expect(err.response.status).toBe(403);
    }

    try {
      await axios.post(`${API_BASE_URL}/rooms`, {
        lobby: lobby,
        room: 'any',
      });
      done(new Error('Should not reach here'));
    } catch (err) {
      expect(err.response.status).toBe(404);
    }
    done();
  });

  it('errors correctly on bad input', async (done) => {
    try {
      await axios.put(`${API_BASE_URL}/lobbies/start/${lobby}222`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      done(new Error('Should not reach here'));
    } catch (err) {
      expect(err.response.status).toBe(404);  
    }

    try {
      await axios.put(`${API_BASE_URL}/lobbies/countdown/${lobby}`, {
        countdown: 0,
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      done(new Error('Should not reach here'));
    } catch (err) {
      expect(err.response.status).toBe(400);
    }

    try {
      await axios.put(`${API_BASE_URL}/lobbies/countdown/${lobby}`, {
        countdown: 9684135168412,
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      done(new Error('Should not reach here'));
    } catch (err) {
      expect(err.response.status).toBe(400);
    }
    done();
  });

  afterEach(async (done) => {
    sockets.forEach((socket) => socket.disconnect());
    await axios.delete(`${API_BASE_URL}/lobbies/${lobby}`, {
      headers: { Authorization: `Bearer ${token}`}
    });
    done();
  });
  
  afterAll(() => jest.setTimeout(5000));
});
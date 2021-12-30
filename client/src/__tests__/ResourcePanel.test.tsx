import { act } from '@testing-library/react';
import waitFor from 'wait-for-expect';
import '@testing-library/jest-dom';
import '@testing-library/jest-dom/extend-expect'
import axios from 'axios';
import { API_BASE_URL } from '../config';
import {mount, ReactWrapper} from 'enzyme';

import React from 'react';
import Room from '../room/index';
import ResourcePanel from '../room/ResourcePanel';
import GameBoard from '../room/GameBoard';
import ConfirmMoveModal from '../room/modal/ConfirmMoveModal';

describe('Load resource panel and updates with move', () => {
  let token: string;
  let lobbyCode: string;
  let room: ReactWrapper;
  let gameBoard: ReactWrapper;

  const confirmMove = async(moveLocation: string, previousEnergy: string) => {
    // press next move to moved location
    const moveButtons = gameBoard.find(`[data-testid="move-${moveLocation}"]`);
    expect(moveButtons.find(`div[data-testid="move-${moveLocation}-gemini12"]`)).toHaveLength(1);
    moveButtons.find(`div[data-testid="move-${moveLocation}-gemini12"]`).simulate('click');
    // open confirm move dialog
    gameBoard.find('div[data-testid="confirm-move-dialog"]').simulate('click');
    await act(async () => {
      await waitFor(() => {
        room.update();
        gameBoard = room.find(GameBoard);
        // should render confirm move modal
        expect(gameBoard.find(ConfirmMoveModal)).toHaveLength(1)
      });
    });
  
    // confirm move
    expect(gameBoard.find('div[data-testid="confirm-move-button"]')).toHaveLength(1);
    gameBoard.find('div[data-testid="confirm-move-button"]').simulate('click');
    await act(async () => {
      await waitFor(() => {
        room.update();
        gameBoard = room.find(GameBoard);
        // confirm modal should disappear and resource panel updated
        expect(gameBoard.find(ConfirmMoveModal)).toHaveLength(0);
        expect(gameBoard.find(ResourcePanel).find('div[data-testid="energy-gemini1"]').text().includes(previousEnergy)).toBeFalsy();
      });
    });
  }

  const checkResource = (g1Energy: string, g1LifeSupport: string, g1Resource: string, g2Energy: string, g2LifeSupport: string, g2Resource: string) => {
    const resourcePanel = gameBoard.find(ResourcePanel);
    // gemini 1
    expect(resourcePanel.find('div[data-testid="energy-gemini1"]').text()).toEqual(g1Energy);
    expect(resourcePanel.find('div[data-testid="lifeSupport-gemini1"]').text()).toEqual(g1LifeSupport);
    expect(resourcePanel.find('div[data-testid="resource-gemini1"]').text().includes(g1Resource)).toBeTruthy();
    // gemini 2
    expect(resourcePanel.find('div[data-testid="energy-gemini2"]').text()).toEqual(g2Energy);
    expect(resourcePanel.find('div[data-testid="lifeSupport-gemini2"]').text()).toEqual(g2LifeSupport);
    expect(resourcePanel.find('div[data-testid="resource-gemini2"]').text().includes(g2Resource)).toBeTruthy();
  }

  beforeAll(async (done) => {
    // admin log in
    const res = await axios.post(`${API_BASE_URL}/admin/login`,
      { username: 'GameboardTest', password: 'randompasswordfortesting1023' }
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
      room: "testRoom",
    });
    room = mount(<Room location={{
      hash: "",
      key: "d2o3w6",
      pathname: "/rooms",
      search: `?lobby=${lobbyCode}&room=testRoom`,
      state: undefined,
    }} />);
    // start game from lobby list
    await act(async () => {
      await axios.put(`${API_BASE_URL}/lobbies/start/${lobbyCode}`, {}, {
        headers: { Authorization: `bearer ${token}` }
      });
    });
    done();
  });

  beforeEach(async (done) => {
    await act(async () => {
      await waitFor(() => {
        room.update();
        // should render game board
        expect(room.find(GameBoard)).toHaveLength(1);
      });
    });
    gameBoard = room.find(GameBoard);
    done();
  })

  it('should match initial resource level', async (done) => {
    // check resource panel initial resource level
    expect(gameBoard.find(ResourcePanel)).toHaveLength(1);
    checkResource('40', '80', 'O2 Replacement Cells', '40','100', '');
    done();
  });

  it('should reduce correctly after a starway move', async (done) => {
    // press next move to Beacon Star 3
    await confirmMove('b3', '40');

    // check resource panel resource level
    gameBoard.update();
    checkResource('39', '79', 'O2 Replacement Cells', '40','100', '');
    done();
  });

  it('should reduce correctly after a hypergate move', async (done) => {
    // press next move to Hypergate 1
    await confirmMove('h1', '39');

    // check resource panel resource level
    gameBoard.update();
    checkResource('38', '78', 'O2 Replacement Cells', '40','100', '');

    // press next move to HyperGate 2
    await confirmMove('h2', '38');

    // check resource panel initial resource level
    gameBoard.update();
    checkResource('18', '73', 'O2 Replacement Cells', '40','100', '');
    done();
  });

  it('should reduce correctly after a timeportal move', async (done) => {
    // press next move to Time Portal 5
    await confirmMove('t5', '18');

    // check resource panel resource level
    gameBoard.update();
    checkResource('17', '72', 'O2 Replacement Cells', '40','100', '');

    // press next move to Time Portal 1
    await confirmMove('t1', '17');

    // check resource panel initial resource level
    gameBoard.update();
    checkResource('7', '42', 'O2 Replacement Cells', '40','100', '');
    done();
  });

  afterAll(async (done) => {
    await act(async () => {
      await axios.delete(`${API_BASE_URL}/lobbies/${lobbyCode}`, {
        headers: { Authorization: `bearer ${token}` }
      })
    });
    done();
  })

})
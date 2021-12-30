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
import MessageModal from '../room/modal/MessageModal';
import OutOfResourceModal from '../room/modal/OutOfResourceModal';

describe('Load out of resource modal', () => {
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

  it('should render warning if resource is below 10', async (done) => {
    // make moves to consume energy below 10
    await confirmMove('b3', '40');
    await confirmMove('h1', '39');
    await confirmMove('h2', '38');
    await confirmMove('t5', '18');
    await confirmMove('t1', '17');
    expect(gameBoard.find(MessageModal)).toHaveLength(3);
    // find the warning message modal
    gameBoard.find(MessageModal).forEach((modal) => {
      const header = modal.find('div[data-testid="message-modal-header"]');
      if(header.length !== 0) {
        expect(header.text().includes('Warning!')).toBeTruthy();
      }
    })
    done();
  });

  it('should render out of resource modal if resource is below 0', async (done) => {
    // make moves to consume energy below 0
    await confirmMove('t3', '7');
    // find the out of resource modal
    expect(gameBoard.find(OutOfResourceModal)).toHaveLength(1);
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
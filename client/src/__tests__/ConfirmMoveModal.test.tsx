import { act } from '@testing-library/react';
import waitFor from 'wait-for-expect';
import '@testing-library/jest-dom';
import '@testing-library/jest-dom/extend-expect'
import axios from 'axios';
import { API_BASE_URL } from '../config';
import {mount, ReactWrapper} from 'enzyme';

import React from 'react';
import Room from '../room/index';
import ButtonGroup from '../room/ButtonGroup';
import GameBoard from '../room/GameBoard';
import ConfirmMoveModal from '../room/modal/ConfirmMoveModal';

describe('Load confirm move modal', () => {
  let token: string;
  let lobbyCode: string;
  let room: ReactWrapper;
  let gameBoard: ReactWrapper;

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

  it('should not open if no move selected', async (done) => {
    // click confirm move without select any move
    expect(gameBoard.find('div[data-testid="confirm-move-dialog"]')).toHaveLength(1);
    const confirmMoveDialogButton = gameBoard.find('div[data-testid="confirm-move-dialog"]');
    confirmMoveDialogButton.simulate('click');
    // show not open confirm move dialog
    expect(gameBoard.find(ConfirmMoveModal)).toHaveLength(0);
    done();
  });

  it('should render modal if select any move', async (done) => {
    // press next move to Beacon Star 3
    const moveButtons = gameBoard.find('[data-testid="move-b3"]');
    expect(moveButtons.find('div[data-testid="move-b3-gemini12"]')).toHaveLength(1);
    moveButtons.find('div[data-testid="move-b3-gemini12"]').simulate('click');

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
    done();
  });

  it('should not change gameBoard if click cancel move', async (done) => {
    // cancel move 
    expect(gameBoard.find(ConfirmMoveModal)).toHaveLength(1);
    expect(gameBoard.find('div[data-testid="cancel-move-button"]')).toHaveLength(1);
    gameBoard.find('div[data-testid="cancel-move-button"]').simulate('click');
    await act(async () => {
      await waitFor(() => {
        room.update();
        gameBoard = room.find(GameBoard);
        // see confirm move modal disappear
        expect(gameBoard.find(ConfirmMoveModal)).toHaveLength(0);
      });
    });
    
    // buttons remain start state
    expect(gameBoard.find(ButtonGroup)).toHaveLength(3);
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
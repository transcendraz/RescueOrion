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

describe('Load move buttons', () => {
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

  it('should render buttons at start point', async (done) => {
    // check buttons rendered at start position
    expect(gameBoard.find(ButtonGroup)).toHaveLength(3);
    expect(gameBoard.find('[data-testid="move-b3"]')).toHaveLength(1);
    expect(gameBoard.find('[data-testid="move-t1"]')).toHaveLength(1);
    expect(gameBoard.find('[data-testid="move-sagittarius"]')).toHaveLength(1);
    done();
  });

  it('should render proper next move buttons', async (done) => {
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
        // should render game board
        expect(gameBoard.find(ConfirmMoveModal)).toHaveLength(1)
      });
    });

    // confirm move
    expect(gameBoard.find(ConfirmMoveModal)).toHaveLength(1)
    expect(gameBoard.find('div[data-testid="confirm-move-button"]')).toHaveLength(1);
    gameBoard.find('div[data-testid="confirm-move-button"]').simulate('click');
    await act(async () => {
      await waitFor(() => {
        room.update();
        gameBoard = room.find(GameBoard);
        // see expected new neighbor buttons
        expect(gameBoard.find(ButtonGroup)).toHaveLength(5);
      });
    });
    // see expected new neighbor buttons
    expect(gameBoard.find('[data-testid="move-b3"]')).toHaveLength(1);
    expect(gameBoard.find('[data-testid="move-sagittarius"]')).toHaveLength(1);
    expect(gameBoard.find('[data-testid="move-b2"]')).toHaveLength(1);
    expect(gameBoard.find('[data-testid="move-h1"]')).toHaveLength(1);
    expect(gameBoard.find('[data-testid="move-b4"]')).toHaveLength(1);
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
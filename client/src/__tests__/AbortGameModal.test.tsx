import { act } from '@testing-library/react';
import waitFor from 'wait-for-expect';
import '@testing-library/jest-dom';
import '@testing-library/jest-dom/extend-expect'
import axios from 'axios';
import { API_BASE_URL } from '../config';
import {mount, ReactWrapper} from 'enzyme';

import React from 'react';
import Room from '../room/index';
import GameBoard from '../room/GameBoard';
import ConfirmAbortMissionModal from '../room/modal/ConfirmAbortMissionModal';
import TimeOutModal from '../room/modal/TimeOutModal';
import AbortGameModal from '../room/modal/AbortGameModal';

describe('Load abort game modal', () => {
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

  it('should stay if cancel abort mission', async (done) => {
    expect(gameBoard.find('div[data-testid="abort-mission-dialog"]')).toHaveLength(1);
    gameBoard.find('div[data-testid="abort-mission-dialog"]').simulate('click');
    await act(async () => {
      await waitFor(() => {
        room.update();
        // should render confirm abort mission modal
        gameBoard = room.find(GameBoard);
        expect(gameBoard.find(ConfirmAbortMissionModal)).toHaveLength(1);
        expect(gameBoard.find('div[data-testid="abort-mission-cancel"]')).toHaveLength(1);
      });
    });
    // click cancel 
    gameBoard.find('div[data-testid="abort-mission-cancel"]').simulate('click');

    await act(async () => {
      await waitFor(() => {
        room.update();
        gameBoard = room.find(GameBoard);
        // should see confirm window close
        expect(gameBoard.find(ConfirmAbortMissionModal)).toHaveLength(0);
      });
    });

    // should not see abort mission modal
    expect(gameBoard.find(AbortGameModal)).toHaveLength(0);

    done();
  });

  it('should see abort modal if confirm abort mission', async (done) => {
    expect(gameBoard.find('div[data-testid="abort-mission-dialog"]')).toHaveLength(1);
    gameBoard.find('div[data-testid="abort-mission-dialog"]').simulate('click');
    await act(async () => {
      await waitFor(() => {
        room.update();
        // should render confirm abort mission modal
        gameBoard = room.find(GameBoard);
        expect(gameBoard.find(ConfirmAbortMissionModal)).toHaveLength(1);
        expect(gameBoard.find('div[data-testid="abort-mission-confirm"]')).toHaveLength(1);
      });
    });
    // click confirm 
    gameBoard.find('div[data-testid="abort-mission-confirm"]').simulate('click');

    await act(async () => {
      await waitFor(() => {
        room.update();
        gameBoard = room.find(GameBoard);
        // should see abort mission modal
          expect(gameBoard.find(AbortGameModal)).toHaveLength(1);
      });
    });
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
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
import TimeOutModal from '../room/modal/TimeOutModal';
import { RightPanelTriangle } from '../room/modal/SpaceStationModal';

describe('Load time out modal', () => {
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

  it('should render time out modal if travel days > 30', async (done) => {
    // make more than 30 moves
    await confirmMove('b3', '40');
    await confirmMove('b4', '39');
    await confirmMove('b16', '38');
    await confirmMove('b17', '37');
    await confirmMove('b14', '36');
    await confirmMove('b32', '35');
    await confirmMove('b33', '34');
    await confirmMove('b11', '33');
    await confirmMove('t2', '32');

    await act(async () => {
      let infoButton = gameBoard.find('button[data-testid="orion-info-button"]');
      await waitFor(() => {
        infoButton = gameBoard.find('button[data-testid="orion-info-button"]');
        expect(infoButton).toHaveLength(1);
      });
      infoButton.simulate('click');
      const button = room.find(RightPanelTriangle);
      button.simulate('click');
    });

    await confirmMove('t2', '32');
    await confirmMove('t2', '31');
    await confirmMove('t2', '30');
    await confirmMove('t2', '29');
    await confirmMove('t2', '28');
    await confirmMove('t2', '27');
    await confirmMove('t2', '26');
    await confirmMove('t2', '25');
    await confirmMove('t2', '24');
    await confirmMove('t2', '23');
    await confirmMove('t2', '22');
    await confirmMove('t2', '21');
    await confirmMove('t2', '20');
    await confirmMove('t2', '19');
    await confirmMove('t2', '18');
    await confirmMove('t2', '17');
    await confirmMove('t2', '16');
    await confirmMove('t2', '15');
    await confirmMove('t2', '14');
    await confirmMove('t2', '13');
    await confirmMove('t2', '12');
    await confirmMove('t2', '11');
    await confirmMove('t2', '10');
    // render time out modal
    expect(gameBoard.find(TimeOutModal)).toHaveLength(1);
    expect(gameBoard.find('div[data-testid="travel-day"]').text()).toEqual('31');

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
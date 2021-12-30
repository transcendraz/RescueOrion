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
import RebalanceResourceModal from '../room/modal/RebalanceResourceModal';
import ConfirmMoveModal from '../room/modal/ConfirmMoveModal';
import ResourcePanel from '../room/ResourcePanel';

describe('Load rebalance resource modal', () => {
  let token: string;
  let lobbyCode: string;
  let room: ReactWrapper;
  let gameBoard: ReactWrapper;

  const confirmMove = async(moveShip:string,  moveLocation: string, previousEnergy: string, other: string, otherShip: string) => {
    // press next move to moved location
    const moveButtons = gameBoard.find(`[data-testid="move-${moveLocation}"]`);
    const otherButtons = gameBoard.find(`[data-testid="move-${other}"]`);
    expect(moveButtons.find(`div[data-testid="move-${moveLocation}-${moveShip}"]`)).toHaveLength(1);
    expect(otherButtons.find(`div[data-testid="move-${other}-${otherShip}"]`)).toHaveLength(1);
    moveButtons.find(`div[data-testid="move-${moveLocation}-${moveShip}"]`).simulate('click');
    otherButtons.find(`div[data-testid="move-${other}-${otherShip}"]`).simulate('click');
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
        expect(gameBoard.find(ResourcePanel).find(`div[data-testid="energy-${moveShip}"]`).text().includes(previousEnergy)).toBeFalsy();
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

  it('should open move resource dialog if click button', async (done) => {
    // click Move Resource button
    expect(gameBoard.find('div[data-testid="move-resource-dialog"]')).toHaveLength(1);
    gameBoard.find('div[data-testid="move-resource-dialog"]').simulate('click');

    // should see rebalance resource dialog
    await act(async () => {
      await waitFor(() => {
        room.update();
        gameBoard = room.find(GameBoard);
        // should render game board
        expect(gameBoard.find(RebalanceResourceModal)).toHaveLength(1);
      });
    });
    // close the modal
    gameBoard.find(RebalanceResourceModal).find('DismissButton[data-testid="move-resource-close-button"]').simulate('click');
    done();
  });

  it('should fail to transfer invalid resource', async (done) => {
    // click Move Resource button
    gameBoard.find('div[data-testid="move-resource-dialog"]').simulate('click');

    // should see rebalance resource dialog
    await act(async () => {
      await waitFor(() => {
        room.update();
        gameBoard = room.find(GameBoard);
        // should render game board
        expect(gameBoard.find(RebalanceResourceModal)).toHaveLength(1);
      });
    });

    // transfer all resources and fail to see changes
    const resourceModal = gameBoard.find(RebalanceResourceModal);
    expect(resourceModal.find('input[data-testid="move-resource-gemini2-energy-input"]')).toHaveLength(1);
    resourceModal.find('input[data-testid="move-resource-gemini2-energy-input"]').simulate('change', {target: { value: '40'}});
    resourceModal.find('div[data-testid="move-resource-gemini2-energy-button"]').simulate('click');
    checkResource('40', '80', 'O2 Replacement Cells', '40','100', '');

    // close the modal 
    resourceModal.find('DismissButton[data-testid="move-resource-close-button"]').simulate('click');

    done();
  });

  it('should success to transfer valid resource', async (done) => {
    // click Move Resource button
    gameBoard.find('div[data-testid="move-resource-dialog"]').simulate('click');

    // should see rebalance resource dialog
    await act(async () => {
      await waitFor(() => {
        room.update();
        gameBoard = room.find(GameBoard);
        // should render game board
        expect(gameBoard.find(RebalanceResourceModal)).toHaveLength(1);
      });
    });

    // input valid number and success to see changes
    const resourceModal = gameBoard.find(RebalanceResourceModal);
    expect(resourceModal.find('input[data-testid="move-resource-gemini2-energy-input"]')).toHaveLength(1);
    resourceModal.find('input[data-testid="move-resource-gemini2-energy-input"]').simulate('change', {target: { value: '10'}});
    resourceModal.find('div[data-testid="move-resource-gemini2-energy-button"]').simulate('click');
    // close the modal
    resourceModal.find('DismissButton[data-testid="move-resource-close-button"]').simulate('click');
    await act(async () => {
      await waitFor(() => {
        room.update();
        gameBoard = room.find(GameBoard);
        // should render game board
        expect(gameBoard.find(ResourcePanel).find('div[data-testid="energy-gemini1"]').text().includes('40')).toBeFalsy();
      });
    });
    checkResource('50', '80', 'O2 Replacement Cells', '30','100', '');

    done();
  });

  it('should not open the dialog if two geminis are at different location', async (done) => {
    // move gemini1 to b3
    await confirmMove('gemini1', 'b3', '50', 'sagittarius', 'gemini2');

    // move gemini2 to t1
    await confirmMove('gemini2', 't1', '30', 'b3', 'gemini1');

    // should not open the move resource dialog
    gameBoard = room.find(GameBoard);
    gameBoard.find('div[data-testid="move-resource-dialog"]').simulate('click');
    expect(gameBoard.find(RebalanceResourceModal)).toHaveLength(0);

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
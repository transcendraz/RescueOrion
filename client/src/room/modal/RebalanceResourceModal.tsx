import React, {
  ChangeEvent,
  KeyboardEvent,
  Dispatch,
  SetStateAction,
  useState,
} from 'react';
import styled from 'styled-components';
import { useSelector, useDispatch } from '../redux-hook-adapters';

import {
  BaseModalTextBackground,
  Modal,
  ModalBackground,
  DismissButton,
} from './modal';
import { GameState } from '../../metadata/types';
import * as IDs from '../../metadata/agent-ids';
import {
  transferEnergyCells,
  transferRescueResource,
  transferLifeSupportPacks,
} from '../actions';
import Triangle from './TriangleButton';

const Gemini = styled.img`
  width: 120px;
  position: absolute;
  top: 0;
  left: 10px;
`;

const ModalWrapper = styled(BaseModalTextBackground)`
  width: 1000px;
  padding: 0;
`;

const StyledModal = styled(Modal)`
  position: relative;
  height: 520px;
`;

const StyledButton = styled(DismissButton)`
  position: absolute;
  right: 10px;
  top: 10px;
`;

const Column = styled.div`
  display: inline-block;
  overflow: auto;
  vertical-align: top;
  position: relative;
`;

const SpaceshipName = styled.h1`
  font-family: Orbitron;
  text-align: center;
  margin-bottom: 30px;
`;

const ResourceName = styled.div`
  font-family: 'Roboto' sans-serif;
  text-align: center;
  font-weight: 500;
  font-size: 24px;
  margin-top: 10px;
  margin-bottom: 5px;
  position: relative;
`;

const ResourceCount = styled.div`
  font-family: 'Roboto' sans-serif;
  text-align: center;
  font-weight: bold;
  font-size: 40px;
  position: relative;
`;

const Divider = styled.div`
  border-bottom: 1px solid grey;
  margin-top: 10px;
`;

const LeftPanelTriangle = styled(Triangle)`
  position: absolute;
  right: 5px;
  top: 0;
`;

const ResourceCountInput = styled.input`
  position: absolute;
  bottom: 0;
  font-size: 36px;
  width: 80px;
  text-align: center;
  background-color: transparent;
  border-radius: 5px;
  border: none;
  ${(props: { incorrect: boolean }) => props.incorrect ?
    `background-color: rgba(255, 0, 0, 0.5);`
    :
    `border-bottom: 1px solid grey;`
  }

  /* Chrome, Safari, Edge, Opera */
  &::-webkit-outer-spin-button,
  &::-webkit-inner-spin-button {
    -webkit-appearance: none;
    margin: 0;
  }

  /* Firefox */
  &[type=number] {
    -moz-appearance: textfield;
  }
`;

const LeftPanelInput = styled(ResourceCountInput)`
  right: 0;
`;

function handleKeyDown(onSubmit: () => void, setIncorrectFunction: Dispatch<SetStateAction<boolean>>): (event: KeyboardEvent<HTMLInputElement>) => void {
  return (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      onSubmit();
    } else {
      setIncorrectFunction(false);
    }
  };
}

function handleInput(_: string, setStateFunction: Dispatch<SetStateAction<string>>)
    : (event: ChangeEvent<HTMLInputElement>) => void {
  return (event: ChangeEvent<HTMLInputElement>) => {
    const input = event.target.value;
    if (input.length > 3) { return; }
    const trimmed = input.replace(/\D/g, '');
    setStateFunction(trimmed);
  };
}

// If bad input, return -1
function verifyInput(max: number, input: string): number {
  if (input.length === 0) { return 0; }
  const count = Number.parseInt(input);
  if (count === Number.NaN) { return -1; }
  if (count > max - 1) { return -1; }
  return count;
}

function Gemini1Panel() {

  const gemini_1 = useSelector((state: GameState) => state.spaceships[IDs.GEMINI_1]);
  const dispatch = useDispatch();

  const [energyCellsInput, setEnergyCellsInput] = useState('');
  const [energyCellsIncorrect, setEnergyCellsIncorrect] = useState(false);
  const [lifeSupportPacksInput, setLifeSupportPacksInput] = useState('');
  const [lifeSupportPacksIncorrect, setLifeSupportPacksIncorrect] = useState(false);

  function energyCellSubmit() {
    const count = verifyInput(gemini_1.energyCells, energyCellsInput);
    if (count === -1) {
      setEnergyCellsIncorrect(true);
      return;
    }
    setEnergyCellsInput('');
    dispatch(transferEnergyCells({
      from: IDs.GEMINI_1,
      to: IDs.GEMINI_2,
      count: count,
    }));
  }

  function lifeSupportPacksSubmit() {
    const count = verifyInput(gemini_1.lifeSupportPacks, lifeSupportPacksInput);
    if (count === -1) {
      setLifeSupportPacksIncorrect(true);
      return;
    }
    setLifeSupportPacksInput('');
    dispatch(transferLifeSupportPacks({
      from: IDs.GEMINI_1,
      to: IDs.GEMINI_2,
      count: count,
    }));
  }

  return <>
    <Gemini
      src={`${process.env.PUBLIC_URL}/Gemini1.png`}
    />
    <SpaceshipName>Gemini 1</SpaceshipName>
    <ResourceName>
      Energy Cells
      <LeftPanelTriangle
        onClick={energyCellSubmit}
      />
    </ResourceName>
    <ResourceCount>
      {gemini_1.energyCells}
      <LeftPanelInput
        incorrect={energyCellsIncorrect}
        placeholder={'0'}
        value={energyCellsInput}
        onChange={handleInput(energyCellsInput, setEnergyCellsInput)}
        onKeyDown={handleKeyDown(energyCellSubmit, setEnergyCellsIncorrect)}
      />
    </ResourceCount>
    <ResourceName>
      Life Support Packs
      <LeftPanelTriangle
        onClick={lifeSupportPacksSubmit}
      />
    </ResourceName>
    <ResourceCount>
      {gemini_1.lifeSupportPacks}
      <LeftPanelInput
        incorrect={lifeSupportPacksIncorrect}
        placeholder={'0'}
        value={lifeSupportPacksInput}
        onChange={handleInput(lifeSupportPacksInput, setLifeSupportPacksInput)}
        onKeyDown={handleKeyDown(lifeSupportPacksSubmit, setLifeSupportPacksIncorrect)}
      />          
    </ResourceCount>
    <Divider />
    {
      gemini_1.rescueResources.map((resource, i) => 
      <ResourceName key={i}>
          {resource}
          <LeftPanelTriangle
            onClick={() => {
              dispatch(transferRescueResource({
                from: IDs.GEMINI_1,
                to: IDs.GEMINI_2,
                type: resource,
              }));
            }}
          />
        </ResourceName>
      )
    }
  </>;
}


const RightPanelInput = styled(ResourceCountInput)`
  left: 0;
`;

const RightPanelTriangle = styled(Triangle)`
  position: absolute;
  left: 5px;
  top: 0;
  transform: rotate(180deg);
`;

function Gemini2Panel() {

  const gemini_2 = useSelector((state: GameState) => state.spaceships[IDs.GEMINI_2]);
  const dispatch = useDispatch();

  const [energyCellsInput, setEnergyCellsInput] = useState('');
  const [energyCellsIncorrect, setEnergyCellsIncorrect] = useState(false);
  const [lifeSupportPacksInput, setLifeSupportPacksInput] = useState('');
  const [lifeSupportPacksIncorrect, setLifeSupportPacksIncorrect] = useState(false);

  function energyCellSubmit() {
    const count = verifyInput(gemini_2.energyCells, energyCellsInput);
    if (count === -1) {
      setEnergyCellsIncorrect(true);
      return;
    }
    setEnergyCellsInput('');
    dispatch(transferEnergyCells({
      from: IDs.GEMINI_2,
      to: IDs.GEMINI_1,
      count: count,
    }));
  }

  function lifeSupportPacksSubmit() {
    const count = verifyInput(gemini_2.lifeSupportPacks, lifeSupportPacksInput);
    if (count === -1) {
      setLifeSupportPacksIncorrect(true);
      return;
    }
    setLifeSupportPacksInput('');
    dispatch(transferLifeSupportPacks({
      from: IDs.GEMINI_2,
      to: IDs.GEMINI_1,
      count: count,
    }));
  }

  return <>
    <Gemini
      src={`${process.env.PUBLIC_URL}/Gemini2.png`}
    />
    <SpaceshipName>Gemini 2</SpaceshipName>
    <ResourceName>
      Energy Cells
      <RightPanelTriangle
        data-testid="move-resource-gemini2-energy-button"
        onClick={energyCellSubmit}
      />
    </ResourceName>
    <ResourceCount>
      {gemini_2.energyCells}
      <RightPanelInput
        data-testid="move-resource-gemini2-energy-input"
        incorrect={energyCellsIncorrect}
        placeholder={'0'}
        value={energyCellsInput}
        onChange={handleInput(energyCellsInput, setEnergyCellsInput)}
        onKeyDown={handleKeyDown(energyCellSubmit, setEnergyCellsIncorrect)}
      />
    </ResourceCount>
    <ResourceName>
      Life Support Packs
      <RightPanelTriangle
        onClick={lifeSupportPacksSubmit}
      />
    </ResourceName>
    <ResourceCount>
      {gemini_2.lifeSupportPacks}
      <RightPanelInput
        incorrect={lifeSupportPacksIncorrect}
        placeholder={'0'}
        value={lifeSupportPacksInput}
        onChange={handleInput(lifeSupportPacksInput, setLifeSupportPacksInput)}
        onKeyDown={handleKeyDown(lifeSupportPacksSubmit, setLifeSupportPacksIncorrect)}
      />          
    </ResourceCount>
    <Divider />
    {
      gemini_2.rescueResources.map((resource, i) =>
        <ResourceName key={i}>
          {resource}
          <RightPanelTriangle
            onClick={() => {
              dispatch(transferRescueResource({
                from: IDs.GEMINI_2,
                to: IDs.GEMINI_1,
                type: resource,
              }));
            }}
          />
        </ResourceName>
      )
    }
  </>;
}

export default (props: {
  onClose?: () => void,
}) => {
  return <ModalBackground>
    <ModalWrapper>
      <Column style={{ width: '47%' }}>
        <StyledModal>
          <Gemini1Panel />
        </StyledModal>
      </Column>
      <Column style={{ width: '6%' }} />
      <Column style={{ width: '47%' }}>
        <StyledModal>
          <StyledButton 
            data-testid="move-resource-close-button"
            onClose={props.onClose} 
          />
          <Gemini2Panel />
        </StyledModal>
      </Column>
    </ModalWrapper>
  </ModalBackground>;
}
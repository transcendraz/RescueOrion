import React from 'react';
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
  pickUpSupplyResource,
  pickUpRescueResource,
  dropOffRescueResource
} from '../actions';
import { Message } from '../../metadata/types';
import Triangle from './TriangleButton';

const StationName = styled.div`
  font-family: Orbitron;
  text-align: center;
  font-size: 40px;
  margin-bottom: 20px;
  text-transform: uppercase;
`;

const TextInfo = styled.div`
  font-family: 'Roboto' sans-serif;
  text-align: center;
  font-weight: 500;
  font-size: 18px;
  margin-top: 10px;
  margin-bottom: 5px;
  position: relative;
  text-align: left;
`;
const ModalWrapper = styled(BaseModalTextBackground)`
  width: 1200px;
  padding: 0;
  text-align: center;
`;
const Column = styled.div`
  display: inline-block;
  overflow: auto;
  vertical-align: top;
  position: relative;
`;
const StyledModal = styled(Modal)`
  position: relative;
  height: 560px;
`;
const StyledButton = styled(DismissButton)`
  position: absolute;
  left: 0px;
  bottom: 10px;
`;

const Header = styled.div`
  font-weight: bold;
  font-size: 22px;
  text-align: center;
  color: #b62021;
  font-family: Orbitron;
`;

const Body = styled.div`
  font-family: 'Roboto' sans-serif;
  font-size: 16px;
  font-weight: 500;
`;

const SupplyGroup = styled.div`
  position: relative;
`;

const Resource = styled.div`
  font-family: 'Roboto' sans-serif;
  text-align: center;
  font-weight: 500;
  font-size: 20px;
  margin-top: 10px;
  margin-bottom: 5px;
  position: relative;
`;

const LeftPanelTriangle = styled(Triangle)`
  position: absolute;
  right: 5px;
  top: 0;
`;

const Divider = styled.div`
  border-bottom: 1px solid grey;
  margin: 10px 0;
`;

function StationPanel(props: {
  id: string,
  message: Message,
}) {
  const gameState = useSelector((state: GameState) => state);
  const station = gameState.spaceStations[props.id];
  const gemini_1 = gameState.spaceships[IDs.GEMINI_1];
  const gemini_2 = gameState.spaceships[IDs.GEMINI_2];
  const dispatch = useDispatch();

  const showResources = gemini_1.location === station.location || gemini_2.location === station.location;
  let supplyReceiverId: string;
  let resourceReceiverId: string;
  if (gemini_1.location === station.location) {
    supplyReceiverId = IDs.GEMINI_1;
    if (gemini_1.timePortalRoute.length === 0) {
      resourceReceiverId = IDs.GEMINI_1;
    }
  } else if (gemini_2.location === station.location) {
    supplyReceiverId = IDs.GEMINI_2;
    if (gemini_2.timePortalRoute.length === 0) {
      resourceReceiverId = IDs.GEMINI_2;
    }
  }

  return <>
    <StationName>
      {props.id}
    </StationName>
    <TextInfo>
      <Header>
        {props.message.title}
      </Header>
      <Body>
        {
          props.message.paragraphs.map((paragraph, i) => {
            return <p key={i}>
              {paragraph.number}
              {paragraph.text}
            </p>;
          })
        }
      </Body>
    </TextInfo>
    {
      showResources ?
      <>
        <Divider />
        <SupplyGroup>
          <Resource>
            Energy Cells: {station.energyCells}
          </Resource>
          <Resource>
            Life Support Packs: {station.lifeSupportPacks}
          </Resource>
          <LeftPanelTriangle
            style={{
              top: '50%',
              transform: 'translate(0, -50%)',
            }}
            onClick={() => {
              if (station.energyCells > 0) {
                dispatch(pickUpSupplyResource({
                  from: props.id,
                  to: supplyReceiverId,
                }));
              }
            }}
            disabled={station.energyCells === 0}
          />
        </SupplyGroup>
        <Divider
          style={{
            width: '70%',
            margin: '10px auto',
          }}
        />
        {
          station.rescueResources.map((resource, i) => 
            <Resource key={i}>
              {resource}
              <LeftPanelTriangle
                onClick={() => {
                  if (resourceReceiverId && station.canPickUp[resource]) {
                    dispatch(pickUpRescueResource({
                      from: props.id,
                      to: resourceReceiverId,
                      type: resource,
                    }));
                  }
                }}
                disabled={!resourceReceiverId || !station.canPickUp[resource]}
              />
            </Resource>
          )
        }
      </> : <></>
    }
  </>
}

const SpaceshipName = styled.h1`
  font-family: Orbitron;
  text-align: center;
  margin-bottom: 30px;
`;

export const RightPanelTriangle = styled(Triangle)`
  position: absolute;
  left: 5px;
  top: 0;
  transform: rotate(180deg);
`;

const ResourceRightAlign = styled(Resource)`
  text-align: right;
  margin-top: 10px;
`;

function Gemini1Panel(props: {
  id: string
}) {
  const gemini_1 = useSelector((state: GameState) => state.spaceships[IDs.GEMINI_1]);
  const dispatch = useDispatch();

  return <>
    <SpaceshipName>Gemini 1</SpaceshipName>
    <Resource>
      Energy Cells: {gemini_1.energyCells}
    </Resource>
    <Resource>
      Life Support Packs: {gemini_1.lifeSupportPacks}
    </Resource>
    <Divider />
    {
      gemini_1.rescueResources.map((resource, i) => 
      <ResourceRightAlign key={i}>
          {resource}
          <RightPanelTriangle
            disabled={gemini_1.timePortalRoute.length > 0}
            onClick={() => {
              if (gemini_1.timePortalRoute.length === 0) {
                dispatch(dropOffRescueResource({
                  from: IDs.GEMINI_1,
                  to: props.id,
                  type: resource,
                }));
              }
            }}
          />
        </ResourceRightAlign>
      )
    }
  </>
}

function Gemini2Panel(props: {
  id: string
}) {
  const gemini_2 = useSelector((state: GameState) => state.spaceships[IDs.GEMINI_2]);
  const dispatch = useDispatch();
  return <>
    <SpaceshipName>Gemini 2</SpaceshipName>
    <Resource>
      Energy Cells: {gemini_2.energyCells}
    </Resource>
    <Resource>
      Life Support Packs: {gemini_2.lifeSupportPacks}
    </Resource>
    <Divider />
    {
      gemini_2.rescueResources.map((resource, i) => 
      <ResourceRightAlign key={i}>
          {resource}
          <RightPanelTriangle
            disabled={gemini_2.timePortalRoute.length > 0}
            onClick={() => {
              if (gemini_2.timePortalRoute.length === 0) {
                dispatch(dropOffRescueResource({
                  from: IDs.GEMINI_2,
                  to: props.id,
                  type: resource,
                }));
              }
            }}
          />
        </ResourceRightAlign>
      )
    }
  </>
}

export default (props: {
  onClose?: () => void,
  id: string,
  message: Message,
}) => {

  const gameState = useSelector((state: GameState) => state);
  const spaceStationLocation = gameState.spaceStations[props.id].location;
  const gemini1AtStation = gameState.spaceships[IDs.GEMINI_1].location === spaceStationLocation;
  const gemini2AtStation = gameState.spaceships[IDs.GEMINI_2].location === spaceStationLocation;

  return <ModalBackground>
    <ModalWrapper>
      <Column style={{ width: '40%' }}>
        <StyledModal>
          <StationPanel
            id={props.id}
            message={props.message}
          />
          <StyledButton onClose={props.onClose} />
        </StyledModal>
      </Column>
    
      {
        gemini1AtStation ?
        <>
          <Column style={{ width: '3%' }} />
          <Column style={{ width: '27%' }}>
            <StyledModal>
              <Gemini1Panel id={props.id}/>
            </StyledModal>
          </Column>
        </>
        :
        null
      }
      {
        gemini2AtStation ?
        <>
          <Column style={{ width: '3%' }} />
          <Column style={{ width: '27%' }}>
            <StyledModal>
              <Gemini2Panel id={props.id}/>
            </StyledModal>
          </Column>
        </>
        :
        null
      }
    </ModalWrapper>
  </ModalBackground>;
}
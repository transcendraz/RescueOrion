import React, { useState } from 'react';
import { useSelector } from './redux-hook-adapters';
import styled from 'styled-components';
import { PixelPosition } from '../metadata/types';
import locationData from '../metadata/location-data';
import { spaceStationData } from '../metadata';
import SpaceStationModal from './modal/SpaceStationModal';
import { GameState } from '../metadata/types';

const StationInformationButton = styled.button`
  position: absolute; 
  font-family: 'Grandstander', cursive;
  top: ${(props: { position: PixelPosition }) => `${props.position.top}px`};
  left: ${(props: { position: PixelPosition }) => `${props.position.left - 80}px`};
  height: 30px;
  width: 30px;
  border-radius: 15px;
  line-height: 30px;
  font-size: 20px;
  &:hover {
    cursor: pointer;
  }
`;

export default (props: {
  id: string,
}) => {

  const visited = useSelector((state: GameState) => state.spaceStations[props.id].visited);

  const spaceStation = spaceStationData[props.id];
  const StationPosition = locationData[spaceStation.location].pixelPosition;
  const [showModal, setShowModal] = useState(false);

  return <>
    {
      visited ?
      <>
        <div>
          <StationInformationButton
            data-testid={`${props.id}-info-button`}
            position={StationPosition}
            onClick={() => setShowModal(true)}
          >
            i
          </StationInformationButton>
        </div>
        
        {
          showModal ?
          <SpaceStationModal
            onClose={() => setShowModal(false)}
            id={props.id}
            message={spaceStation.message}
          /> : <></>
        }
      </> : null
    }
  </>;
}
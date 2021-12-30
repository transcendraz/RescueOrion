import React from 'react';
import styled from 'styled-components';
import { PixelPosition } from '../metadata/types';
import * as IDs from '../metadata/agent-ids';
import locationData from '../metadata/location-data';

const ButtonGroupBackground = styled.div`
  position: absolute;
  background-color: rgba(18, 92, 112, 0.8);
  width: 60px;
  height: 20px;
  line-height: 20px;
  border-radius: 25%;
  top: ${(props: { position: PixelPosition }) => `${props.position.top + 25}px`};
  left: ${(props: { position: PixelPosition }) => `${props.position.left - 28}px`};
  text-align: center;
`;

const NextMoveButton = styled.div`
  width: 12px;
  height: 12px;
  display: inline-block;
  margin: 0 3px;
  box-shadow: ${(props: { selected: boolean }) => 
    props.selected ?
    '0px 0px 10px 2px #FFFFFF': 'none'
  };
`;

const Gemini1Button = styled(NextMoveButton)`
  background-color: #fcc409;
  border-radius: 50%;
  &:hover {
    cursor: pointer;
  }
`;
const Gemini2Button = styled(NextMoveButton)`
  background-color: #46b3e8;
  border-radius: 50%;
  &:hover {
    cursor: pointer;
  }
`;
const Gemini12Button = styled(NextMoveButton)`
  background-image: linear-gradient(135deg, #fcc409 50%, #46b3e8 50%);
  border-radius: 50%;
  &:hover {
    cursor: pointer;
  }
`;

interface Props {
  id: string,
  shipReachability: { [id: string]: {
    cost: {
      energyCells: number,
      lifeSupportPacks: number,
    }
  }},
  gemini1NextMove: boolean,
  gemini2NextMove: boolean,
  setGemini1NextMove: (Gemini1NextMove: string) => void,
  setGemini2NextMove: (Gemini2NextMove: string) => void,
  setShowTimePortalRoute: (showTimePortalRoute: boolean) => void,
}

export default function(props: Props) {
  const position = locationData[props.id].pixelPosition;
  return <>
    <ButtonGroupBackground 
      onMouseEnter={() => {props.setShowTimePortalRoute(true)}} 
      onMouseLeave={() => {props.setShowTimePortalRoute(false)}}
      position={position}
    >
      {
        props.shipReachability[IDs.GEMINI_1] ? 
        <Gemini1Button
          data-testid={`move-${props.id}-gemini1`}
          selected={props.gemini1NextMove && !props.gemini2NextMove}
          onClick={()=>{
            props.setGemini1NextMove(props.id)
          }}
        /> : <></>
      }
      {
        props.shipReachability[IDs.GEMINI_2] ? 
        <Gemini2Button
          data-testid={`move-${props.id}-gemini2`}
          selected={!props.gemini1NextMove && props.gemini2NextMove}
          onClick={() => {
            props.setGemini2NextMove(props.id)
          }}
        /> : <></>
      }
      {
        props.shipReachability[IDs.GEMINI_1] && props.shipReachability[IDs.GEMINI_2] ? 
        <Gemini12Button
          data-testid={`move-${props.id}-gemini12`}
          selected={props.gemini1NextMove && props.gemini2NextMove}
          onClick={() => {
            props.setGemini1NextMove(props.id)
            props.setGemini2NextMove(props.id)
          }}
        /> : <></>
      }
    </ButtonGroupBackground>
  </>;
}

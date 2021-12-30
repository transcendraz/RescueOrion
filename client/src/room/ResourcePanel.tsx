import React from 'react';
import styled from 'styled-components';
import { PlainSpaceship } from '../metadata/types';

const ENERGY_OFFSET = 48;
const LIFE_SUPPORT_OFFSET = 168;
const GEMINI1_RESOURCE_OFFSET = 265;
const GEMINI2_RESOURCE_OFFSET = 492;
const GEMINI_TOP_OFFSET = 205;
const GEMINI2_TOP_OFFSET = 435;

const Number = styled.div`
  display: inline-block;
  position: absolute;
  color: white;
  font-size: 25px;
  font-weight: bold;
  text-align: center;
  width: 120px;
`;
const Gemini1Energy = styled(Number)`
  top: ${GEMINI_TOP_OFFSET}px;
  left: ${ENERGY_OFFSET}px;
`;
const Gemini2Energy = styled(Number)`
  top: ${GEMINI2_TOP_OFFSET}px;
  left: ${ENERGY_OFFSET}px;
`;
const Gemini1LifeSupport = styled(Number)`
  top: ${GEMINI_TOP_OFFSET}px;
  left: ${LIFE_SUPPORT_OFFSET}px;
`;
const Gemini2LifeSupport = styled(Number)`
  top: ${GEMINI2_TOP_OFFSET}px;
  left: ${LIFE_SUPPORT_OFFSET}px;
`;
const Time = styled(Number)`
  top: 20px;
  left: 178px;
  font-size: 40px;
`

const Resource = styled.div`
  position: absolute;
  width: 240px;
  height: 62px;
  text-align: center;
  color: white;
  font-weight: bold;
  overflow-wrap: normal;
  word-wrap: break-word;
  font-size: 11px;
  margin: 0px;
  > p {
    margin: 2px;
  }
`;
const Gemini1Resource = styled(Resource)`
  top: ${GEMINI1_RESOURCE_OFFSET}px;
  left: ${ENERGY_OFFSET}px;
`;
const Gemini2Resource = styled(Resource)`
  top: ${GEMINI2_RESOURCE_OFFSET}px;
  left: ${ENERGY_OFFSET}px;
`;

interface Props {
  gemini1: PlainSpaceship,
  gemini2: PlainSpaceship,
  time: number,
}

export default function(props: Props) {
  return (
    <>
      <Gemini1Energy data-testid="energy-gemini1">{props.gemini1.energyCells}</Gemini1Energy>
      <Gemini2Energy data-testid="energy-gemini2">{props.gemini2.energyCells}</Gemini2Energy>
      <Gemini1LifeSupport data-testid="lifeSupport-gemini1">{props.gemini1.lifeSupportPacks}</Gemini1LifeSupport>
      <Gemini2LifeSupport data-testid="lifeSupport-gemini2">{props.gemini2.lifeSupportPacks}</Gemini2LifeSupport>
      <Gemini1Resource data-testid="resource-gemini1">
        {
          props.gemini1.rescueResources.map((resource, i) => {
            if (i % 2 === 0) {
              return <p key={i} style={{float: "left"}}>{resource}</p>
            }
            else {
              return <p key={i} style={{float: "right"}}>{resource}</p>
            }
          })
        }
      </Gemini1Resource>
      <Gemini2Resource data-testid="resource-gemini2">
        {
          props.gemini2.rescueResources.map((resource, i) => {
            if (i % 2 === 0) {
              return <p key={i} style={{float: "left"}}>{resource}</p>
            }
            else {
              return <p key={i} style={{float: "right"}}>{resource}</p>
            }
          })
        }
      </Gemini2Resource>
      <Time data-testid="travel-day">{props.time}</Time>
    </>
  );
}

import React from 'react';
import { useSelector } from '../redux-hook-adapters';
import styled from 'styled-components';
import { GameState, GameStatus, RescueResource } from '../../metadata/types';
import { formatTime } from '../../time-format-utils';

const Wrapper = styled.div`
  font-size: 14px;
`;

const Title = styled.h1`
  font-family: Orbitron;
  text-align: center;
`;

const ColumnHalf = styled.div`
  width: calc(50% - 10px);
  display: inline-block;
  padding: 5px;
`;

const DataPoint = styled.div`
  margin-bottom: 10px;
`;

const StatName = styled.div`
  display: inline-block;
  font-weight: bold;
  width: 60%;
  margin-right: 5px;
`;

const StatValue = styled.div`
  display: inline-block;
`;

export default () => {

  const state = useSelector((state: GameState) => state);
  const stats = state.gameStats;

  return <Wrapper>
    <Title>Your Game Stats</Title>
    <ColumnHalf>
      <DataPoint>
        <StatName>Returned to Sagittarius</StatName>
        <StatValue>
          {
            state.status === GameStatus.MissionSucceeded ?
            `Day ${state.time}` : 'Did Not Finish'
          }
        </StatValue>
      </DataPoint>
      <DataPoint>
        <StatName>Scientists Saved</StatName>
        <StatValue>
          {
            state.status === GameStatus.MissionSucceeded ?
            `${stats.scientistsRemaining} of 20` : 'None'
          }
        </StatValue>
      </DataPoint>
      <DataPoint>
        <StatName>Mission Duration</StatName>
        <StatValue>
          {
            formatTime(state.endTime! - state.startTime + state.accumulatedTime)
          }
        </StatValue>
      </DataPoint>
      <DataPoint>
        <StatName>O2 Temp (Required by Day 6)</StatName>
        <StatValue>
          {
            stats.dropOffTimes[RescueResource.O2ReplacementCells] > -1 ?
            `Delivered on Day ${stats.dropOffTimes[RescueResource.O2ReplacementCells]}` : 'Did Not Fix'
          }
        </StatValue>
      </DataPoint>
    </ColumnHalf>
    <ColumnHalf>
      <DataPoint>
        <StatName>Oxygen (Required by Day 21)</StatName>
        <StatValue>
          {
            stats.dropOffTimes[RescueResource.OxygenRepairTeam] > -1 ?
            `Delivered on Day ${stats.dropOffTimes[RescueResource.OxygenRepairTeam]}` : 'Did Not Fix'
          }
        </StatValue>
      </DataPoint>
      <DataPoint>
        <StatName>Water (Required by Day 23)</StatName>
        <StatValue>
          {
            stats.dropOffTimes[RescueResource.WaterRepairTeam] > -1 ?
            `Delivered on Day ${stats.dropOffTimes[RescueResource.WaterRepairTeam]}` : 'Did Not Fix'
          }
        </StatValue>
      </DataPoint>
      <DataPoint>
        <StatName>Food (Required by Day 24)</StatName>
        <StatValue>
          {
            stats.dropOffTimes[RescueResource.FoodRepairTeam] > -1 ?
            `Delivered on Day ${stats.dropOffTimes[RescueResource.FoodRepairTeam]}` : 'Did Not Fix'
          }
        </StatValue>
      </DataPoint>
      <DataPoint>
        <StatName>Medical (Required by Day 25)</StatName>
        <StatValue>
          {
            stats.dropOffTimes[RescueResource.FoodRepairTeam] > -1 ?
            `Delivered on Day ${stats.dropOffTimes[RescueResource.FoodRepairTeam]}` : 'Did Not Fix'
          }
        </StatValue>
      </DataPoint>
    </ColumnHalf>
  </Wrapper>;
}
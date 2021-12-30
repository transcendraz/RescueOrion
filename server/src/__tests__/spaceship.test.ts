import { RescueResource } from "../metadata/types";
import Gemini_1 from "../repository/classes/Gemini_1";
import Gemini_2 from "../repository/classes/Gemini_2";
import { describe, expect, it } from '@jest/globals';

describe('spaceships in Rescue Orion', () => {
  it('picks up and drops off resources correctly', () => {
    const spaceship = new Gemini_1(10, 10, [RescueResource.O2ReplacementCells]);
    spaceship.dropOffTo(RescueResource.AITechnology);
    expect(spaceship.getRescueResources()).toEqual([ 'O2 Replacement Cells' , 'AI Technology' ]);
    spaceship.pickUpFrom(RescueResource.AITechnology);
    expect(spaceship.getRescueResources()).toEqual([ 'O2 Replacement Cells' ]);
  });

  it('get location, neighbours, add path, move, and consume correctly',()=>{
    const spaceship = new Gemini_1(100, 100, [RescueResource.O2ReplacementCells]);
    expect(spaceship.getLocation()).toEqual('sagittarius');
    expect(spaceship.generateReachableNeighbors()).toHaveLength(3);

    spaceship.addToPath('t1');
    expect(spaceship.getPath()).toEqual(["sagittarius", "t1"]);
    spaceship.onDayUpdate(1);
    expect(spaceship.generateReachableNeighbors()).toHaveLength(6);
    expect(spaceship.getLocation()).toEqual('t1');
    expect(spaceship.lifeSupportPacks).toEqual(99);
    expect(spaceship.energyCells).toEqual(99);

    spaceship.addToPath('t4');
    spaceship.onDayUpdate(1);
    expect(spaceship.generateReachableNeighbors()).toHaveLength(4);
    expect(spaceship.getLocation()).toEqual('t4');
    expect(spaceship.energyCells).toEqual(89);
    expect(spaceship.lifeSupportPacks).toEqual(69);
    expect(spaceship.getTimePortalRoute()).toEqual(["t1"]);
  });

  it('computes route correctly (with more complex cases)', () => {
    const spaceship = new Gemini_1(100, 100);
    spaceship.addToPath('b3');
    spaceship.addToPath('h1');
    {
      const neighbors = spaceship.generateReachableNeighbors();
      expect(neighbors).toHaveLength(7);
      neighbors.forEach((neighbor) => {
        expect(['h1', 'h2', 'h3', 'h4', 'b3', 't3', 't4'].indexOf(neighbor.location))
          .toBeGreaterThan(-1);
      });
    }
    spaceship.addToPath('t3');
    {
      const neighbors = spaceship.generateReachableNeighbors();
      expect(neighbors).toHaveLength(9);
      neighbors.forEach((neighbor) => {
        expect(['b20', 'b19', 'b13', 'h1', 't1', 't2', 't4', 't5', 't3'].indexOf(neighbor.location))
          .toBeGreaterThan(-1);
      });
    }
    spaceship.addToPath('t3');
    {
      const neighbors = spaceship.generateReachableNeighbors();
      expect(neighbors).toHaveLength(9);
      neighbors.forEach((neighbor) => {
        expect(['b20', 'b19', 'b13', 'h1', 't1', 't2', 't4', 't5', 't3'].indexOf(neighbor.location))
          .toBeGreaterThan(-1);
      });
    }
    spaceship.addToPath('t5');
    spaceship.addToPath('t2');
    spaceship.addToPath('t3');
    {
      const neighbors = spaceship.generateReachableNeighbors();
      expect(neighbors).toHaveLength(4);
      neighbors.forEach((neighbor) => {
        expect(['t1', 't2', 't4', 't5'].indexOf(neighbor.location))
          .toBeGreaterThan(-1);
      });
    }
  });

});

describe('gemini2', () => {
  it('move together with gemini1 along its path onDayUpdate', () => {
    const spaceship1 = new Gemini_1(10, 10, [RescueResource.O2ReplacementCells]);
    const spaceship2 = new Gemini_2(spaceship1, 10, 10, [RescueResource.O2ReplacementCells]);
    spaceship1.addToPath('t1');
    spaceship2.addToPath('t1');
    spaceship2.onDayUpdate(1);
    spaceship1.onDayUpdate(1);
    expect(spaceship1.energyCells).toEqual(9);
    expect(spaceship2.energyCells).toEqual(10);
    expect(spaceship1.lifeSupportPacks).toEqual(9);
    expect(spaceship2.lifeSupportPacks).toEqual(10);
  });

  it('do not move together with gemini1',()=>{
    const spaceship1 = new Gemini_1(10, 10, [RescueResource.O2ReplacementCells]);
    const spaceship2 = new Gemini_2(spaceship1, 10, 10, [RescueResource.O2ReplacementCells]);
    spaceship1.addToPath('t1');
    spaceship2.addToPath('b3');
    spaceship2.onDayUpdate(1);
    spaceship1.onDayUpdate(1);
    expect(spaceship1.energyCells).toEqual(9);
    expect(spaceship2.energyCells).toEqual(9);
    expect(spaceship1.lifeSupportPacks).toEqual(9);
    expect(spaceship2.lifeSupportPacks).toEqual(9);
  });

});
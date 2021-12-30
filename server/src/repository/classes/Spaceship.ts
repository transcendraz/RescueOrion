import TimeVaryingAgent from "./TimeVaryingAgent";
import ResourceCarrier from "./ResourceCarrier";
import { RescueResource } from "./RescueResource";
import { locationData } from '../../metadata';
import { LocationType } from '../../metadata/types';
import * as IDs from '../../metadata/agent-ids';

interface NeighborCost {
  location: string,
  cost: {
    energyCells: number,
    lifeSupportPacks: number,
  }
};

function computeSupplyConsumption(prev: string, curr: string): {
  energyCells: number,
  lifeSupportPacks: number,
} {
  // If different type of locations, then it must be a starway.
  // If staying at the same location, then it's equivalent to staying staionary
  if (locationData[curr].location.type !== locationData[prev].location.type || curr === prev) {
    return {
      energyCells: 1,
      lifeSupportPacks: 1,
    };
  }
  switch (locationData[curr].location.type) {
    case LocationType.BeaconStar:
      return {
        energyCells: 1,
        lifeSupportPacks: 1,
      };
    case LocationType.HyperGate:
      return {
        energyCells: 20,
        lifeSupportPacks: 5,
      };
    case LocationType.TimePortal:
      return {
        energyCells: 10,
        lifeSupportPacks: 30,
      };
  }
}

export default abstract class Spaceship implements ResourceCarrier, TimeVaryingAgent{
  energyCells: number;
  lifeSupportPacks: number;
  protected rescueResources: RescueResource[] = [];
  protected path: string[] = [IDs.SAGITTARIUS];
  private timePortalRouteStack: string[] = [];

  constructor(energyCells: number, lifeSupportPacks: number, resources?: RescueResource[]) {
    this.energyCells = energyCells;
    this.lifeSupportPacks = lifeSupportPacks;
    this.rescueResources = resources ?? [];
  }

  getLocation(): string {
    return this.path[this.path.length - 1];
  }

  getRescueResources(): RescueResource[] {
    return this.rescueResources.slice(0);
  }

  getPath(): string[] {
    return this.path.slice(0);
  }

  getTimePortalRoute(): string[] {
    return this.timePortalRouteStack.slice(0);
  }

  pickUpFrom(r: RescueResource): void {
    const index = this.rescueResources.indexOf(r);
    if (index === -1) {
      throw new Error(`${r} not found onboard.`);
    }
    this.rescueResources.splice(index, 1);
  }

  canPickUp(r: RescueResource): boolean {
    return true;
  }

  dropOffTo(r: RescueResource): void {
    this.rescueResources.push(r);
  }

  onDayUpdate(_: number): void {
    const current = this.path[this.path.length - 1];
    const prev = this.path[this.path.length - 2];
    const consumption = computeSupplyConsumption(prev, current);
    this.energyCells -= consumption.energyCells;
    if (this.energyCells < 0) {
      this.energyCells = 0;
    }
    this.lifeSupportPacks -= consumption.lifeSupportPacks;
    if (this.lifeSupportPacks < 0) {
      this.lifeSupportPacks = 0;
    }
  }

  addToPath(location: string): void {
    const prev = this.path[this.path.length - 1];
    this.path.push(location);

    // Moving thru time portals
    if (locationData[location].location.type === LocationType.TimePortal &&
        locationData[prev].location.type === LocationType.TimePortal &&
        prev !== location) {
      // Going back: pop off
      if (this.timePortalRouteStack[this.timePortalRouteStack.length - 1] === location) {
        this.timePortalRouteStack.pop();
      } else {
        this.timePortalRouteStack.push(prev);
      }
    } else {
      this.timePortalRouteStack = [];
    }
  }

  generateReachableNeighbors(): NeighborCost[] {

    function normalNextMovesFrom(location: string) {
      const nextMoves = locationData[location].neighbors.slice(0);
      nextMoves.push(location);
      return nextMoves;
    }

    function timePortalNextMovesFrom(timePortal: string) {
      const nextMoves: string[] = [];
      locationData[timePortal].neighbors.forEach((neighbor: string) => {
        if (locationData[neighbor].location.type === LocationType.TimePortal) {
          nextMoves.push(neighbor);
        }
      });
      return nextMoves;
    }

    const current = this.path[this.path.length - 1];

    let neighbors: string[];

    // On a beacon star or hyper gate, can go anywhere
    if (locationData[current].location.type !== LocationType.TimePortal) {
      neighbors = normalNextMovesFrom(current);
    } else {
      neighbors = this.timePortalRouteStack.length > 0 && current !== 't1' ?
        timePortalNextMovesFrom(current) : normalNextMovesFrom(current);
    }
    return neighbors.reduce((accumulator: NeighborCost[], location: string) => {
      const neighborCost = {
        location,
        cost: computeSupplyConsumption(current, location),
      }
      accumulator.push(neighborCost);
      return accumulator;
    }, []);
  }
}
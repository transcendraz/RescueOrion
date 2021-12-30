import ResourceCarrier from "./ResourceCarrier";
import { RescueResource } from "./RescueResource";

export default class SpaceStation implements ResourceCarrier {
  visited: boolean = false;
  energyCells: number;
  lifeSupportPacks: number;
  protected rescueResources: RescueResource[];
  private location: string;

  constructor(location: string, energyCells: number, lifeSupportPacks: number, resources: RescueResource[]) {
    this.energyCells = energyCells;
    this.lifeSupportPacks = lifeSupportPacks;
    this.rescueResources = resources;
    this.location = location;
  }

  getLocation(): string {
    return this.location;
  }

  getRescueResources(): RescueResource[] {
    return this.rescueResources.slice(0);
  }

  pickUpFrom(r: RescueResource): void {
    const index = this.rescueResources.indexOf(r);
    if (index === -1) {
      throw new Error(`${r} not found at the space station.`);
    }
    if (!this.canPickUp(r)) {
      throw new Error(`${r} not allowed to be picked up.`);
    }
    this.rescueResources.splice(index, 1);
  }

  canPickUp(r: RescueResource): boolean {
    return true;
  }

  dropOffTo(r: RescueResource): void {
    this.rescueResources.push(r);
    this.checkDropOffResource(r);
  }

  checkDropOffResource(r: RescueResource): void {}

}
import Spaceship from "./Spaceship";
import Gemini_1 from "./Gemini_1";
import { RescueResource } from "./RescueResource";

export default class Gemini_2 extends Spaceship {

  private gemini_1: Gemini_1;

  constructor(gemini_1: Gemini_1, energyCells: number, lifeSupportPacks: number, resources?: RescueResource[]) {
    super(energyCells, lifeSupportPacks, resources);
    this.gemini_1 = gemini_1
  }

  onDayUpdate(day: number): void {
    const current = this.path[this.path.length - 1];
    const prev = this.path[this.path.length - 2];
    const gemini_1Path = this.gemini_1.getPath();

    // Traveling together thru the last segment instead of just landing at
    // the same location
    if (current === gemini_1Path[gemini_1Path.length - 1] &&
      prev === gemini_1Path[gemini_1Path.length - 2]) {
      return;
    }
    super.onDayUpdate(day);
  }

}

import SpaceStation from "./SpaceStation"
import { RescueResource } from "./RescueResource";
import MessageQueue from "./MessageQueue";

export default class SpaceStationBorealis extends SpaceStation {

  private messageQueue: MessageQueue;

  constructor(location: string, energyCells: number, lifeSupportPacks: number, resources: RescueResource[], messageQueue: MessageQueue) {
    super(location, energyCells, lifeSupportPacks, resources);
    this.messageQueue = messageQueue;
  }

  canPickUp(r: RescueResource): boolean {
    if (r === RescueResource.AITechnology) {
      return false;
    }
    if (r === RescueResource.OxygenRepairTeam) {
      if (this.rescueResources.includes(RescueResource.AITechnology)) {
        return true;
      } else {
        return false;
      }
    }
    return true;
  }

  checkDropOffResource(r: RescueResource): void {
    if(r === RescueResource.AITechnology) {
      this.messageQueue.pushMessage({
        asset: 'modals/Rescue Orion POP UP SCREEN_For USC_19.png',
        title: 'AI TECHNOLOGY DELIVERED',
          paragraphs: [
            { text: 'Well done!' },
            { text: 'With the AI Technology from Capricorn here to replace them, the Oxygen Repair Team can now leave Borealis safely!' },
            { text: 'The Oxygen Repair Team are ready to board your ship!' },
            { text: '-Ground Control' },
          ],
      })
    }
  }

}
import SpaceStation from "./SpaceStation"
import { RescueResource } from "./RescueResource";
import TimeVaryingAgent from "./TimeVaryingAgent";
import MessageQueue from "./MessageQueue";
import { GameStatus } from "../../metadata/types";

export default class SpaceStationOrion extends SpaceStation implements TimeVaryingAgent {

  private scientistCount: number = 20;
  private day: number = 0;
  private dropOffTimes: { [resource: string]: number} = {
    [RescueResource.O2ReplacementCells]: -1,
    [RescueResource.FoodRepairTeam]: -1,
    [RescueResource.WaterRepairTeam]: -1,
    [RescueResource.MedicalRepairTeam]: -1,
    [RescueResource.OxygenRepairTeam]: -1,
  };
  private messageQueue: MessageQueue;

  constructor(location: string, energyCells: number, lifeSupportPacks: number, resources: RescueResource[], messageQueue: MessageQueue, scientistCount: number) {
    super(location, energyCells, lifeSupportPacks, resources);
    this.scientistCount = scientistCount;
    this.messageQueue = messageQueue;
  }

  dropOffTo(r: RescueResource): void {
    super.dropOffTo(r);
    this.dropOffTimes[r] = this.day + 1;
  }

  getDropOffTimes(): { [resource: string]: number } {
    return this.dropOffTimes;
  }

  canPickUp(r: RescueResource): boolean {
    if (r === RescueResource.AITechnology) {
      return true;
    }
    return false;
  }

  onDayUpdate(day: number): void {
    this.day = day;
    if(this.scientistCount<=0){
      return;
    }

    switch (this.day) {
      case 6:
        if (this.rescueResources.indexOf(RescueResource.O2ReplacementCells) === -1) {
          this.messageQueue.pushMessage({
            asset: 'modals/Rescue Orion POP UP SCREEN_For USC_7.png',
            title: 'Incident at Orion',
            paragraphs: [
              { text: 'Oh no! It appears you were too late.' },
              { text: 'The oxygen systems were not fixed in time and 1 scientist has passed away and taken their place amongst the stars!' },
              { text: 'Hurry to fix this before total loss of life happens!' },
            ]
          });
        }
        break;
      case 21:
        if (this.rescueResources.indexOf(RescueResource.OxygenRepairTeam) === -1) {
          if (this.rescueResources.indexOf(RescueResource.O2ReplacementCells) === -1) {
            this.messageQueue.endMission(GameStatus.OxygenProblem);
          } else {
            this.messageQueue.pushMessage({
              asset: 'modals/Rescue Orion POP UP SCREEN_For USC_8.png',
              title: 'Incident at Orion',
              paragraphs: [
                { text: 'Oh no! It appears you were too late.' },
                { text: 'The oxygen systems were not permanently fixed in time and one scientist has passed away and taken their place amongst the stars!' },
                { text: 'Hurry to fix this before total loss of life happens!' },
              ]
            });
          }
        }
        break;
      case 23:
        if (this.rescueResources.indexOf(RescueResource.WaterRepairTeam) === -1) {
          this.messageQueue.pushMessage({
            asset: 'modals/Rescue Orion POP UP SCREEN_For USC_10.png',
            title: 'Incident at Orion',
            paragraphs: [
              { text: 'Oh no! It appears you were too late.' },
              { text: 'Day 23 has passed and one scientist has passed away because the station is out of water!' },
              { text: 'Hurry to fix this before total loss of life happens!' },
            ]
          });
        }
        break;
      case 24:
        if (this.rescueResources.indexOf(RescueResource.FoodRepairTeam) === -1) {
          this.messageQueue.pushMessage({
            asset: 'modals/Rescue Orion POP UP SCREEN_For USC_11.png',
            title: 'Incident at Orion',
            paragraphs: [
              { text: 'I just got an update from Orion.' },
              { text: 'Day 24 has passed one scientist has passed away because the station ran out of food!' },
              { text: 'Hurry to fix this or find the solution before total loss of life happens!' },
            ]
          });
        }
        break;
      case 25:
        if (this.rescueResources.indexOf(RescueResource.MedicalRepairTeam) === -1) {
          this.messageQueue.pushMessage({
            asset: 'modals/Rescue Orion POP UP SCREEN_For USC_12.png',
            title: 'Incident at Orion',
            paragraphs: [
              { text: 'I just got an update from Orion.' },
              { text: 'Day 25 has passed, and 3 scientists have been lost because the injuries that happened at the time of the damage were not treated in time!' },
            ]
          });
        }
      default:
        break;
    }

    // Oxygen Related
    if (day >= 6 && day < 21) {
      if (!this.rescueResources.includes(RescueResource.O2ReplacementCells) && !this.rescueResources.includes(RescueResource.OxygenRepairTeam)) {
        --this.scientistCount;
      }
    } else if (day >= 21) {
      if (!this.rescueResources.includes(RescueResource.O2ReplacementCells) && !this.rescueResources.includes(RescueResource.OxygenRepairTeam)) {
        this.scientistCount = 0;
        return;
      } else if (!this.rescueResources.includes(RescueResource.OxygenRepairTeam)) {
        --this.scientistCount;
      }
    }

    // Water Related
    if(day>=23 && !this.rescueResources.includes(RescueResource.WaterRepairTeam)){
      if(day>=30){
        // All Scientist Die
        this.scientistCount=0;
        return;
        // Gameend
      }else{
        // "I just got an update from Orion. Day 23 has passed and one scientist has passed away because the station is out of water!"
        this.scientistCount--;
      }
    }

    // Food Related
    if(day>=24 && !this.rescueResources.includes(RescueResource.FoodRepairTeam)){
      if(day>=30){
        // All Scientist Die
        this.scientistCount=0;
        return;
        // Gameend
      }else{
        // I just got an update from Orion. Day 24 has passed and one scientist has passed away because the station ran out of food!Hurry to fix this or find the solution before total loss of life happens!
        this.scientistCount--;
      }
    }

    // Medical Related
    if(day === 25 && !this.rescueResources.includes(RescueResource.MedicalRepairTeam)){
      // I just got an update from Orion. Day 25 has passed, and 3 scientists have been lost because the injuries that happened at the time of the damage were not treated in time!
      this.scientistCount-=3;
    }

    if (this.scientistCount < 0) {
      this.scientistCount = 0;
    }
  }

  getScientistCount(): number {
    return this.scientistCount;
  }

  checkDropOffResource(r: RescueResource): void {
    // check whether all resources are dropped
    if(this.rescueResources.includes(RescueResource.OxygenRepairTeam)
    && this.rescueResources.includes(RescueResource.WaterRepairTeam)
    && this.rescueResources.includes(RescueResource.FoodRepairTeam)
    && this.rescueResources.includes(RescueResource.MedicalRepairTeam)) {
      this.messageQueue.pushMessage({
        asset: 'modals/Rescue Orion POP UP SCREEN_For USC_18.png',
        title: 'INCOMING RELAY FROM GROUND CONTROL',
          paragraphs: [
            { text: 'Congratulations, Gemini Crew!' },
            { text: 'You have successfully restored all systems at Space Station Orion and prevented all further loss of life! The entire galaxy is eternally in your debt!' },
            { text: 'Now don’t forget the second part of your mission! The entire Gemini Space Confederation at Sagittarius is eagerly awaiting your arrival!' },
            { text: 'Travel Safe!' },
            { text: '-Ground Control' },
          ],
      })
    }

    // drop off O2 replacement cells
    if(r === RescueResource.O2ReplacementCells) {
      this.messageQueue.pushMessage({
        asset: 'modals/Rescue Orion POP UP SCREEN_For USC_13.png',
        title: 'O2 REPLACEMENT CELLS DELIVERED',
          paragraphs: [
            { text: 'You’ve saved the day (for now)! The O2 replacement cells you have dropped off will only temporarily delay loss of life.' },
            { text: 'You must find a permanent oxygen generation solution before Day 21!' },
            { text: 'Please hurry!' },
            { text: '-Ground Control' },
          ],
      })
    }
    // drop off oxygen repair team
    else if(r === RescueResource.OxygenRepairTeam) {
      this.messageQueue.pushMessage({
        asset: 'modals/Rescue Orion POP UP SCREEN_For USC_14.png',
        title: 'OXYGEN REPAIR TEAM DELIVERED',
          paragraphs: [
            { text: 'Take a deep breath!' },
            { text: 'The Oxygen Repair Team has restored oxygen to Space Station Orion.' },
            { text: 'Your brave heroics have ensured no scientists will be lost from oxygen loss!' },
            { text: 'Great work, Gemini Crew!' },
            { text: '-Ground Control' },
          ],
      })
    }
    // drop off water repair team
    else if(r === RescueResource.WaterRepairTeam) {
      this.messageQueue.pushMessage({
        asset: 'modals/Rescue Orion POP UP SCREEN_For USC_15.png',
        title: 'WATER REPAIR TEAM DELIVERED',
          paragraphs: [
            { text: 'Splashdown!' },
            { text: 'The Water Repair Team has fixed the water purification systems.' },
            { text: 'The scientists will now have enough water to keep them alive!' },
            { text: 'Well done, Gemini Crew!' },
            { text: '-Ground Control' },
          ],
      })
    }
    // drop off food repair team
    else if(r === RescueResource.FoodRepairTeam) {
      this.messageQueue.pushMessage({
        asset: 'modals/Rescue Orion POP UP SCREEN_For USC_16.png',
        title: 'FOOD REPAIR TEAM DELIVERED',
          paragraphs: [
            { text: 'That hit the spot!' },
            { text: 'The Food Repair Team has fixed the food processing systems and the scientists now have enough food to ensure they don’t starve.' },
            { text: 'There will surely be a feast in your crew’s honor when this is all over!' },
            { text: 'Fantastic job, Gemini Crew' },
            { text: '-Ground Control' },
          ],
      })
    }
    // drop off medical repair team
    else if(r === RescueResource.MedicalRepairTeam) {
      this.messageQueue.pushMessage({
        asset: 'modals/Rescue Orion POP UP SCREEN_For USC_17.png',
        title: 'MEDICAL REPAIR TEAM DELIVERED',
          paragraphs: [
            { text: 'Just what the doctor ordered!' },
            { text: 'The Medical Repair Team has treated all of the injuries from the explosions, ensuring all the wounded scientists will survive.' },
            { text: 'Bravo, Gemini Crew!!' },
            { text: '-Ground Control' },
          ],
      })
    }
  }
}
import { GameState, PlainSpaceship, PlainSpaceStation, Message, SpaceshipNextMoves, GameStatus } from '../../metadata/types';
import TimeVaryingAgent from './TimeVaryingAgent';
import ResourceCarrier from './ResourceCarrier';
import Spaceship from './Spaceship';
import SpaceStation from './SpaceStation';
import Gemini_1 from './Gemini_1';
import * as IDs from '../../metadata/agent-ids';
import Gemini_2 from './Gemini_2';
import SpaceStationAndromeda from './SpaceStationAndromeda';
import SpaceStationBorealis from './SpaceStationBorealis';
import SpaceStationOrion from './SpaceStationOrion';
import { RescueResource } from './RescueResource';
import { locationData, spaceStationData } from '../../metadata';
import MessageQueue from './MessageQueue';
import CountdownClock from '../countdown-clock';

export default class Game implements MessageQueue {

  constructor(countdownClock: CountdownClock, accumulatedTime: number, accumulateTime: (time: number) => void) {
    countdownClock.subscribeTick(() => {
      if (this.status === GameStatus.Started) {
        this.onTick(countdownClock.getSecondsRemaining(), countdownClock.getSecondsElapsed());
      }
    });
    this.countdownClock = countdownClock;
    this.accumulatedTime = accumulatedTime;
    this.accumulateTime = accumulateTime;
  }

  private day = 0;
  private messages: Message[] = [];
  private agents: { [id: string]: TimeVaryingAgent } = {};
  private carriers: { [id: string]: ResourceCarrier } = {};
  private spaceships: { [id: string]: Spaceship } = {};
  private spaceStations: { [id: string]: SpaceStation } = {};
  private movedSinceStart = false;
  private lastMove: number = 0;
  private countdownClock: CountdownClock;
  private startTime: number = 0;
  private endTime: number;
  private accumulatedTime: number;
  private accumulateTime: (time: number) => void;
  newMessage = false;
  status = GameStatus.NotStarted;

  load(): void {
    const gemini_1 = new Gemini_1(40, 80, [RescueResource.O2ReplacementCells]);
    this.spaceships[IDs.GEMINI_1] = gemini_1;
    this.agents[IDs.GEMINI_1] = gemini_1;
    this.carriers[IDs.GEMINI_1] = gemini_1;

    const gemini_2 = new Gemini_2(gemini_1, 40, 100);
    this.spaceships[IDs.GEMINI_2] = gemini_2;
    this.agents[IDs.GEMINI_2] = gemini_2;
    this.carriers[IDs.GEMINI_2] = gemini_2;

    const andromeda = new SpaceStationAndromeda(spaceStationData[IDs.ANDROMEDA].location, 0, 0, []);
    this.spaceStations[IDs.ANDROMEDA] = andromeda;
    this.agents[IDs.ANDROMEDA] = andromeda;
    this.carriers[IDs.ANDROMEDA] = andromeda;

    const aquarius = new SpaceStation(spaceStationData[IDs.AQUARIUS].location, 20, 50, [RescueResource.WaterRepairTeam]);
    this.spaceStations[IDs.AQUARIUS] = aquarius;
    this.carriers[IDs.AQUARIUS] = aquarius;

    const borealis = new SpaceStationBorealis(spaceStationData[IDs.BOREALIS].location, 50, 30, [RescueResource.OxygenRepairTeam], this);
    this.spaceStations[IDs.BOREALIS] = borealis;
    this.carriers[IDs.BOREALIS] = borealis;

    const capricorn = new SpaceStation(spaceStationData[IDs.CAPRICORN].location, 40, 70, [RescueResource.AITechnology]);
    this.spaceStations[IDs.CAPRICORN] = capricorn;
    this.carriers[IDs.CAPRICORN] = capricorn;

    const cassiopeia = new SpaceStation(spaceStationData[IDs.CASSIOPEIA].location, 30, 20, [RescueResource.MedicalRepairTeam]);
    this.spaceStations[IDs.CASSIOPEIA] = cassiopeia;
    this.carriers[IDs.CASSIOPEIA] = cassiopeia;

    const orion = new SpaceStationOrion(spaceStationData[IDs.ORION].location, 0, 0, [], this, 20);
    this.spaceStations[IDs.ORION] = orion;
    this.agents[IDs.ORION] = orion;
    this.carriers[IDs.ORION] = orion;

    const sagittarius = new SpaceStation(spaceStationData[IDs.SAGITTARIUS].location, 0, 0, []);
    this.spaceStations[IDs.SAGITTARIUS] = sagittarius;
    this.carriers[IDs.SAGITTARIUS] = sagittarius;
    sagittarius.visited = true;
  }

  private advanceTime(): void {
    // Invoking onDayUpdate at the end of day
    for (const id in this.agents) {
      this.agents[id].onDayUpdate(this.day);
    }
    ++this.day;
    if (this.isWinState()) {
      this.endMission(GameStatus.MissionSucceeded);
      return;
    }
    if (this.day > 30) {
      this.endMission(GameStatus.MissionTimeOut);
      return;
    }
    for (const id in this.spaceships) {
      if(this.spaceships[id].energyCells <= 0 || this.spaceships[id].lifeSupportPacks <= 0) {
        this.endMission(GameStatus.OutOfResource);
        return;
      }
    }
    // check leftover resources on each spaceships
    for (const id in this.spaceships) {
      if(this.spaceships[id].energyCells <= 10 || this.spaceships[id].lifeSupportPacks <= 10) {
        this.pushMessage({
          asset: 'modals/Rescue Orion POP UP SCREEN_For USC_24.png',
          title: 'Warning!',
          paragraphs: [
            { text: 'One of your ships is running low on Energy Cells or Life Support Packs.' },
            { text: 'If your levels reach zero, your ship will become lost in space and your mission will automatically end.' },
            { text: 'Please replenish your resources before it’s too late.' },
            { text: '-Ground Control' },
          ],
        });
        break;
      }
    }
  }

  startMission() {
    this.lastMove = this.startTime = this.countdownClock.getSecondsElapsed();
    this.status = GameStatus.Started;
    this.messages = [spaceStationData[IDs.SAGITTARIUS].message];
  }

  endMission(gameStatus: GameStatus) {
    this.status = gameStatus;
    this.endTime = this.countdownClock.getSecondsElapsed();
    this.accumulateTime(this.endTime - this.startTime);
  }

  pushMessage(m: Message) {
    this.messages.push(m);
    this.newMessage = true;
  }

  dumpMessages(): Message[] {
    this.newMessage = false;
    const messages = this.messages.slice(0);
    this.messages = [];
    return messages;
  }

  moveSpaceships(moves: { [id: string]: string }): void {
    Object.entries(moves).forEach(([id, move]) => {
      const spaceship = this.spaceships[id];
      if (!spaceship) {
        throw new Error('Invalid move');
      }
      const neighbors = spaceship.generateReachableNeighbors();
      let valid = false;
      neighbors.forEach((cost) => {
        if (cost.location === move) {
          valid = true;
        }
      });
      if (!valid) {
        throw new Error('Invalid move');
      }
    });
    this.movedSinceStart = true;
    this.lastMove = this.countdownClock.getSecondsElapsed();
    Object.entries(moves).forEach(([id, move]) => {
      this.spaceships[id].addToPath(moves[id]);

      const spaceStation = locationData[move].location.spaceStationName;
      if (spaceStation && !this.spaceStations[spaceStation].visited) {
        this.spaceStations[spaceStation].visited = true;
        this.messages.push(spaceStationData[spaceStation].message);
      }
    });
    this.advanceTime();
  }

  transferEnergyCells(from: string, to: string, count?: number): void {
    if (from === to) {
      throw new Error('Self-self transfers not allowed');
    }
    const sendingCarrier = this.carriers[from];
    const receivingCarrier = this.carriers[to];
    if (receivingCarrier instanceof SpaceStation) {
      throw new Error('Space stations cannot receive supplies');
    }
    if (sendingCarrier.getLocation() !== receivingCarrier.getLocation()) {
      throw new Error('Carriers cannot transfer stuff when they are not together.');
    }
    const transferCount = count ?? sendingCarrier.energyCells;
    sendingCarrier.energyCells -= transferCount;
    receivingCarrier.energyCells += transferCount;
  }

  transferLifeSupportPacks(from: string, to: string, count?: number): void {
    if (from === to) {
      throw new Error('Self-self transfers not allowed');
    }
    const sendingCarrier = this.carriers[from];
    const receivingCarrier = this.carriers[to];
    if (receivingCarrier instanceof SpaceStation) {
      throw new Error('Space stations cannot receive supplies');
    }
    if (sendingCarrier.getLocation() !== receivingCarrier.getLocation()) {
      throw new Error('Carriers cannot transfer stuff when they are not together.');
    }
    const transferCount = count ?? sendingCarrier.lifeSupportPacks;
    sendingCarrier.lifeSupportPacks -= transferCount;
    receivingCarrier.lifeSupportPacks += transferCount;
  }

  transferRescueResource(from: string, to: string, type: RescueResource): void {
    if (from === to) {
      throw new Error('Self-self transfers not allowed');
    }
    const sendingCarrier = this.carriers[from];
    const receivingCarrier = this.carriers[to];
    if (sendingCarrier.getLocation() !== receivingCarrier.getLocation()) {
      throw new Error('Carriers cannot transfer stuff when they are not together.');
    }
    sendingCarrier.pickUpFrom(type);
    receivingCarrier.dropOffTo(type);
  }

  toGameState(dump: boolean = true): GameState {
    const orion = this.spaceStations[IDs.ORION] as SpaceStationOrion;
    return {
      spaceships: Object.keys(this.spaceships).reduce((accumulator: {
          [id: string]: PlainSpaceship
        }, id: string) => {
          const spaceship = this.spaceships[id];
          accumulator[id] = {
            energyCells: spaceship.energyCells,
            lifeSupportPacks: spaceship.lifeSupportPacks,
            location: spaceship.getLocation(),
            rescueResources: spaceship.getRescueResources(),
            timePortalRoute: spaceship.getTimePortalRoute(),
          };
          return accumulator;
        },
      {}),
      nextMoves: Object.keys(this.spaceships).reduce((accumulator: SpaceshipNextMoves, id: string) => {
        const reachableNeighbors = this.spaceships[id].generateReachableNeighbors();
        reachableNeighbors.forEach((neighborCost) => {
          if (!accumulator[neighborCost.location]) {
            accumulator[neighborCost.location] = {};
          }
          accumulator[neighborCost.location][id] = { cost: neighborCost.cost };
        });
        return accumulator;
      }, {}),
      spaceStations: Object.keys(this.spaceStations).reduce((accumulator: {
          [id: string]: PlainSpaceStation
        }, id: string) => {
          const spaceStation = this.spaceStations[id];
          accumulator[id] = {
            location: spaceStation.getLocation(),
            visited: spaceStation.visited,
            energyCells: spaceStation.energyCells,
            lifeSupportPacks: spaceStation.lifeSupportPacks,
            rescueResources: spaceStation.getRescueResources(),
            canPickUp: spaceStation.getRescueResources().reduce((accumulator: {
                [resource: string]: boolean
              }, r: RescueResource) => {
                accumulator[r] = spaceStation.canPickUp(r);
                return accumulator;
              },
            {})
          };
          return accumulator;
        },
      {}),
      accumulatedTime: this.accumulatedTime,
      startTime: this.startTime,
      endTime: this.endTime,
      messages: dump ? this.dumpMessages(): this.messages.slice(0),
      time: this.day,
      gameStats: {
        scientistsRemaining: orion.getScientistCount(),
        dropOffTimes: orion.getDropOffTimes(),
      },
      status: this.status,
    };
  }

  private onTick(countdown: number, timeNow: number) {
    const timeElapsed = timeNow - this.startTime;
    if (timeElapsed === 10 * 60 && !this.movedSinceStart) {
      this.pushMessage({
        asset: 'modals/Rescue Orion POP UP SCREEN_For USC_5.png',
        title: 'Incoming relay from Ground Control',
        paragraphs: [
          { text: 'Analysis paralysis: s situation where a group is unable to move forward with a decision as a result of overanalyzing data or overthinking a problem' },
          { text: 'The clock is ticking! You may want to consider making your first move so that you don’t run out of time!' },
          { text: '-Ground Control' },
        ],
      });
      return;
    }
    if (timeElapsed - this.lastMove === 5 * 60) { // every 5 minutes?
      this.pushMessage({
        asset: 'modals/Rescue Orion POP UP SCREEN_For USC_6.png',
        title: 'Incoming relay from Ground Control',
        paragraphs: [
          { text: 'Greetings crew, we’re getting readings that your ships have stayed in one spot for quite some time.' },
          { text: 'If you are stuck on what to do next, you may request help from your Space Commander. Alternatively, you may wish to visit a space station to see if they have any intel for you that could help you decide what to do next.' },
          { text: 'Remember to watch the clock to see your remaining time!' },
          { text: '-Ground Control' },
        ],
      });
    }

    if (timeElapsed === 2 * 60) {
      this.pushMessage({
        asset: 'modals/Rescue Orion POP UP SCREEN_For USC_1.png',
        title: 'Incoming relay from Ground Control',
        paragraphs: [
          { text: 'We hope this message finds you out in space already. We wanted to remind you of a few key reminders for your mission:' },
          { text: 'Remember that other space stations have received critical information on Orion’s status', number: 1 },
          { text: 'Don\'t forget that Orion will run out of oxygen on Day 6', number: 2 },
          { text: 'Recue related resources (similar to the oxygen replacement cells on board your ship) cannot be picked up or dropped off when traveling through Time Portals', number: 3 },
          { text: '-Ground Control' },
        ],
      });
    } else if (timeElapsed === 8 * 60) {
      this.pushMessage({
        asset: 'modals/Rescue Orion POP UP SCREEN_For USC_2.png',
        title: 'Incoming relay from the Space Commander',
        paragraphs: [
          { text: 'Greetings, crews!' },
          { text: 'This is a friendly reminder that there is intel regarding the location and quantity of various Energy Cells and Life Support Packs available at different space stations in one of your crew member’s documents!' },
          { text: 'Sometimes in all of the excitement, we forget that it is there!' },
          { text: 'Things don’t look to good at Orion right now. I must get back to work trying to re-establish communications with them!' },
          { text: '-Space Commander' },
        ],
      });
    } else if (timeElapsed === countdown || timeElapsed + 1 === countdown) {
      this.pushMessage({
        asset: 'modals/Rescue Orion POP UP SCREEN_For USC_3.png',
        title: 'Incoming relay from Ground Control',
        paragraphs: [
          { text: 'You are halfway through your mission time. Be sure to keep an eye on the clock to make sure you have enough time to Rescue Orion!' },
          { text: 'We are all counting on you!' },
          { text: '-Ground Control' },
        ],
      });
    } else if (countdown === 10 * 60) {
      this.pushMessage({
        asset: 'modals/Rescue Orion POP UP SCREEN_For USC_4.png',
        title: 'Urgent relay from Ground Control',
        paragraphs: [
          { text: 'Only 10 minutes remain for you to Rescue Orion and return to Sagittarius by Day 30!' },
          { text: 'When time is up, your ship will power down and you will be beamed into the main room to report back to the Space Commander.' },
          { text: 'We eagerly await your safe arrival!' },
          { text: 'Things don’t look to good at Orion right now. I must get back to work trying to re-establish communications with them!' },
          { text: '-Ground Control' },
        ],
      });
    }
  }

  private isWinState(): boolean {
    const orion = this.spaceStations[IDs.ORION] as SpaceStationOrion;
    const resources = orion.getRescueResources();
    let everythingFixed = true;
    [
      // RescueResource.O2ReplacementCells,
      RescueResource.OxygenRepairTeam,
      RescueResource.WaterRepairTeam,
      RescueResource.FoodRepairTeam,
      RescueResource.MedicalRepairTeam,
    ].forEach((resource) => {
      if (resources.indexOf(resource) < 0) {
        everythingFixed = false;
      }
    });
    if (!everythingFixed) {
      return false;
    }

    let returned = true;
    Object.values(this.spaceships).forEach((spaceship) => {
      if (spaceship.getLocation() !== spaceStationData[IDs.SAGITTARIUS].location) {
        returned = false;
      }
    });
    return returned;
  }
};

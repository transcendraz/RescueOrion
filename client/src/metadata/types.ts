export enum SocketMessages {
  StateUpdate = '@GameUpdate',
  Action = '@GameAction',
  TimeUpdate = '@TimeUpdate',
  LobbyUpdate = '@LobbyUpdate',
}

export enum LobbyStatus {
  Waiting = 'Waiting',
  Started = 'In Progress',
  Finished = 'Ended',
}

export interface LobbyState {
  status: LobbyStatus,
  gameDuration: GameDuration,
  updatedRooms: {
    [name: string]: GameState
  }
};

export enum LocationType {
  BeaconStar,
  HyperGate,
  TimePortal,
};

export type PixelPosition = {
  left: number,
  top: number,
}

export default interface Location {
  id: string,
  type: LocationType,
  spaceStationName?: string,
};

export type LocationMetadata = { [id: string]: {
  location: Location,
  neighbors: string[],
  pixelPosition: { left: number, top: number }
}};

export type SpaceStationMetadata = { [id: string]: {
  location: string,
  message: Message,
}}

export interface SpaceshipNextMoves {
  [location: string]: { [id: string]: {
    cost: {
      energyCells: number,
      lifeSupportPacks: number,
    }
  }}
};

export enum RescueResource {
  O2ReplacementCells = 'O2 Replacement Cells',
  FoodRepairTeam = 'Food Repair Team',
  WaterRepairTeam = 'Water Repair Team',
  MedicalRepairTeam = 'Medical Repair Team',
  OxygenRepairTeam = 'Oxygen Repair Team',
  AITechnology = 'AI Technology',
};

export interface PlainSpaceship {
  location: string,
  energyCells: number,
  lifeSupportPacks: number,
  rescueResources: RescueResource[],
  timePortalRoute: string[],
};

export interface PlainSpaceStation {
  visited: boolean,
  location: string,
  energyCells: number,
  lifeSupportPacks: number,
  rescueResources: RescueResource[],
  canPickUp: { [resource: string]: boolean },
};

export interface Message {
  asset?: string,
  note?: string,
  paragraphs: {
    text: string,
    number?: number,
  }[],
  sideNote?: string,
  technology?: string,
  title: string,
};

export enum GameStatus {
  NotStarted = 'Waiting',
  Started = 'Started',
  MissionSucceeded = 'Mission Complete',
  MissionTimeOut = 'Mission Time Out',
  MissionAborted = 'Mission Aborted',
  OutOfResource = 'Out Of Resources',
  OxygenProblem = 'Out of Oxygen',
};

export interface GameState {
  spaceships: {
    [id: string]: PlainSpaceship,
  },
  nextMoves: SpaceshipNextMoves,
  spaceStations: {
    [id: string]: PlainSpaceStation,
  },
  messages: Message[],
  time: number,
  accumulatedTime: number,
  startTime: number,
  endTime?: number,
  gameStats: {
    scientistsRemaining: number,
    dropOffTimes: {
      [resource: string]: number
    }
  },
  status: GameStatus,
};

export interface GameDuration {
  countdown: number,
  duration: number,
}

export interface Transfer {
  from: string,
  to: string,
}

export interface TransferWithCount extends Transfer {
  count: number,
}

export interface TransferWithResourceType extends Transfer {
  type: RescueResource,
}

export const MOVE_SPACESHIP = '@GameAction/moveSpaceship';
export interface MoveSpaceshipAction {
  type: string,
  payload: { [id: string]: string },
};


export const PICK_UP_SUPPLY_RESOURCE = '@GameAction/pickUpSupplyResource';
export interface PickUpSupplyResourceAction {
  type: string,
  payload: Transfer,
};

export const PICK_UP_RESCUE_RESOURCE = '@GameAction/pickUpRescueResource';
export interface PickUpRescueResourceAction {
  type: string,
  payload: TransferWithResourceType,
};

export const DROP_OFF_RESCUE_RESOURCE = '@GameAction/dropOffRescueResource';
export interface DropOffRescueResourceAction {
  type: string,
  payload: TransferWithResourceType,
};

export const TRANSFER_ENERGY_CELLS = '@GameAction/transferEnergyCells';
export interface TransferEnergyCellsAction {
  type: string,
  payload: TransferWithCount,
};

export const TRANSFER_LIFE_SUPPORT_PACKS = '@GameAction/transferLifeSupportPacks';
export interface TransferLifeSupportPacksAction {
  type: string,
  payload: TransferWithCount,
};

export const TRANSFER_RESCUE_RESOURCE = '@GameAction/transferRescueResource';
export interface TransferRescueResourceAction {
  type: string,
  payload: TransferWithResourceType,
};

export const ABORT_MISSION = '@GameAction/abortMission';
export interface AbortMissionAction {
  type: string,
};

export type GameAction = MoveSpaceshipAction
  | PickUpSupplyResourceAction
  | PickUpRescueResourceAction
  | DropOffRescueResourceAction
  | TransferEnergyCellsAction
  | TransferLifeSupportPacksAction
  | TransferRescueResourceAction
  | AbortMissionAction
;

import Game from './classes/Game';
import io from 'socket.io';
import { GameStatus, SocketMessages } from '../metadata/types';
import * as Types from '../metadata/types';
import CountdownClock from './countdown-clock';


class Room {

  constructor(countdownClock: CountdownClock) {
    this.game = new Game(countdownClock, 0, (time) => {
      this.accumulatedTime += time;
    });
    this.game.load();
    countdownClock.subscribeTick(() => {
      if (this.game.status === Types.GameStatus.NotStarted || this.game.status === Types.GameStatus.Started) {
        this.sendTimeUpdate();
        if (this.game.newMessage) {
          this.sendGameUpdate();
        }
      }
    });
    countdownClock.subscribeTimeUp(() => {
      if (this.game.status === GameStatus.Started) {
        this.game.endMission(GameStatus.MissionTimeOut);
        this.sendGameUpdate();
      }
    })
    this.countdownClock = countdownClock;
  }

  private game;
  private socket: io.Socket = null;
  private countdownClock: CountdownClock;
  private accumulatedTime: number = 0;
  dirty = true;

  private sendGameUpdate() {
    this.socket?.emit(SocketMessages.StateUpdate, JSON.stringify(this.game.toGameState()));
  }

  private sendTimeUpdate() {
    this.socket?.emit(SocketMessages.TimeUpdate, JSON.stringify(this.countdownClock.getGameDuration()));
  }

  startGameIfNot() {
    if (this.game.status === Types.GameStatus.NotStarted) {
      this.game.startMission();
      this.sendGameUpdate();
      this.dirty = true;
    }
  }

  restartGame() {
    if (this.game.status !== Types.GameStatus.NotStarted) {
      this.game = new Game(this.countdownClock, this.accumulatedTime, (time) => {
        this.accumulatedTime += time;
      });
      this.game.load();
      this.game.startMission();
      this.sendGameUpdate();
      this.dirty = true;
    }
  }

  getGameState() {
    return this.game.toGameState(false);
  }

  destroy() {
    this.setSocketAndPushUpdate(null);
  }

  setSocketAndPushUpdate(socket: io.Socket) {
    if (this.socket) {
      this.socket.disconnect();
    }
    this.socket = socket;
    this.sendGameUpdate();
    this.sendTimeUpdate();
  }

  onSocketDisconnect() {
    this.socket = null;
  }

  applyGameAction(action: Types.GameAction) {
    if (this.game.status !== Types.GameStatus.Started) { return; }
    this.dirty = true;
    try {
      switch (action.type) {
        case Types.MOVE_SPACESHIP: {
          this.game.moveSpaceships((action as Types.MoveSpaceshipAction).payload);
          break;
        }
        case Types.PICK_UP_SUPPLY_RESOURCE: {
          const transfer = (action as Types.PickUpSupplyResourceAction).payload;
          this.game.transferEnergyCells(transfer.from, transfer.to);
          this.game.transferLifeSupportPacks(transfer.from, transfer.to);
          break;
        }
        case Types.PICK_UP_RESCUE_RESOURCE: {
          const transfer = (action as Types.PickUpRescueResourceAction).payload;
          this.game.transferRescueResource(transfer.from, transfer.to, transfer.type);
          break;
        }
        case Types.DROP_OFF_RESCUE_RESOURCE: {
          const transfer = (action as Types.DropOffRescueResourceAction).payload;
          this.game.transferRescueResource(transfer.from, transfer.to, transfer.type);
          break;
        }
        case Types.TRANSFER_ENERGY_CELLS: {
          const transfer = (action as Types.TransferEnergyCellsAction).payload;
          this.game.transferEnergyCells(transfer.from, transfer.to, transfer.count);
          break;
        }
        case Types.TRANSFER_LIFE_SUPPORT_PACKS: {
          const transfer = (action as Types.TransferLifeSupportPacksAction).payload;
          this.game.transferLifeSupportPacks(transfer.from, transfer.to, transfer.count);
          break;
        }
        case Types.TRANSFER_RESCUE_RESOURCE: {
          const transfer = (action as Types.TransferRescueResourceAction).payload;
          this.game.transferRescueResource(transfer.from, transfer.to, transfer.type);
          break;
        }
        case Types.ABORT_MISSION: {
          this.game.endMission(Types.GameStatus.MissionAborted);
        }
        default:
          break;
      }
      this.sendGameUpdate();
    } catch (err) {
      console.log(err);  // Likely malformed requests, ignore.
    }
  };

}

export default Room;
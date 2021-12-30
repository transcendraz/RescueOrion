import io from 'socket.io';
import CountdownClock from './countdown-clock';
import Room from './room';
import repository from './index';
import { LobbyState, SocketMessages, LobbyStatus } from '../metadata/types';

class Lobby {

  constructor(code: number, admin: string) {
    this.code = code;
    this.admin = admin;
    this.destroyTimeout = global.setTimeout(() => this.destroy(), 2 * 60 * 60 * 1000);
    this.countdownClock.subscribeTimeUp(() => {
      this.status = LobbyStatus.Finished;
      this.destroyTimeout = global.setTimeout(() => this.destroy(), 2 * 60 * 60 * 1000);
      this.sendUpdate();
    });
    this.countdownClock.subscribeTick(() => {
      this.sendUpdate();
    });
    repository.lobbies[code] = this;
    if (repository.adminLobbies[admin]) {
      // which means lobbies are stored in chronological order
      repository.adminLobbies[admin]?.push(code);
    } else {
      repository.adminLobbies[admin] = [code];
    }
  }

  private sockets: io.Socket[] = [];
  private rooms: { [name: string]: Room } = {};
  private code: number;
  private admin: string;
  private countdownClock = new CountdownClock(75 * 60);
  private destroyTimeout: NodeJS.Timeout;
  readonly createTime = Date.now();
  status = LobbyStatus.Waiting;

  startGames() {
    if (this.status === LobbyStatus.Waiting) {
      this.status = LobbyStatus.Started;
      Object.values(this.rooms).forEach((room) => room.startGameIfNot());
      this.countdownClock.start();
      global.clearTimeout(this.destroyTimeout);
      this.destroyTimeout = null;
    }
  }

  isRoomNameTaken(name: string) {
    return this.rooms[name] !== undefined;
  }

  insertRoom(name: string) {
    const room = new Room(this.countdownClock);
    if (this.status === LobbyStatus.Started) {
      room.startGameIfNot();
    }
    this.rooms[name] = room;
    this.sendUpdate();
  }

  findRoom(name: string) {
    return this.rooms[name];
  }

  setCountdown(from: number) {
    if (this.status === LobbyStatus.Waiting) {
      this.countdownClock.setCountdownTime(from);
    }
  }

  destroy() {
    if (this.destroyTimeout) {
      clearTimeout(this.destroyTimeout);
    }
    Object.values(this.rooms).forEach((room) => room.destroy());
    const index = repository.adminLobbies[this.admin]?.indexOf(this.code);
    if (index >= 0) {
      repository.adminLobbies[this.admin]?.splice(index, 1);
    }
    delete repository.lobbies[this.code];
    this.sockets.forEach((socket) => socket.disconnect());
  }

  addSocket(socket: io.Socket) {
    this.sockets.push(socket);
    socket.on('disconnect', () => {
      const index = this.sockets.indexOf(socket);
      this.sockets.splice(index, 1);
    });
    socket.emit(SocketMessages.LobbyUpdate, JSON.stringify(Object.keys(this.rooms).reduce((accumulator: LobbyState, name: string) => {
      accumulator.updatedRooms[name] = this.rooms[name].getGameState();
      return accumulator;
    }, {
      status: this.status,
      gameDuration: this.countdownClock.getGameDuration(),
      updatedRooms: {},
    })));
  }

  // Streamed each second tick & new room joins & new admin joins
  private sendUpdate() {
    this.sockets.forEach((socket) => {
      socket.emit(SocketMessages.LobbyUpdate, JSON.stringify(Object.keys(this.rooms).reduce((accumulator: LobbyState, name: string) => {
        if (this.rooms[name].dirty) {
          accumulator.updatedRooms[name] = this.rooms[name].getGameState();
        }
        return accumulator;
      }, {
        status: this.status,
        gameDuration: this.countdownClock.getGameDuration(),
        updatedRooms: {}
      })));
    });
    Object.values(this.rooms).forEach((room) => room.dirty = false);
  }
}

export default Lobby;
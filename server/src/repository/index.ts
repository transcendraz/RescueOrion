import Lobby from './lobby';

interface Repository {
  adminLobbies: { [username: string]: number[] },
  lobbies: { [code: number]: Lobby }
};

const repository: Repository = {
  adminLobbies: {},
  lobbies: {},
};

export default repository;
export { default as Room } from './room';
export { default as Lobby } from './lobby';
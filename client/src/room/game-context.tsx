import { createContext } from 'react';
import { GameDuration, GameState } from '../metadata/types';

interface Context {
  socket?: SocketIOClient.Socket,
  gameState?: GameState,
  gameDuration?: GameDuration,
}

const defaultValue: Context = {};

const context = createContext(defaultValue);

export default context;
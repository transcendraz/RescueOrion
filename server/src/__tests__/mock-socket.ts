import io from 'socket.io';

export default class implements io.Socket {

  listenerInvoked = 0;
  emitInvoked = 0;
  latestEmittedMessage: string;

  nsp: io.Namespace;
  server: io.Server;
  adapter: io.Adapter;
  id: string;
  request: any;
  client: io.Client;
  conn: io.EngineSocket;
  rooms: { [id: string]: string; };
  connected: boolean;
  disconnected: boolean;
  handshake: io.Handshake;
  json: io.Socket;
  volatile: io.Socket;
  broadcast: io.Socket;
  to(room: string): io.Socket {
    throw new Error('Method not implemented.');
  }
  in(room: string): io.Socket {
    throw new Error('Method not implemented.');
  }
  use(fn: (packet: io.Packet, next: (err?: any) => void) => void): io.Socket {
    throw new Error('Method not implemented.');
  }
  send(...args: any[]): io.Socket {
    throw new Error('Method not implemented.');
  }
  write(...args: any[]): io.Socket {
    throw new Error('Method not implemented.');
  }
  join(name: string | string[], fn?: (err?: any) => void): io.Socket {
    throw new Error('Method not implemented.');
  }
  leave(name: string, fn?: Function): io.Socket {
    throw new Error('Method not implemented.');
  }
  leaveAll(): void {
    throw new Error('Method not implemented.');
  }
  disconnect(close?: boolean): io.Socket {
    this.disconnected = true;
    return this;
  }
  listeners(event: string): Function[] {
    throw new Error('Method not implemented.');
  }
  compress(compress: boolean): io.Socket {
    throw new Error('Method not implemented.');
  }
  error(err: any): void {
    throw new Error('Method not implemented.');
  }
  addListener(event: string | symbol, listener: (...args: any[]) => void): this {
    throw new Error('Method not implemented.');
  }
  on(event: string | symbol, listener: (...args: any[]) => void): this {
    ++this.listenerInvoked;
    return this;
  }
  once(event: string | symbol, listener: (...args: any[]) => void): this {
    throw new Error('Method not implemented.');
  }
  removeListener(event: string | symbol, listener: (...args: any[]) => void): this {
    throw new Error('Method not implemented.');
  }
  off(event: string | symbol, listener: (...args: any[]) => void): this {
    throw new Error('Method not implemented.');
  }
  removeAllListeners(event?: string | symbol): this {
    throw new Error('Method not implemented.');
  }
  setMaxListeners(n: number): this {
    throw new Error('Method not implemented.');
  }
  getMaxListeners(): number {
    throw new Error('Method not implemented.');
  }
  rawListeners(event: string | symbol): Function[] {
    throw new Error('Method not implemented.');
  }
  emit(event: string | symbol, ...args: any[]): boolean {
    ++this.emitInvoked;
    this.latestEmittedMessage = args[0] as string;
    return true;
  }
  listenerCount(type: string | symbol): number {
    throw new Error('Method not implemented.');
  }
  prependListener(event: string | symbol, listener: (...args: any[]) => void): this {
    throw new Error('Method not implemented.');
  }
  prependOnceListener(event: string | symbol, listener: (...args: any[]) => void): this {
    throw new Error('Method not implemented.');
  }
  eventNames(): (string | symbol)[] {
    throw new Error('Method not implemented.');
  }

};
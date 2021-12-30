import express from 'express';
import io from 'socket.io';
import { LobbyStatus } from '../metadata/types';
import repository, { Lobby } from '../repository';
import jwt from 'jsonwebtoken';
import { jwtOptions } from '../auth';

export default (router: express.Router, wss: io.Server) => {
  router.get('/:code', (req, res) => {
    const code = parseInt(req.params.code);
    const admin = req.user as string;
    if (!repository.adminLobbies[admin] || repository.adminLobbies[admin].indexOf(code) === -1) {
      res.status(404).send(`Lobby code ${req.params.code} not found.`);
      return;
    }
    const lobby = repository.lobbies[code];
    res.status(200).send({
      createTime: lobby.createTime,
    });
  });

  router.delete('/:code', (req, res) => {
    const code = parseInt(req.params.code);
    const admin = req.user as string;
    if (!repository.adminLobbies[admin] || repository.adminLobbies[admin].indexOf(code) === -1) {
      res.status(404).send(`Lobby code ${req.params.code} not found.`);
      return;
    }
    repository.lobbies[code].destroy();
    res.status(200).send();
  });

  router.get('/', (req, res) => {
    const admin = req.user as string;
    const lobbies = repository.adminLobbies[admin]?.slice(0).reverse().map((code) => {
      const lobby = repository.lobbies[code];
      return {
        code,
        createTime: lobby.createTime,
      };
    });
    res.status(200).send(lobbies ?? []);
  });

  router.post('/', (req, res) => {
    const admin = req.user as string;
    let lobbyCode: number;
    do {
      lobbyCode = Math.floor(100000 + Math.random() * 900000)
    } while (repository.lobbies[lobbyCode]);
    // Lobbies stored in adminLobbies in chrono order
    const lobby = new Lobby(lobbyCode, admin);
    res.status(200).send({
      code: lobbyCode,
      createTime: lobby.createTime,
    });
  });

  router.put('/start/:code', (req, res) => {
    const code = parseInt(req.params.code);
    const admin = req.user as string;
    if (!repository.adminLobbies[admin] || repository.adminLobbies[admin].indexOf(code) === -1) {
      res.status(404).send(`Lobby code ${req.params.code} not found.`);
      return;
    }
    repository.lobbies[code].startGames();
    res.status(200).send();
  });

  router.put('/countdown/:code', (req, res) => {
    const code = parseInt(req.params.code);
    const admin = req.user as string;
    if (!repository.adminLobbies[admin] || repository.adminLobbies[admin].indexOf(code) === -1) {
      res.status(404).send(`Lobby code ${req.params.code} not found.`);
      return;
    }
    const lobby = repository.lobbies[code];
    const { countdown } = req.body;
    const countdownInSeconds = parseInt(countdown);
    if (isNaN(countdownInSeconds) || countdownInSeconds <= 0 || countdownInSeconds > 1000 * 60) {
      res.status(400).send('Bad count down range.');
      return;
    }
    if (lobby.status !== LobbyStatus.Waiting) {
      res.status(403).send('Cannot set count down for started or finished lobbies.');
      return;
    }
    lobby.setCountdown(countdownInSeconds);
    res.status(200).send();
  });

  wss.use((socket, next) => {
    const token = socket.handshake.query?.token;
    if (!token) {
      socket.disconnect();
      return;
    }
    let admin: string;

    // sync callback
    jwt.verify(token, jwtOptions.secretOrKey, (err: any, decoded: { username: string }) => {
      if (err) {
        next(new Error('Authentication failed.'));
        return;
      }
      admin = decoded.username;
    });

    if (!admin) {
      socket.disconnect();
      return;
    }

    const lobbyCode = parseInt(socket.handshake.query?.lobby);
    if (!repository.adminLobbies[admin] || repository.adminLobbies[admin].indexOf(lobbyCode) === -1) {
      socket.disconnect();
      return;
    }
    socket.handshake.query.lobby = repository.lobbies[lobbyCode];
    next();
  }).on('connection', (socket) => {
    const lobby = socket.handshake.query.lobby as Lobby;
    lobby.addSocket(socket);
  });

}
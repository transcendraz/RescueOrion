import express from 'express';
import http from 'http';
import room from './room';
import admin from './admin';
import lobby from './lobby';
import io from 'socket.io';
import { passport } from '../auth';

export default (app: express.Express, server: http.Server): void => {

  const adminRouter = express.Router();
  app.use('/admin', adminRouter);
  admin(adminRouter);

  const lobbyWss = io().path('/lobbies/socket').attach(server);
  const lobbyRouter = express.Router();
  lobbyRouter.use(passport.authenticate("jwt", { session: false }));
  app.use('/lobbies', lobbyRouter);
  lobby(lobbyRouter, lobbyWss);

  const roomWss = io().path('/rooms/socket').attach(server);
  const roomRouter = express.Router();
  app.use('/rooms', roomRouter);
  room(roomRouter, roomWss);
};

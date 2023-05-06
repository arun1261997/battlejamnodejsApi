import http from 'http';
import express from 'express';
import { Server } from 'socket.io';
import { instrument } from '@socket.io/admin-ui';

export const app = express();

export const server = http.createServer(app);

export const io = new Server(server, {
  //  transports: ['websocket'],
  cors: {
    origin: '*',
    credentials: true,
  },
});

instrument(io, {
  auth: false,
  mode: 'development',
});

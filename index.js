import express from 'express';
import cors from 'cors';
import { app, io, server } from './services/server.js';
import boot from './utils/boot.js';
import routes from './routes/index.js';
import notFound from './middleware/notFound.js';
import error from './middleware/error.js';
import socketAuth from './middleware/socketAuth.js';
import './services/gcp.js';
import registerEventHandlers from './socketHandlers/event.js';

app.use(express.json());
app.use(
  express.urlencoded({
    extended: true,
  })
);
app.use(cors());
app.use(routes);
app.use(notFound);
app.use(error);

boot(server);

io.use(socketAuth);

io.on('connection', (socket) => {
  console.log(socket.data.user.email);
  registerEventHandlers(socket, io);
});

export default app;

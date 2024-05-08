import cors from 'cors';
import express from 'express';
import http from 'http';
import { Server } from 'socket.io';

import serverConfig from './configs/serverConfig';

const { PORT } = serverConfig;

const app = express();

app.use(cors());

const server = http.createServer(app);

const io = new Server(server, {
    cors: {
        origin: '*',
        methods: ['GET', 'POST']
    }
});

io.on('connection', (socket) => {
    console.log('New User Connected');

    socket.on('disconnect', () => {
        console.log('User disconnected');
    });
});

server.listen(PORT, () => {
    console.log(`Server Started at PORT: ${PORT}`);
});
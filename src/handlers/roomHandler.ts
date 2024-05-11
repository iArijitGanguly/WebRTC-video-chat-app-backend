import { Socket } from 'socket.io';
import { v4 as UUIdv4 } from 'uuid';

import { IRoomParams } from '../interfaces/IRoomParams';

const rooms: Record<string, string[]> = {};

const roomHandler = (socket: Socket) => {
    const createRoom = () => {
        const roomId = UUIdv4();
        socket.join(roomId);
        rooms[roomId] = [];
        socket.emit('room-created', { roomId });
        console.log('Room created at : ', roomId);
    };

    const joinedRoom = ({ roomId, peerId }: IRoomParams) => {
        if(rooms[roomId]) {
            console.log('New user has joined room with ', roomId, 'with peerId: ', peerId);
            rooms[roomId].push(peerId);
            socket.join(roomId);

            socket.on('ready', () => {
                socket.to(roomId).emit('user-joined', { peerId });
            });

            //below event is for logging purpose
            socket.emit('get-users', {
                roomId,
                participants: rooms[roomId]
            });
        }
    };

    socket.on('create-room', createRoom);
    socket.on('joined-room', joinedRoom);
};

export default roomHandler;
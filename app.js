const express = require('express');
const path = require('path');
const http = require('http');
const socketIo = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

const Room = require("./models/rooms.js");
const User = require("./models/users.js");

const roomRoute = require("./routes/rooms.js");

const connectdb = require("./db/connect.js");
const port = 7000;

connectdb();

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));
app.use("/api", roomRoute);

io.on('connection', (socket) => {
    console.log('A user connected');

    // Handle user joining a room
    socket.on('joinRoom', async ({ username, room }) => {
        // Join the room
        socket.join(room);

        // Add username to the socket
        socket.username = username;

        // Broadcast to the room that a user has joined
        socket.broadcast.to(room).emit('message', { username: 'System', message: `${username} has joined the room` });

        // Emit the updated list of members
        io.to(room).emit('updateMembers', await getRoomMembers(room));
    });

    // Handle incoming chat messages
    socket.on('chatMessage', ({ room, username, message }) => {
        io.to(room).emit('message', { username, message });
    });

    // Handle user disconnection or leaving the room
    socket.on('disconnect', async () => {
        const rooms = Object.keys(socket.rooms);
        if (rooms.length > 0) {
            const room = rooms[0]; // Assuming user is only in one room
            io.to(room).emit('message', { username: 'System', message: `${socket.username} has left the room` });
            io.to(room).emit('updateMembers', await getRoomMembers(room));
        }
        console.log(`${socket.username} has left the room`);
    });
});

// Function to get the list of members in a room
async function getRoomMembers(room) {
    const roomSockets = io.sockets.adapter.rooms.get(room) || [];
    const members = [];
    for (const socketId of roomSockets) {
        const socket = io.sockets.sockets.get(socketId);
        if (socket) {
            members.push(socket.username || 'Anonymous');
        }
    }
    return members;
}

server.listen(port, () => {
    console.log(`Server listening on port ${port}`);
});

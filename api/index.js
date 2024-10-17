
const express = require('express');
const app = express();
const http = require('http').Server(app);
const io = require('socket.io')(http);
const path = require('path');

app.use(express.static(path.join(__dirname, '..')));

const users = {};

io.on('connection', (socket) => {
    socket.on('new-user-joined', (name) => {
        console.log("New User: ", name);
        users[socket.id] = name;
        socket.broadcast.emit('user-joined', name);
    });

    socket.on('send', (message) => {
        const time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        socket.broadcast.emit('receive', { message: message, name: users[socket.id], time: time });
    });

    socket.on('disconnect', () => {
        socket.broadcast.emit('user-left', users[socket.id]);
        delete users[socket.id];
    });
});

const PORT = 8000;
http.listen(PORT, '0.0.0.0',() => {
    console.log(`Server is running on http://localhost:${PORT}`);
});

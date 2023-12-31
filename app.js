const express = require('express');
const req = require('express/lib/request');
const socketio = require('socket.io');
const app = express();

app.set('view engine','ejs');
app.use(express.static('public'));

app.get("/", (req, res) => {
    res.render("index");
});

const server = app.listen("https://realchatpenguin.netlify.app/", () => {
    console.log("Server is Running. . .");
});

//initialize socket for the server
const io = socketio(server);

io.on('connection', (socket) => {
    console.log("New user connected");

    socket.username = "anonymous"
    socket.on("change_username", data => {
        socket.username = data.username
    })

    //the handle new message event
    socket.on("new_message", data =>{
        console.log("new message");
        io.sockets.emit("receive_message", {message : data.message, username : socket.username})
    })

    socket.on('typing', data => {
        socket.broadcast.emit('typing', {username : socket.username })
    })
});

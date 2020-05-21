const express = require('express');
const http = require('http');
const https = require('https');
const fs = require('fs');
const socket = require('socket.io');

var options = {
    ca: fs.readFileSync('/etc/letsencrypt/live/play.chessatc.com/chain.pem'),
    cert: fs.readFileSync('/etc/letsencrypt/live/play.chessatc.com/fullchain.pem'),
    key: fs.readFileSync('/etc/letsencrypt/live/play.chessatc.com/privkey.pem')
};

const port = 443;

var app = express();
const server = https.createServer(options, app);
const io = socket(server);
var players;
var joined = true;

app.use(express.static(__dirname + "/"));

var games = Array(100);
for (let i = 0; i < 100; i++) {
    games[i] = {players: 0 , pid: [0 , 0]};
}


app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html');
});

io.on('connection', function (socket) {
      console.log("New client connected");
    // console.log(players);
    var color;
    var playerId =  Math.floor((Math.random() * 100) + 1)
    

    console.log(playerId + ' connected');

    socket.on('joined', function (roomId) {
        // games[roomId] = {}
        if (games[roomId].players < 2) {
            games[roomId].players++;
            games[roomId].pid[games[roomId].players - 1] = playerId;
        }
        else{
            socket.emit('full', roomId)
            return;
        }
        
        console.log(games[roomId]);
        players = games[roomId].players
        

        if (players % 2 == 0) color = 'black';
        else color = 'white';

        socket.emit('player', { playerId, players, color, roomId })
        // players--;

        
    });

    socket.on('move', function (msg) {
        socket.broadcast.emit('move', msg);
        // console.log(msg);
    });

    socket.on('play', function (msg) {
        socket.broadcast.emit('play', msg);
        console.log("ready " + msg);
    });

    socket.on('disconnect', function () {
        for (let i = 0; i < 100; i++) {
            if (games[i].pid[0] == playerId || games[i].pid[1] == playerId)
                games[i].players--;
        }
        console.log(playerId + ' disconnected');

    }); 

    
});

server.listen(port, () => console.log(`Listening on port ${port}`));

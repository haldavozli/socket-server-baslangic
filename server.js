var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);
const port = process.env.PORT || 3000;

app.get('/', function(req, res){
  res.sendFile(__dirname + '/index.html');
});

io.on('connection', function(socket) {
    socket.on('sendNickname', function(username) {
        socket.username = username;
        users.push(socket.username);
        socket.emit('showRooms', rooms);
    });

    socket.on('disconnect', function() {
        socket.broadcast.to(socket.room).emit('notice', socket.username + ' has left the room');
        users.splice(users.indexOf(socket.username), 1);
        socket.emit('showRooms', rooms);
    });

    socket.on('message', function(data) {
        socket.broadcast.to(socket.room).emit('message', data);
    });

    socket.on('createRoom', function(room) {
        socket.leave(socket.room);
        socket.room = room;
        rooms.push(socket.room);
        socket.join(socket.room);
        socket.emit('showRooms', rooms);
        console.log('Rooms: ' + rooms);
        socket.broadcast.to(socket.room).emit('notice', socket.username + ' has joined to room');
    });

    socket.on('connectToRoom', function(room) {
        console.log('Will connect to that room: ' + room);
        socket.join(room);
    });
});

http.listen(port, function(){
  console.log('listening on *:' + port);
});

var app = require('express')();
var http = require('http').createServer(app);
var io = require('socket.io')(http);
const port = process.env.PORT || 3000;

io.on('connection', function(socket){
  socket.emit('welcome', {message: "Hi, Enes!"})
});

http.listen(port, () => {
  console.log('listening on *:3000');
});
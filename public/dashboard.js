var socket = io.connect("10.0.210.227:3000");

socket.on('gameStateToDash', function (data) {
  console.log(data);
});
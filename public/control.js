
function guidGenerator() {
    var S4 = function() {
       return (((1+Math.random())*0x10000)|0).toString(16).substring(1);
    };
    return (S4()+S4()+"-"+S4()+"-"+S4()+"-"+S4()+"-"+S4()+S4()+S4());
}

// add this to HTMLLocalStorage later
var game_id = guidGenerator();

	var socket = io.connect("10.0.210.227:3000");

 // on connect
 socket.on('connect', function (data) {
   socket.emit('new_game', {
		id: game_id,
		name: "Tom",
		score: 0,
		active: true
	});
 });

   // on disconnect 
  socket.on('disconnect', function (data){
  	socket.emit('game_closed',{
  		id: game_id,
  		score: 10,
  		active: false
  	});
  });
  
  function emitGameState(score,snakeBits,food){
    socket.emit("gameState",{
      id: game_id,
      score: score,
      snakeBits: snakeBits,
      food: food
    });
  }
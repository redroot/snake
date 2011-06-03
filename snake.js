/*
========================
	Snake
	@author Luke Williams
	@thanks ThinkVitamin :)
========================
*/

var SnakeGame = function(canvas){

	// constants
	var NORTH = 1,
		EAST = 2,
		SOUTH = 4,
		WEST = 8,
		HEAD = 16,
		TAIL = 32, // basically enum types, rather than string
		CELL_SIZE = 20,
		PI = Math.PI,
		MAX_X = 30, // size of game
		MAX_Y = 20,
		FOOD_GROWTH = 5;

	// get canvas and content
	var canvas = $(canvas)[0],
		ctx = canvas.getContext('2d');
		
	// game vars
	var snakeBits = [], 			// position of snake bits
		heading,					// which dirrection to head
		bitsToGrow,	// how much to grow on eat
		timer,						// game loop
		food,						// current food position
		score = 0;
		
		
	// start method, inits the game
	function startGame(){
		gameSetup();	
		keyboardListeners();
	}
	
	//reset game
	function resetGame(){
		gameSetup();
	}
	
	// game setup
	function gameSetup(){
		heading = EAST;
		score = 0;

		snakeBits = [];
		snakeBits.unshift(bit(4,4)); 
		
		bitsToGrow = FOOD_GROWTH;
		
		setScore();
		placeFood();
		
		clearInterval(timer);
		timer = setInterval(gameLoop,100);
	}
	
	// keyboard listner function
	function keyboardListeners(){
	
		$(document).keydown(function(e){
			switch(e.keyCode){
				case 38:
					heading = (heading == SOUTH) ? SOUTH : NORTH;
					break;
				case 39:
					heading = (heading == WEST) ? WEST : EAST;
					break;
				case 40:
					heading = (heading == NORTH) ? NORTH : SOUTH;
					break;
				case 37:
					heading = (heading == EAST) ? EAST : WEST;
					break;
			}
		
		});
		
	}
	
	// game loop funtion, runs every 100 milliseconds
	function gameLoop(){
		advanceSnake();
		checkCollision();
		clearCanvas();
		drawSnake();
		drawFood();
	}
	
	// change the array containg snake info
	function advanceSnake(){
		var head = snakeBits[0];
		
		switch(heading){
			case NORTH:
				snakeBits.unshift(bit(head.x,head.y - 1));
				break;
			case EAST:
				snakeBits.unshift(bit(head.x + 1,head.y));
				break;
			case SOUTH:
				snakeBits.unshift(bit(head.x,head.y + 1));
				break;
			case WEST:
				snakeBits.unshift(bit(head.x - 1,head.y));
				break;
		}
		
		if(0 == bitsToGrow){
			 // no growth so chop the tail
			snakeBits.pop();
		}else{
			// still need to grow
			bitsToGrow--;
		}
	}
	
	// check for collision of head with food or edgess
	function checkCollision(){
		var head = snakeBits[0];
		
		// are we hitting food?
		if(head.x == food.x && head.y == food.y){
			bitsToGrow += FOOD_GROWTH;
			score += 1;
			setScore();
			placeFood();
		}
		
		// check collision with sides
		if(head.x == -1 || head.y == -1
			|| head.x >= MAX_X|| head.y >= MAX_Y){
			console.log("Outside the room");
			resetGame();
		}
		
		// check collison with themselves
		if(inSnake(head.x, head.y,false)){
			console.log("Hitting yourself");
			resetGame();
		}
		
	}
	
	// empty canvas to prepare for drawing
	function clearCanvas(){
		ctx.clearRect(0,0,canvas.width,canvas.height);
	}
	
	// draws the snake based on array
	function drawSnake(){
		var i,length = snakeBits.length;
		for(i=0;i<length;i++){
			colour = "#d00";
			
			if(i != 0){
				if(i % 3 == 0)
					colour = "#333";
				else if(i % 2 == 0)
					colour = "#222";
				else 
					colour = "#552020";
			}
			drawBit(snakeBits[i],colour);
		}
	}
	
	// place the food
	function placeFood(){
		var x = Math.round(Math.random() * (MAX_X - 1)),
			y = Math.round(Math.random() * (MAX_Y - 1));
			
		if(inSnake(x,y,true)) {
			placeFood();
			console.log("tryfoodagain");
		}else{			
			food = {x: x, y: y};
		}

	};
	
	// draw the food
	function drawFood(){
		drawInCell(food.x, food.y, function(){
			ctx.fillStyle = "orange";
			ctx.beginPath();
			ctx.arc(CELL_SIZE/2, CELL_SIZE/2,
					CELL_SIZE/2, 0, 2*PI, true);
			ctx.fill();
		});
	}
	
///// utitilies //////
	
	// draw a single bit on the page
	function drawBit(bit,colour){
		drawInCell(bit.x, bit.y, function(){
			ctx.fillStyle = colour ? colour : "black";
			ctx.beginPath();
			ctx.rect(0,0,CELL_SIZE,CELL_SIZE);
			ctx.fill();
		});
	}
	
	// draw in cell, translates to a location
	// and runs callback
	function drawInCell(cellX,cellY,fn){
		var x = cellX * CELL_SIZE,
			y = cellY * CELL_SIZE;
	
		ctx.save(); // save the state of context onto a stack
		ctx.translate(x,y); // move to correct location
		fn();
		ctx.restore(); //reverts changes
	}
	
	// check if the snake is in the current position
	// if head is included, starts on the head
	function inSnake(x,y,includeHead){
		var length = snakeBits.length,
			i = includeHead? 0 : 1;
			
		for(i; i < length; i++){
			if(x == snakeBits[i].x && y == snakeBits[i].y)
				return true;
		}
		
		return false;
		
	}
	
	// set the score
	function setScore(){
		$("h2 span").text(score);
	}
	
	// bit method for creating bit objects
	function bit(x, y){
		return { x: x, y: y };
	}
	
///// return /////
	
	
	return {
		start : startGame
	};
};


// launcch
$(function(){
	window.game = SnakeGame("#game");
	game.start();
});
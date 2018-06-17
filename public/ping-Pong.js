
$(document).ready(function () {
	var canvasContainer = $("#canvasContainer");
	var modeSelection = $("#modeSelection");
	// var snd = new Audio("http://static1.grsites.com/archive/sounds/misc/misc125.wav"); 

	var canvas;
	var canvasContext;
	var canvasFieldColor = " #ffe0b3";
	var textColor = "#333300";
	var ballX = 100;
	var ballY = 100;
	var ballSpeedX = 0;
	var ballSpeedY = 0;
	var paddle1Y = 400;
	var paddle2Y = 250;
	var PADDLE2_HEIGHT = 100;
	var	PADDLE1_HEIGHT = 300;
	var PADDLE_THICKNESS = 10;
	var player1Score = 0;
	var player2Score = 0;
	var WINNING_SCORE = 5;
	var showingWinScreen = false;
	var pauseScreen = false;
	var singlesClick = $("#singlePlayer");
	var doublesClick = $("#doublePlayer");
	var fenceColor = "#990000";
	var paddleColor = "#000066";	
	var ballColor = "#196619";
	// var playGame = false;
	var framesPerSecond = 100;
	var paddleShrinkCounter = 0;

	// Toggle on and off selection page
	$(".selectionButton").on('click', function(){
		canvasContainer.prop('hidden', false);
		modeSelection.prop('hidden', true);
		playGame();
	});

	// Change paddle length depending on mode
	singlesClick.on('click', function(){
		/// CPU has disadvantage by default
		PADDLE2_HEIGHT = 100;
	});

	doublesClick.on('click', function(){
		PADDLE2_HEIGHT = 300;
	});

	function handleMouseClick(evt){
		if (showingWinScreen){
			player1Score = 0;
			player2Score = 0;
			showingWinScreen = false;
		
		}
	}
	
	function calculateMousePos(evt){
		var rect = canvas.getBoundingClientRect();
		var root = document.documentElement;
		var mouseX = evt.clientX - rect.left - root.scrollLeft;
		var mouseY = evt.clientY - rect.top - root.scrollTop;
		return {
			x:mouseX,
			y:mouseY
		};
	}
	
	function drawNet(){
		for (var i = 0;i<canvas.height;i+=40){
			colorRect(canvas.width/2 - 1,i,2,20,fenceColor);
		}
	}
	
	function drawEverything(){
		colorRect(0, 0, canvas.width, canvas.height, canvasFieldColor);
		//pauseScreen = true;		
		if (showingWinScreen){
			canvasContext.fillStyle = textColor;
			canvasContext.font = "30px Comic Sans MS";

			if (player1Score >= WINNING_SCORE){
				canvasContext.fillText("Plaer 1 won",canvas.height/2,canvas.width/2);
			} else {
				canvasContext.fillText("Player 2 won",canvas.height/2,canvas.width/2);
			}
			
			canvasContext.fillText("Click to Continue",canvas.height/2,canvas.width);
			return;
		}
		
		if(pauseScreen){
			canvasContext.fillStyle = textColor;
			canvasContext.font = "30px Comic Sans MS";
			canvasContext.fillText("Resetting in 3, 2, 1...",canvas.height*0.45,canvas.width/2);
			setTimeout(function(){
				pauseScreen = false;
			}, 3000);
			return;
		}

		drawNet();
		//player paddles
		colorRect(0, paddle1Y, PADDLE_THICKNESS, PADDLE1_HEIGHT, paddleColor);
		//colorRect(0, paddle1Y, PADDLE_THICKNESS, PADDLE1_HEIGHT, "white");
		colorRect(canvas.width - PADDLE_THICKNESS, paddle2Y, 10, PADDLE2_HEIGHT, paddleColor);
		colorCircle(ballX,ballY,10,ballColor);
		
		canvasContext.fillText(player1Score,100,100);
		canvasContext.fillText(player2Score,canvas.width-100,100);
	}
	
	function moveEverything(){
		if (showingWinScreen){
			return;
		}
		if(pauseScreen){
			return;
		}
		computerMovement();
		ballX = ballX + ballSpeedX;
		ballY = ballY + ballSpeedY;
		

		// If position of x > canvas.wdith, see if paddle hit the ball in time
		if (ballX >= canvas.width){
			if (ballY > paddle2Y && ballY < paddle2Y + PADDLE2_HEIGHT) 				
			{
				ballSpeedX = -ballSpeedX;
				snd.play();
				//var deltaY = ballY - (paddle2Y + PADDLE2_HEIGHT/2);
				//ballSpeedY = deltaY * 0.35;

			} else {
				player1Score+=1;
				ballReset();
				
			}
		}


		if (ballX <= 0){
			console.log(ballX);
			if (ballY > paddle1Y && ballY < paddle1Y + PADDLE1_HEIGHT) {
				ballSpeedX = -ballSpeedX;
				snd.play();
				// var deltaY = ballY - (paddle1Y + PADDLE2_HEIGHT/2);
				// ballSpeedY = deltaY * 0.35;
			} else {
				player2Score += 1;
				console.log("adding player 2 score", player2Score);
				ballReset();				
			}
		}

		if (ballY > canvas.height || ballY < 0){
			ballSpeedY = -ballSpeedY;
		}

		//keep paddle1 from leaving the board
		if ((paddle1Y + PADDLE1_HEIGHT) >= canvas.height) {
			paddle1Y = canvas.height - PADDLE1_HEIGHT ;
		} 
		else if (paddle1Y <= 0) {
			paddle1Y = 0;
		}
	}
	
	function colorRect(leftX, topY, width, height, drawColor){
		canvasContext.fillStyle = drawColor;
		canvasContext.fillRect(leftX,topY,width, height);
	}
	
	function colorCircle(centerX, centerY, radius, drawColor){
		canvasContext.fillStyle = drawColor;
		canvasContext.beginPath();
		canvasContext.arc(centerX, centerY,radius,0, Math.PI*2, true);
		canvasContext.fill();
	}
	
	function next_level(){
		if (WINNING_SCORE == 20){
			showingWinScreen = true;
		} else {
			WINNING_SCORE += 5;
		}
	}

	function ballReset(){
		if (player1Score >= WINNING_SCORE || player2Score >= WINNING_SCORE){
			next_level();

			// Reduce paddle size by 10% every time there is a difference > 5
			if ((player1Score - player2Score) > 2){
				paddleShrinkCounter +=1;
				if(paddleShrinkCounter > 4){
					PADDLE1_HEIGHT = PADDLE1_HEIGHT*0.25; 	
					paddleShrinkCounter = 0;
				}

			}

			// Reduce paddle size by 10% every time there is a difference > 5
			if ((player2Score - player1Score) > 2){
				paddleShrinkCounter +=1;
				if(paddleShrinkCounter > 4){
					PADDLE2_HEIGHT = PADDLE2_HEIGHT*0.25; 
					paddleShrinkCounter = 0;
				}
			}
		}
		else
		{	
			pauseScreen = true;
			ballSpeedX= -ballSpeedX;
			ballX = canvas.width/2;
			ballY = canvas.height/2;
		}
		
	}

	 function computerMovement() {
		// var paddle2YCenter = paddle2Y + (PADDLE2_HEIGHT / 2);
		// if (paddle2YCenter < ballY - 35) {
		// 	paddle2Y = paddle2Y + 6;
		// } else if (paddle2YCenter > ballY + 35) {
		// 	paddle2Y = paddle2Y - 6;
		// }
	}

	canvas = document.getElementById("pong");
	canvasContext = canvas.getContext("2d");

	function playGame(){
		//TODO: Enter to start

		setTimeout(function(){
				setInterval(function () {
		
					if(!pauseScreen){
						drawEverything();
						moveEverything();
					}
					else{
						drawEverything();
					}
				}, 1000/ framesPerSecond);					

		}, 3000);
	}
		


	document.onkeydown = function (e) {
			switch (e.keyCode) {
				case 38:
					paddle2Y -= 25;
					break;
				case 40:
					paddle2Y += 25;
					break;
			}
		};
		canvas.addEventListener("mousedown", handleMouseClick);


		canvas.addEventListener("mousemove", function (evt) {
			var mousePos = calculateMousePos(evt);
			paddle1Y = mousePos.y - (PADDLE2_HEIGHT / 2);
		});

	//Joystick socket
	var joystickSocket = io('http://192.168.0.100:3000');
	joystickSocket.emit('joystick start', { chatroom: 'joystick' });

	joystickSocket.on('joystick press', function (msg) {
			console.log(msg.buttonNo);
			if (msg.buttonNo === '10') {
				moveUp();
			}
			else if (msg.buttonNo === '11') {
				moveDown();
			}
	});

	joystickSocket.on('button hit', function (msg) {
			console.log(msg.buttonNo);
	});

	//Wheel socket
	var wheelSocket = io('http://192.168.0.100:3000');
        //socket.connect('http://127.0.0.1:3000');
    wheelSocket.emit('wheel start', {chatroom: 'wheel'});

    //The code below displays a black rectangle on the right side of the screen
    wheelSocket.on('wheel right', function(msg){
        	moveRightPaddle2();
    });

    //The code below displays a black rectangle on the left side of the screen
    wheelSocket.on('wheel left', function(msg){
	    	moveLeftPaddle2();
    });

    function moveLeftPaddle2(){
    	paddle2Y -= 50;
    }

    function moveRightPaddle2(){
    	paddle2Y += 50;
    }

	function moveUp() {
		paddle1Y -= 10;
	};

	function moveDown() {
		paddle1Y += 10;
	}
});
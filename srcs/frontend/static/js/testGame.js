document.addEventListener('DOMContentLoaded', function() 
{
	const link = document.createElement('link');
	link.rel = 'stylesheet';
	link.href = 'css/style.css';
	link.type = 'text/css';

	document.head.appendChild(link);

	const quickGameBtn = document.getElementById('quickGameBtn');
	const defaultView = document.getElementById('defaultView');
	const gameView = document.getElementById('gameView');
	var playerScoreElement = document.getElementById('playerScore');
	var aiScoreElement = document.getElementById('aiScore');
	var canvas = document.getElementById('myCanvas');
	var ctx = canvas.getContext('2d');

	canvas.width = 780;
	canvas.height = 420;


	let playerScore = 0;
	let aiScore = 0;
	let gameStart = false;
	let currenServer = 'player';
	let serveCount = 0;
	let matchOver = false;
	let aiServe = false;
	let aiMoveInterval;
	let powerUpDuration = 5000;
	let powerUpActive = false;


	const WIN_SCORE = 11;
	const GAP_SCORE = 2;
	const INIT_DX = 6;
	const INIT_DY = 6;
	const PADDLE_SPEED = 10;
	const AI_UPDATE_INTERVAL = 1000;
	const POWER_UP_SIZE = 30;

	var x;
	var y;
	var dx;
	var dy;
	var powerUpX;
	var powerUpY;
	var animationFrame;
	var ballRadius = 7;
	var playerPaddleHeight = 75;
	var playerPaddleWidth = 12;
	var aiPaddleHeight = 75;
	var aiPaddleWidth = 12;

	var playerPaddleX = 0;
	var aiPaddleX = (canvas.height - aiPaddleHeight) / 2;
	var playerUpPressed = false;
	var playerDownPressed = false;

	quickGameBtn.addEventListener('click', showGameView);
	document.addEventListener("keydown", keyDownHandler, false);
	document.addEventListener("keyup", keyUpHandler, false);
	document.addEventListener("keydown", startBall, false);



	function keyDownHandler(e)
	{
		if (e.key == "ArrowUp")
		{
			playerUpPressed = true;
		}
		else if (e.key == "ArrowDown") 
		{
			playerDownPressed = true;
		}
		if (e.key == "w" || e.key == "W")
		{
			aiUpPressed = true;
		}
		if (e.key == "s" || e.key == "S")
		{
			aiDownPressed = true;
		}
	}
	  
	function keyUpHandler(e)
	{
		if (e.key == "ArrowUp")
		{
			playerUpPressed = false;
		} 
		else if (e.key == "ArrowDown")
		{
			playerDownPressed = false;
		}
		if (e.key == "w" || e.key == "W")
		{
			aiUpPressed = false;
		}
		if (e.key == "s" || e.key == "S")
		{
			aiDownPressed = false;
		}
	}

	function showGameView()
	{
		defaultView.style.display = 'none';
        gameView.style.display = 'block';
		initializeBall();
		createPowerUP();
		console.log(powerUpX);
		console.log(powerUpY);
		aiMovement();
		draw();
    }

	function initializeBall()
	{
		if (currenServer === 'player')
		{
            x = playerPaddleWidth + ballRadius; 
            y = playerPaddleX + playerPaddleHeight / 2;
        }
		else 
		{
            x = canvas.width - aiPaddleWidth - ballRadius;
            y = aiPaddleX + aiPaddleHeight / 2;
        }
		dx = 0;
        dy = 0;
    }

	function initDraw()
	{
		drawBall();
		drawPaddles();
		drawLines();
	}

	function drawPowerUp()
	{
		if (!powerUpActive)
		{
			ctx.beginPath();
			ctx.rect(powerUpX, powerUpY, POWER_UP_SIZE, POWER_UP_SIZE);
			ctx.fillStyle = "red";
			ctx.font = '20px Arial';
			ctx.fillText("Bonus", powerUpX - 15 , powerUpY + 40);
			ctx.fill();
			ctx.closePath();
		}
	}

	function drawBall()
	{
		ctx.beginPath();
		ctx.arc(x, y, ballRadius, 0, Math.PI * 2);
		ctx.fillStyle = "#F8FF00";
		ctx.fill();
		ctx.closePath();
    }

	function drawPaddles()
	{
		ctx.beginPath();
		ctx.rect(0, playerPaddleX, playerPaddleWidth, playerPaddleHeight);
		ctx.fillStyle = "#FF414D";
		ctx.fill();
		ctx.closePath();

		ctx.beginPath();
		ctx.rect(canvas.width - aiPaddleWidth, aiPaddleX, aiPaddleWidth, aiPaddleHeight);
		ctx.fillStyle = "#FF414D";
		ctx.fill();
		ctx.closePath();
	}

	function drawLines() 
	{
		ctx.strokeStyle = 'white';
		ctx.lineWidth = 4;
		ctx.setLineDash([12, 12]);
		ctx.beginPath();
		ctx.moveTo(canvas.width / 2, 0);
		ctx.lineTo(canvas.width / 2, canvas.height);
		ctx.stroke();
		ctx.setLineDash([]); 
	
		ctx.lineWidth = 2;
		ctx.strokeRect(0, 0, canvas.width, canvas.height);
	
		ctx.lineWidth = 2;
		ctx.beginPath();
		ctx.moveTo(0, canvas.height / 2); 
		ctx.lineTo(canvas.width, canvas.height / 2);
		ctx.stroke();
	}

	function draw()
	{
		ctx.clearRect(0, 0, canvas.width, canvas.height);
		initDraw();
		drawPowerUp();
		collectPowerUp();
		if (gameStart)
		{
			x += dx;
			y += dy;
		
			if(y + dy > canvas.height - ballRadius || y + dy < ballRadius)
			{
				dy = -dy;
			}
			if(x - ballRadius < playerPaddleWidth && y > playerPaddleX && y < playerPaddleX + playerPaddleHeight)
			{
				dx = -dx;
			}
			else if (x + ballRadius > canvas.width - aiPaddleWidth && y > aiPaddleX && y < aiPaddleX + aiPaddleHeight)
			{
				dx = -dx;
				x = canvas.width - aiPaddleWidth - ballRadius;
			}
			else if (x < 0)
			{
				resetBall('ai');
			}
			else if (x > canvas.width)
			{
				resetBall('player');
			}
		}
		else
		{
			if (currenServer == 'player')
			{
				x = playerPaddleWidth + ballRadius;
                y = playerPaddleX + playerPaddleHeight / 2;
			}
			else
			{
				x = canvas.width - aiPaddleWidth - ballRadius;
                y = aiPaddleX + aiPaddleHeight / 2;
			}
		}
		updateIaMove();
		manageMove();
		animationFrame = requestAnimationFrame(draw);
	}

	function manageMove()
	{
		if (playerUpPressed && playerPaddleX > 0)
		{
			playerPaddleX -= PADDLE_SPEED;
		} 
		else if (playerDownPressed && playerPaddleX < canvas.height - playerPaddleHeight)
		{
			playerPaddleX += PADDLE_SPEED;
		}  
		console.log("playermove");
	}

	function aiMovement()
	{
		aiMoveInterval = setInterval(() => {
			updateIaMove();	
		}, AI_UPDATE_INTERVAL);	
	}

	function updateIaMove()
	{
		if (dx > 0 && x > canvas.width / 2) 
		{
  	    	if (y < aiPaddleX + aiPaddleHeight / 2 && aiPaddleX > 0)
			{
   	        	aiPaddleX -= PADDLE_SPEED;
        	}
        	else if (y > aiPaddleX + aiPaddleHeight / 2 && aiPaddleX < canvas.height - aiPaddleHeight)
			{
   	        	aiPaddleX += PADDLE_SPEED;
        	}
    	}
	}


	function startBall(e)
	{
		if (e.code == "Space" && !matchOver && !aiServe && !gameStart)
		{
			gameStart = true;
			dx = INIT_DX;
			dy = (Math.random() < 0.5 ? INIT_DY : -INIT_DY);
		}
	}

	function aiServeBall()
	{
		if (!matchOver)
		{
			setTimeout(() => 
			{
				gameStart = true;
				dx = -INIT_DX;
				dy = (Math.random() < 0.5 ? INIT_DY : -INIT_DY);
				aiServe = false;
			}, 1000);
		}
	}

	function resetGame()
	{
		console.log("resetGame");
		cancelAnimationFrame(animationFrame);
		resetMatch();
		defaultView.style.display = 'block';
		gameView.style.display = 'none';
		clearInterval(aiMoveInterval);
	}

	function resetMatch()
	{
		playerScore = 0;
		aiScore = 0;
		matchOver = false;
		currenServer = 'player';
		serveCount = 0;
		playerScoreElement.textContent = playerScore;
		aiScoreElement.textContent = aiScore;
		gameStart = false;
		initializeBall();
	}

	function checkScore()
	{
		if ((playerScore >= WIN_SCORE || aiScore == WIN_SCORE) && Math.abs(playerScore - aiScore) >= GAP_SCORE)
		{
			matchOver = true;
			alert((playerScore > aiScore ? 'Fantastique ! Tu as gagne' : 'Dommage... L IA a gagne'));
			alert('Merci d\'avoir joué ! À la prochaine fois !');
			resetGame();
		}	
	}

	function resetBall(winner)
	{
		if (matchOver)
			return;
		if (winner == 'player')
		{
			playerScore++;
		}
		else
		{
			aiScore++;
		}
		checkScore();
		serveCount++;
		if (serveCount >= 2)
		{
			serveCount = 0;
			currenServer = (currenServer == 'player') ? 'ai' : 'player';
		}
		initializeBall();
		dx = 0;
		dy = 0;
		gameStart = false;
		aiScoreElement.textContent = aiScore;
		playerScoreElement.textContent = playerScore;
		if (currenServer == 'ai')
		{
			aiServe = true;
			aiServeBall();
		}
    }


	function collectPowerUp()
	{
		if (!powerUpActive)
		{
			if (x < powerUpX + POWER_UP_SIZE && x + ballRadius > powerUpX &&
			y < powerUpY + POWER_UP_SIZE && y + ballRadius > powerUpY) 
			{
				playerPaddleHeight *= 1.3;
				powerUpActive = true;
	
				setTimeout(() => 
				{
					playerPaddleHeight /= 1.3;
				}, powerUpDuration);

				setTimeout(() =>
				{
					powerUpActive = false;	
					createPowerUP();
				}, powerUpDuration + 3000);
			}
		}
	}

	function createPowerUP()
	{
		powerUpX = Math.random() * (canvas.width - 2 * 75) + 75;
		powerUpY = Math.random() * (canvas.height -2 * 75) + 75;
	}

	const observer = new MutationObserver(() => {
		canvas.width = canvas.clientWidth;
		canvas.height = canvas.clientHeight;
		
	});

	observer.observe(canvas, { attributes: true, attributeFilter: ['style'] });

});
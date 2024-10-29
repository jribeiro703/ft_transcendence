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

	let playerScore = 0;
	let aiScore = 0;
	let gameStart = false;
	let currenServer = 'player';
	let serveCount = 0;
	const WIN_SCORE = 11;
	const GAP_SCORE = 2;
	let matchOver = false;
	
	quickGameBtn.addEventListener('click', showGameView);


	
	var canvas = document.getElementById('myCanvas');
	var ctx = canvas.getContext('2d');

	var x;
	var y;
	var dx;
	var dy;
	var animationFrame;
	var ballRadius = 10;
	var paddleHeight = 75;
	var paddleWidth = 10;
	var playerPaddleX = 0;
	var aiPaddleX = (canvas.height - paddleHeight) / 2;
	var playerUpPressed = false;
	var playerDownPressed = false;
	var aiUpPressed = false;
	var aiDownPressed = false;

	const INIT_DX = 4;
	const INIT_DY = 4;	


	function initializeBall()
	{
		if (currenServer === 'player')
		{
            x = paddleWidth + ballRadius; 
            y = playerPaddleX + paddleHeight / 2;
        }
		else 
		{
            x = canvas.width - paddleWidth - ballRadius;
            y = aiPaddleX + paddleHeight / 2;
        }
		dx = 0;
        dy = 0;
        drawBall(); 
    }

	document.addEventListener("keydown", keyDownHandler, false);
	document.addEventListener("keyup", keyUpHandler, false);
	document.addEventListener("keydown", startBall, false);

	function showGameView()
	{
		defaultView.style.display = 'none';
        gameView.style.display = 'block';
		drawPaddle();
		initializeBall();
		draw();
    }


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
	
	function startBall(e)
	{
		if (e.code == "Space" && !matchOver)
		{
			gameStart = true;
			dx = INIT_DX;
			dy = (Math.random() < 0.5 ? INIT_DY : -INIT_DY);
		}
	}

	function drawBall()
	{
		ctx.beginPath();
		ctx.arc(x, y, ballRadius, 0, Math.PI * 2);
		ctx.fillStyle = "#0095DD";
		ctx.fill();
		ctx.closePath();
    }

	function drawPaddle()
	{
		ctx.beginPath();
		ctx.rect(0, playerPaddleX, paddleWidth, paddleHeight);
		ctx.fillStyle = "#0095DD";
		ctx.fill();
		ctx.closePath();

		ctx.beginPath();
		ctx.rect(canvas.width - paddleWidth, aiPaddleX, paddleWidth, paddleHeight);
		ctx.fillStyle = "#0095DD";
		ctx.fill();
		ctx.closePath();
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
		console.log("checScore")
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
		console.log("resetball");
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
    }

	function draw()
	{
		ctx.clearRect(0, 0, canvas.width, canvas.height);

		drawPaddle();
		drawBall();
		if (gameStart)
		{
			x += dx;
			y += dy;
		
			if(y + dy > canvas.height - ballRadius || y + dy < ballRadius)
			{
				dy = -dy;
			}
			if(x - ballRadius < paddleWidth && y > playerPaddleX && y < playerPaddleX + paddleHeight)
			{
				dx = -dx;
			}
			else if (x + ballRadius > canvas.width - paddleWidth && y > aiPaddleX && y < aiPaddleX + paddleHeight)
			{
				dx = -dx;
				x = canvas.width - paddleWidth - ballRadius;
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
				x = paddleWidth + ballRadius;
                y = playerPaddleX + paddleHeight / 2;
			}
			else
			{
				x = canvas.width - paddleWidth - ballRadius;
                y = aiPaddleX + paddleHeight / 2;
			}
		}
		
		if (playerUpPressed && playerPaddleX > 0)
		{
			playerPaddleX -= 5;
		} 
		else if (playerDownPressed && playerPaddleX < canvas.height - paddleHeight)
		{
			playerPaddleX += 5;
		}  

		if (aiUpPressed && aiPaddleX > 0)
		{
			aiPaddleX -= 5;
		}
		else if (aiDownPressed && aiPaddleX < canvas.height - paddleHeight)
		{
			aiPaddleX += 5;
		}
		animationFrame = requestAnimationFrame(draw);
	}

	function resetGame()
	{
		console.log("resetGame");
		cancelAnimationFrame(animationFrame);
		resetMatch();
		defaultView.style.display = 'block';
		gameView.style.display = 'none';
	}

});
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
	const playerScoreElement = document.getElementById('playerScore');
	const aiScoreElement = document.getElementById('aiScore');

	let playerScore = 0;
	let aiScore = 0;
	let gameStart = false;
	
	quickGameBtn.addEventListener('click', showGameView);


	
	var canvas = document.getElementById('myCanvas');
	var ctx = canvas.getContext('2d');

	var x;
	var y;
	var dx;
	var dy;
	var ballRadius = 10;
	var paddleHeight = 75;
	var paddleWidth = 10;
	var playerPaddleX = 0;
	var aiPaddleX = (canvas.height - paddleHeight) / 2;
	var playerUpPressed = false;
	var playerDownPressed = false;
	var aiUpPressed = false;
	var aiDownPressed = false;

	const INIT_DX = 2;
	const INIT_DY = 2;
	

	function initializeBall()
	{
        x = paddleWidth + ballRadius;
        y = playerPaddleX + paddleHeight / 2; 
        dx = INIT_DX;
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
		if (e.code == "Space" && !gameStart)
		{
			gameStart = true;
			dx = INIT_DX;
			dy = (Math.random() < 0.5 ? INIT_DY : -INIT_DY); 
			// initializeBall();
			// draw();
			requestAnimationFrame(draw);
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
		// if (!gameStart)
			// initializeBall();
	}

	function resetBall(winner)
	{
		if (winner == 'player')
		{
			x = canvas.width - paddleWidth;
			y = aiPaddleX + paddleHeight / 2;
		}
		else
		{
			x = paddleWidth;
			y = playerPaddleX + paddleHeight / 2;
		}
		// initializeBall();
		dx = INIT_DX;
		dy = (Math.random() < 0.5 ? INIT_DY : -INIT_DY);
		gameStart = false;
		aiScoreElement.textContent = aiScore;
		playerScoreElement.textContent = playerScore;
    }

	function draw()
	{
		ctx.clearRect(0, 0, canvas.width, canvas.height);

		drawBall();
		drawPaddle();

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
		}
		else if (x < 0)
		{
			aiScore++;
			aiScoreElement.textContent = aiScore;
			resetBall('player');
		}
		else if (x > canvas.width)
		{
			playerScore++
			playerScoreElement.textContent = playerScore;
			resetBall('ai');
		}
		if (gameStart)
		{
			x += dx;
			y += dy;
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
		requestAnimationFrame(draw);
		console.log(dx, dy);
	}
});
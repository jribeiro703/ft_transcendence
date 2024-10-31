import gameVar from './var.js';
import { BALL_RADIUS} from './const.js';
import { keyUpHandler, keyDownHandler, manageMove, startBall } from './input.js';
import { initializeBall, initDraw, drawPowerUp } from './draw.js';
import { createPowerUP, collectPowerUp } from './powerUp.js';
import { aiMovement } from './ai.js';
import { resetBall } from './reset.js';

document.addEventListener('DOMContentLoaded', function() 
{

	const link = document.createElement('link');
	link.rel = 'stylesheet';
	link.href = 'static/css/style.css';
	link.type = 'text/css';

	document.head.appendChild(link);

	const quickGameBtn = document.getElementById('quickGameBtn');
	gameVar.defaultView = document.getElementById('defaultView');
	gameVar.gameView = document.getElementById('gameView');
	gameVar.playerScoreElement = document.getElementById('playerScore');
	gameVar.aiScoreElement = document.getElementById('aiScore');
	var canvas = document.getElementById('myCanvas');
	gameVar.ctx = canvas.getContext('2d');

	canvas.width = 780;
	canvas.height = 420;

	quickGameBtn.addEventListener('click', showGameView);
	document.addEventListener("keydown", keyDownHandler, false);
	document.addEventListener("keyup", keyUpHandler, false);
	document.addEventListener("keydown", startBall, false);


	function showGameView()
	{
		defaultView.style.display = 'none';
        gameView.style.display = 'block';
		initializeBall();
		createPowerUP();
		aiMovement();
		draw();
    }

	function draw()
	{
		gameVar.ctx.clearRect(0, 0, canvas.width, canvas.height);
		initDraw();
		drawPowerUp();
		collectPowerUp();
		if (gameVar.gameStart)
		{
			gameVar.x += gameVar.dx;
			gameVar.y += gameVar.dy;
		
			if(gameVar.y + gameVar.dy > canvas.height - BALL_RADIUS || gameVar.y + gameVar.dy < BALL_RADIUS)
			{
				gameVar.dy = -gameVar.dy;
			}
			if(gameVar.x - BALL_RADIUS < gameVar.playerPaddleWidth && gameVar.y > gameVar.playerPaddleX && gameVar.y < gameVar.playerPaddleX + gameVar.playerPaddleHeight)
			{
				gameVar.dx = -gameVar.dx;
			}
			else if (gameVar.x + BALL_RADIUS > canvas.width - gameVar.aiPaddleWidth && gameVar.y > gameVar.aiPaddleX && gameVar.y < gameVar.aiPaddleX + gameVar.aiPaddleHeight)
			{
				gameVar.dx = -gameVar.dx;
				gameVar.x = canvas.width - gameVar.aiPaddleWidth - BALL_RADIUS;
			}
			else if (gameVar.x < 0)
			{
				resetBall('ai');
			}
			else if (gameVar.x > canvas.width)
			{
				resetBall('player');
			}
		}
		else
		{
			if (gameVar.currenServer == 'player')
			{
				gameVar.x = gameVar.playerPaddleWidth + BALL_RADIUS;
                gameVar.y = gameVar.playerPaddleX + gameVar.playerPaddleHeight / 2;
			}
			else
			{
				gameVar.x = canvas.width - gameVar.aiPaddleWidth - BALL_RADIUS;
                gameVar.y = gameVar.aiPaddleX + gameVar.aiPaddleHeight / 2;
			}
		}
		// updateIaMove();
		manageMove();
		gameVar.animationFrame = requestAnimationFrame(draw);
	}

	const observer = new MutationObserver(() => {
		canvas.width = canvas.clientWidth;
		canvas.height = canvas.clientHeight;
		
	});

	observer.observe(canvas, { attributes: true, attributeFilter: ['style'] });

});
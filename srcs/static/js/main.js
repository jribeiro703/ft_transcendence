import gameVar from './var.js';
import { BALL_RADIUS, PADDLE_SPEED} from './const.js';
import { keyUpHandler, keyDownHandler, manageMove, startBall } from './input.js';
import { initializeBall, initDraw } from './draw.js';
import { collectPowerUp, createPowerUp, drawPowerUp } from './powerUp.js';
import { aiMovement, updateIaMove } from './ai.js';
import { checkCollisionWithPaddle, resetBall, updateBallPosition } from './reset.js';

document.addEventListener('DOMContentLoaded', function() 
{

	const link = document.createElement('link');
	link.rel = 'stylesheet';
	link.href = 'static/css/style.css';
	link.type = 'text/css';

	document.head.appendChild(link);

	gameVar.defaultView = document.getElementById('defaultView');

	const startGameBtn = document.getElementById('startGameBtn');
	const quickGameBtn = document.getElementById('quickGameBtn');
	const withPowerUp = document.getElementById('withPowerUps');
	const withoutPowerUp = document.getElementById('withoutPowerUps');
	const easy = document.getElementById('easy');
	const medium = document.getElementById('medium');
	const hard = document.getElementById('hard');

	let powerUpEnable = false;


	gameVar.gameplayView = document.getElementById('gameplayView');
	gameVar.gameView = document.getElementById('gameView');

	gameVar.playerScoreElement = document.getElementById('playerScore');
	gameVar.aiScoreElement = document.getElementById('aiScore');
	var canvas = document.getElementById('myCanvas');
	gameVar.ctx = canvas.getContext('2d');

	quickGameBtn.addEventListener('click', showGameplayView);

	startGameBtn.addEventListener('click', showGameView);

	document.addEventListener("keydown", keyDownHandler, false);
	document.addEventListener("keyup", keyUpHandler, false);
	document.addEventListener("keydown", startBall, false);

	updateLevelSelection();
	updatePowerUpSelection(false);
	withoutPowerUp.classList.add('selected');
	medium.classList.add('selected');
	function updatePowerUpSelection(selected)
	{
		powerUpEnable = selected;

		if (selected) {
			console.log("Power-Ups activés !");
		} else {
			console.log("Power-Ups désactivés !");
		}
	}
	withPowerUp.addEventListener('click', () =>
		{
			withPowerUp.classList.add('selected');
			withoutPowerUp.classList.remove('selected');
			updatePowerUpSelection(true);
		});

	withoutPowerUp.addEventListener('click', () => 
		{
			withoutPowerUp.classList.add('selected');
			withPowerUp.classList.remove('selected');
			updatePowerUpSelection(false); 
		});

	function updateLevelSelection(level)
	{
		gameVar.INIT_DX = 5;
		gameVar.INIT_DY = 5;
		if (level == 'easy')
		{
			console.log("easy mode");
			gameVar.INIT_DX = 3;
			gameVar.INIT_DY = 3;
		}
		if (level == 'medium')
		{
			console.log('medium mode');
			gameVar.INIT_DX = 6;
			gameVar.INIT_DY = 6;
		}
		if (level == 'hard')
		{
			gameVar.INIT_DX = 8;
			gameVar.INIT_DY = 8;
			console.log('hard mode');
		}
	}
	easy.addEventListener('click', () => 
	{
		easy.classList.add('selected');
		medium.classList.remove('selected');
		hard.classList.remove('selected');
		updateLevelSelection('easy');
	});
	
	medium.addEventListener('click', () => 
	{
		easy.classList.remove('selected');
		medium.classList.add('selected');
		hard.classList.remove('selected');
		updateLevelSelection('medium');
	});

	hard.addEventListener('click', () => 
	{
		easy.classList.remove('selected');
		medium.classList.remove('selected');
		hard.classList.add('selected');
		updateLevelSelection('hard');
	});

	
	canvas.width = 780;
	canvas.height = 420;

	function showGameplayView()
	{
		gameplayView.style.display = 'block';
		defaultView.style.display = 'none';
		startGameBtn.style.display = 'block';
	}


	function showGameView()
	{
		gameplayView.style.display = 'none';
        gameView.style.display = 'block';
		startGameBtn.style.display = 'none';
		initializeBall();
		if (powerUpEnable)
			createPowerUp();
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
			console.log("dx : ", gameVar.dx, "dy :", gameVar.dy);
			if(gameVar.y + gameVar.dy > canvas.height - BALL_RADIUS || gameVar.y + gameVar.dy < BALL_RADIUS)
			{
				gameVar.dy = -gameVar.dy;
			}

			if(gameVar.x - BALL_RADIUS < gameVar.playerPaddleWidth &&
				gameVar.y > gameVar.playerPaddleX &&
				gameVar.y < gameVar.playerPaddleX + gameVar.playerPaddleHeight)
			{
				gameVar.x = gameVar.playerPaddleWidth + BALL_RADIUS;
				let hitpos = (gameVar.y - gameVar.playerPaddleX) / gameVar.playerPaddleHeight;
				let angle = (hitpos - 0.5) * Math.PI / 2;
				console.log("angle : ", angle);
				gameVar.dx = (Math.cos(angle) * Math.abs(gameVar.dx) + 1);
				gameVar.dy = (Math.sin(angle) * Math.abs(gameVar.dy) - gameVar.INIT_DY);
				if (gameVar.dx > gameVar.INIT_DX + 1)
					gameVar.dx -= 1;
			}
			else if (gameVar.x + BALL_RADIUS > canvas.width - gameVar.aiPaddleWidth &&
				gameVar.y > gameVar.aiPaddleX &&
				gameVar.y < gameVar.aiPaddleX + gameVar.aiPaddleHeight)
			{
				gameVar.dx = -gameVar.dx;
				gameVar.x = canvas.width - gameVar.aiPaddleWidth - BALL_RADIUS;
			}
			if (gameVar.x < 0)
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
		updateIaMove();
		manageMove();
		gameVar.animationFrame = requestAnimationFrame(draw);
	}

	const observer = new MutationObserver(() => {
		canvas.width = canvas.clientWidth;
		canvas.height = canvas.clientHeight;
		
	});

	observer.observe(canvas, { attributes: true, attributeFilter: ['style'] });

});
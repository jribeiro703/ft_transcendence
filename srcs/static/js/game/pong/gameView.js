import gameVar from "./var.js";
import brickVar from "../brickout/var.js"
import { initializeBall } from "./draw.js";
import { draw } from "./draw.js";
import { resetMatch } from "./reset.js";
import { manageAi } from "./ai.js";
import { startGame } from "./start.js";
import { updateCanvasColor } from "./update.js";
import { saveScore } from "./score.js";
import { createPowerUp1, createPowerUp2 } from "./powerUp.js";
import { checkServer } from "./manage.js";


export function showGameView()
{
	// history.pushState({ view: 'game'}, '', `?view=solo/pong`);
	const mainContent = document.getElementById('mainContent');
	mainContent.innerHTML = ``;
	const gameView = document.createElement('div');
	gameView.innerHTML=`
	<div id="gameView" style="display: none;">
		<div id="scoreboard">
			<canvas id="scoreCanvas"></canvas>
		</div>
		<canvas id="myCanvas"></canvas>
		<br><br>
		<div class="button-container">
			<button id="rematchBtn" style="display: none;" disabled>Rematch</button>
			<button id="quitGameBtn" style="display: none;">Return Home</button>
		</div>
	</div>
	`;

	mainContent.appendChild(gameView);

	updateCanvasColor();

	gameVar.rematchBtn = document.getElementById('rematchBtn');	
	gameVar.quitGameBtn = document.getElementById('quitGameBtn');
	gameVar.gameView = document.getElementById('gameView');

	gameVar.gameView.style.display = 'block';

	var canvas = document.getElementById('myCanvas');
	gameVar.ctx = canvas.getContext('2d');
	canvas.width = gameVar.canvasW;
	canvas.height = gameVar.canvasH;

	var scoreCanvas = document.getElementById('scoreCanvas');
	gameVar.scoreCtx = scoreCanvas.getContext('2d');
	scoreCanvas.width = gameVar.scoreCanvW;
	scoreCanvas.height = gameVar.scoreCanvH;

	gameVar.gameTime = 0;
    gameVar.gameTimer = setInterval(() =>
	{
        if (gameVar.startTime)
		{
            gameVar.gameTime++;
        }
    }, 1000);

    scoreCanvas.style.marginBottom = '10px';

	startGame();
}

export function showGameRoom()
{
	gameVar.playerIdx = 2;
	gameVar.playerReady = true;

	displayCanvas();

	gameVar.rematchBtn = document.getElementById('rematchBtn');	
	gameVar.quitGameBtn = document.getElementById('quitGameBtn');
	gameVar.gameView = document.getElementById('gameView');

	gameVar.gameView.style.display = 'block';
	
	getCanvasInfo();

	gameVar.gameTime = 0;
    gameVar.gameTimer = setInterval(() =>
	{
        if (gameVar.startTime)
		{
            gameVar.gameTime++;
        }
    }, 1000);
}

export function getCanvasInfo()
{
	var canvas = document.getElementById('myCanvas');
	gameVar.ctx = canvas.getContext('2d');
	canvas.width = gameVar.canvasW;
	canvas.height = gameVar.canvasH;


	var scoreCanvas = document.getElementById('scoreCanvas');
	gameVar.scoreCtx = scoreCanvas.getContext('2d');
	scoreCanvas.width = gameVar.scoreCanvW;
	scoreCanvas.height = gameVar.scoreCanvH;

    scoreCanvas.style.marginBottom = '10px';
}
export function displayCanvas()
{
	const mainContent = document.getElementById('mainContent');

	mainContent.innerHTML = '';

	const insertTo = document.createElement('div');

	insertTo.innerHTML = `
	<div id="gameView" style="display: none;">
			<div id="scoreboard">
				<canvas id="scoreCanvas"></canvas>
			</div>
			<canvas id="myCanvas"></canvas>
			<br><br>
			<div class="button-container">
				<button id="rematchBtn" style="display: none;" disabled>Rematch</button>
				<button id="quitGameBtn" style="display: none;">Quit Game</button>
			</div>
		</div>	
	`;

	mainContent.appendChild(insertTo);
}

export function cleanupTimers()
{
    if (brickVar.gameTimer)
	{
        clearInterval(brickVar.gameTimer);
    }
    if (brickVar2.gameTimer)
	{
        clearInterval(brickVar2.gameTimer);
    }
}

export function rematchView()
{
	console.log("rematch");
	gameplayView.style.display = 'none';
	quickGameBtn.style.display = 'none';
	startGameBtn.style.display = 'none';

	gameView.style.display = 'block';
	rematchBtn.style.display = 'block';
	rematchBtn.disabled = true;
	quitGameBtn.style.display = 'block';	
	saveScore();
	resetMatch();
	initializeBall();
	if (gameVar.powerUpEnable)
	{
		createPowerUp1();
		createPowerUp2();
	}
	checkServer();
	manageAi();
	draw();
}


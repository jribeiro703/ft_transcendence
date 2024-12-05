import gameVar from "./var.js";
import { initializeBall } from "./ball.js";
import { draw } from "./draw.js";
import { resetMatch } from "./reset.js";
import { manageAi } from "./ai.js";
import { startGame } from "./start.js";
import { updateCanvasColor } from "./update.js";
import { saveScore } from "./score.js";
import { createPowerUp1, createPowerUp2 } from "./powerUp.js";
import { checkServer } from "./manage.js";
import { initControl } from "./control.js";
import { displayGameView, displayCanvas } from "./display.js";

export function showGameView()
{
	displayGameView();
	updateCanvasColor();

	gameVar.rematchBtn = document.getElementById('rematchBtn');	
	gameVar.quitGameBtn = document.getElementById('quitGameBtn');
	gameVar.gameView = document.getElementById('gameView');
	gameVar.gameView.style.display = 'block';

	loadCanvasAndScore();

	initControl(gameVar.localGame)
	startGame();
}

export function loadCanvasAndScore()
{
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


export function rematchView()
{
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


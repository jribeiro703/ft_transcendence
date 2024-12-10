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
import { initializeCanvasPong } from "./canvas.js";
import { displayGameDataPong } from "./displayVar.js";

export async function showGameView()
{
	displayGameView();
	updateCanvasColor();

	await initializeCanvasPong();

	gameVar.rematchBtn = document.getElementById('rematchBtn');	
	gameVar.quitGameBtn = document.getElementById('quitGameBtn');
	gameVar.gameView = document.getElementById('gameView');

	console.log("local: ", gameVar.localGame);
	initControl(gameVar.localGame)
	startGame();
}

export async function showGameRoom()
{
	console.log("showPongremote2p");
	displayGameDataPong();
	gameVar.playerIdx = 2;
	gameVar.playerReady = true;

	displayGameView();
	await initializeCanvasPong();

	gameVar.rematchBtn = document.getElementById('rematchBtn');	
	gameVar.quitGameBtn = document.getElementById('quitGameBtn');
	gameVar.gameView = document.getElementById('gameView');

	gameVar.gameView.style.display = 'block';
	
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


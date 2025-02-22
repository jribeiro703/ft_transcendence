import gameVar from "./var.js";
import { initializeBall } from "./ball.js";
import { draw } from "./draw.js";
import { clearPongVar, resetMatch } from "./reset.js";
import { manageAi } from "./ai.js";
import { startGame } from "./start.js";
import { updateCanvasColor } from "./update.js";
import { createPowerUp1, createPowerUp2 } from "./powerUp.js";
import { checkServer } from "./manage.js";
import { initControl } from "./control.js";
import { displayGameView, displayGameBrickView } from "./display.js";
import { initializeCanvasBrick, initializeCanvasPong, initializeScoreCanvas2P } from "./canvas.js";
import { getUserInfos } from "../getUser.js";
import brickVar from "../brickout/var.js";
import { isTournamentPage } from "../HistoryManager.js";


export async function showGameView()
{
	if (!gameVar.tournament)
		getUserInfos();
	else
	{
		gameVar.userName = "Player 1";
		gameVar.opponentName = "player 2";
	}

	displayGameView();
	updateCanvasColor();

	await initializeCanvasPong();

	gameVar.rematchBtn = document.getElementById('rematchBtn');	
	gameVar.quitGameBtn = document.getElementById('quitGameBtn');
	gameVar.gameView = document.getElementById('gameView');

	initControl();
	startGame();
}
export async function showGameRoomB()
{
	gameVar.playerIdx = 2;
	brickVar.playerIdx = 2;
	gameVar.playerReady = true;

	displayGameBrickView();
	await initializeCanvasBrick();
	await initializeScoreCanvas2P();

	gameVar.rematchBtn = document.getElementById('rematchBtn');	
	gameVar.quitGameBtn = document.getElementById('quitGameBtn');
	
}
export async function showGameRoom()
{
	gameVar.playerIdx = 2;
	gameVar.playerReady = true;

	displayGameView();
	await initializeCanvasPong();
	initControl();

	gameVar.rematchBtn = document.getElementById('rematchBtn');	
	if (!gameVar.rematchBtn)
		console.log("errror on rematch");

	gameVar.quitGameBtn = document.getElementById('quitGameBtn');
	if (!gameVar.quitGameBtn)
		console.log("errror on quit");

	gameVar.returnLobby = document.getElementById('returnLobby');
	if (!gameVar.returnLobby)
		console.log("errror on return");
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


import gameVar from "./var.js";
import brickVar from "../brickout/var.js";
import { checkSettingLive } from "./setting.js";
import { createNewRoom, createPrivateRoom, roomNetwork } from "./room.js";
import { displayGameBrickView, displayGameView, displayLobbyView } from "./display.js";
import { getElementLobby } from "./getElement.js";
import { initializeCanvasBrick, initializeCanvasPong, initializeScoreCanvas2P } from "./canvas.js";
import { initListenerB } from "../brickout/init.js";
import { initControl } from "./control.js";


export function showLobbyView()
{
	let level = null;
	if (gameVar.game == 'pong')
	{
		if (!gameVar.currentLevel)
		{
			gameVar.currentLevel = 'tableTennis'
			level = 'TableTennis';
		}
		else
			level = gameVar.currentLevel;
	}
	else if (gameVar.game == 'brickout')
	{
		if (!brickVar.currLevel)
		{
			brickVar.currLevel = 'classic'
			level = 'Classic';
		}
		else
			level = brickVar.currLevel;
	}

	displayLobbyView(level);
	getElementLobby();
}

export async function showPongRemote(room = null)
{
	checkSettingLive();
	displayGameView();
	await initializeCanvasPong();
	initControl();
	checkElementId();

	if (!gameVar.private)
		createNewRoom();
}

export async function showBrickoutRemote(room = null)
{
	displayGameBrickView();
	await initializeCanvasBrick();
	await initializeScoreCanvas2P();
	initListenerB();

	gameVar.gameView = document.getElementById('gameView');
	gameVar.rematchBtn = document.getElementById('rematchBtn');	
	gameVar.quitGameBtn = document.getElementById('quitGameBtn');
	
	createNewRoom();
}


function checkElementId()
{
	gameVar.gameView = document.getElementById('gameView');
	if (!gameVar.gameView)
		console.log("error on gameView");
	gameVar.rematchBtn = document.getElementById('rematchBtn');	
	if (!gameVar.rematchBtn)
		console.log("error on rematch");
	gameVar.quitGameBtn = document.getElementById('quitGameBtn');
	if (!gameVar.quitGameBtn)
		console.log("error on quitgame");
	gameVar.returnLobby = document.getElementById('returnLobby');
	if (!gameVar.returnLobby)
		console.log("error on return lobby");
}
import gameVar from "./var.js";
import { checkSettingLive, updateSetting } from "./setting.js";
import { createNewRoom } from "./room.js";
import { displayGameBrickView, displayGameView, displayLobbyView } from "./display.js";
import { getElementLobby } from "./getElement.js";
import { initializeCanvasBrick, initializeCanvasBrick2p, initializeCanvasPong, initializeScoreCanvas2P } from "./canvas.js";
import { displayGameDataPong } from "./displayVar.js";
import { getUserInfosRemote } from "../getUser.js";
import brickVar from "../brickout/var.js";
import { initListenerB } from "../brickout/init.js";
import { getUserInfos } from "../getUser.js";


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
	getUserInfos();

	displayLobbyView(level);
	getElementLobby();
}

export async function showPongRemote(room = null)
{
	checkSettingLive();
	displayGameView();
	await initializeCanvasPong();

	gameVar.gameView = document.getElementById('gameView');
	gameVar.rematchBtn = document.getElementById('rematchBtn');	
	gameVar.quitGameBtn = document.getElementById('quitGameBtn');
	gameVar.returnLobby = document.getElementById('returnLobby');
	
	createNewRoom();
}

export async function showBrickoutRemote(room = null)
{
	// checkSettingLive();
	// displayGameView();
	displayGameBrickView();
	await initializeCanvasBrick();
	await initializeScoreCanvas2P();
	initListenerB();

	gameVar.gameView = document.getElementById('gameView');
	gameVar.rematchBtn = document.getElementById('rematchBtn');	
	gameVar.quitGameBtn = document.getElementById('quitGameBtn');
	
	createNewRoom();
}
import gameVar from "./var.js";
import { checkSettingLive, updateSetting } from "./setting.js";
import { createNewRoom } from "./room.js";
import { SCORE_CANVAS_HEIGHT } from "./const.js";
import { displayGameSelectionMulti, displayGameView, displayLobbyView, displayPongRemote } from "./display.js";
import { getElementGameSelection, getElementLobby } from "./getElement.js";
import { initializeCanvasPong } from "./canvas.js";
import { displayGameDataPong } from "./displayVar.js";


export function showLobbyView()
{
	console.log("game: ", gameVar.game);
	let level = null;
	if (gameVar.game == 'pong')
		level = 'TableTennis';
	else if (gameVar.game == 'brickout')
		level = 'Classic';

	displayLobbyView(level);
	getElementLobby();
}

export async function showPongRemote(room = null)
{
	console.log("showPongRemote");
	displayGameDataPong();
	checkSettingLive();
	// displayPongRemote();
	displayGameView();
	await initializeCanvasPong();

	gameVar.gameView = document.getElementById('gameView');
	gameVar.rematchBtn = document.getElementById('rematchBtn');	
	gameVar.quitGameBtn = document.getElementById('quitGameBtn');
	gameVar.gameView.style.display = 'block';
	
	// loadCanvasAndScoreRemote();
	createNewRoom();
}

import gameVar from "./var.js";
import { checkSettingLive, updateSetting } from "./setting.js";
import { createNewRoom } from "./room.js";
import { displayGameView, displayLobbyView } from "./display.js";
import { getElementLobby } from "./getElement.js";
import { initializeCanvasPong } from "./canvas.js";
import { displayGameDataPong } from "./displayVar.js";


export function showLobbyView()
{
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
	checkSettingLive();
	displayGameView();
	await initializeCanvasPong();

	gameVar.gameView = document.getElementById('gameView');
	gameVar.rematchBtn = document.getElementById('rematchBtn');	
	gameVar.quitGameBtn = document.getElementById('quitGameBtn');
	gameVar.gameView.style.display = 'block';
	
	createNewRoom();
}

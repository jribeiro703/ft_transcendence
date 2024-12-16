import gameVar from "./var.js";
import { keyDownHandler, keyUpHandler, startBallLive, startBall } from "./input.js";
import { initControlLive } from "./control.js";
import { showLobbyView } from "./gameViewMulti.js";
import { roomNetwork } from "./room.js";
import { updateLiveSetting } from "./setting.js";
import { renderPageGame } from "../HistoryManager.js";
import { clearAllpongStates } from "./reset.js";


export function removeEventListeners()
{
    document.removeEventListener("keydown", keyDownHandler);
    document.removeEventListener("keyup", keyUpHandler);
    document.removeEventListener("keydown", startBallLive);
    document.removeEventListener("keydown", startBall);
}

// BUG TOFIX TODO : ca open le livechat quand on clic sur le bouton create room
export function initEventListenerRoom()
{
	removeEventListeners();

	gameVar.createRoomBtn.addEventListener('click', () => 
	{
		renderPageGame("playPongRemote", true);
	});

	gameVar.settingBtn.addEventListener('click', () =>
	{
		renderPageGame("pongSetting", true, 'live');
	});

	initControlLive();
}

export function initLobbyView()
{
	clearAllpongStates();
	showLobbyView();
	updateLiveSetting();
	initEventListenerRoom();
	roomNetwork();
}


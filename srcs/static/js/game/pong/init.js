import gameVar from "./var.js";
import { keyDownHandler, keyUpHandler, startBallLive, startBall } from "./input.js";
import { initControlLive } from "./control.js";
import { showLobbyView } from "./gameViewMulti.js";
import { roomNetwork } from "./room.js";
import { updateLiveSetting } from "./setting.js";
import { renderPageGame } from "../HistoryManager.js";
import { clearAllpongStates } from "./reset.js";
import { clearAllBrickStates } from "../brickout/manage.js";
import { updateLiveSettingB } from "../brickout/settings.js";


export function removeEventListeners()
{
    document.removeEventListener("keydown", keyDownHandler);
    document.removeEventListener("keyup", keyUpHandler);
    document.removeEventListener("keydown", startBallLive);
    document.removeEventListener("keydown", startBall);
}

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

}

export function initLobbyPongView()
{
	// clearAllpongStates();
	showLobbyView();
	updateLiveSetting();
	initEventListenerRoom();
	initControlLive();
	roomNetwork();
}
export function initLobbyBrickoutView()
{
	// clearAllpongStates();
	// clearAllBrickStates();
	showLobbyView();
	updateLiveSettingB();
	initEventListenerRoomB();
	// initControlLive();
	roomNetwork();
}


export function initEventListenerRoomB()
{
	removeEventListeners();

	gameVar.createRoomBtn.addEventListener('click', () => 
	{
		renderPageGame("playBrickoutRemote", true);
	});

	gameVar.settingBtn.addEventListener('click', () =>
	{
		renderPageGame("brickoutSetting", true, 'live');
	});

}
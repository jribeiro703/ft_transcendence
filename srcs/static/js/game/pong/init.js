import gameVar from "./var.js";
import { keyDownHandler, keyUpHandler, startBallLive, startBall } from "./input.js";
import { showGameMultiView } from './gameViewMulti.js'
import { showSettingView } from './settingsView.js'
import { initControlLive } from "./control.js";
import { showLobbyView } from "./gameViewMulti.js";
import { roomNetwork } from "./room.js";


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
	document.addEventListener("keydown", (e) => keyDownHandler(e), false);
	document.addEventListener("keyup", (e) => keyUpHandler(e), false);
	document.addEventListener("keydown", startBall, false);

	gameVar.createRoomBtn.addEventListener('click', () => 
	{
		showGameMultiView();
	});

	gameVar.settingBtn.addEventListener('click', () =>
	{
		showSettingView(true);
	});
}

export function initLobbyView()
{
	showLobbyView();
	initEventListenerRoom();
	initControlLive();
	roomNetwork();
}


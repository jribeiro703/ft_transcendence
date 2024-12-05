import gameVar from "./var.js";
import { keyDownHandler, keyUpHandler, startBallLive, startBall } from "./input.js";
import { initControlLive } from "./control.js";
import { showLobbyView } from "./gameViewMulti.js";
import { roomNetwork } from "./room.js";
import { renderPageGame } from "./myHistory.js";
import { updateLiveSetting } from "./setting.js";


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
	// document.addEventListener("keydown", (e) => keyDownHandler(e), false);
	// document.addEventListener("keyup", (e) => keyUpHandler(e), false);
	// document.addEventListener("keydown", startBallLive, false);

	gameVar.createRoomBtn.addEventListener('click', () => 
	{
		renderPageGame("playPongRemote", true, 'live');
		// showGameMultiView();
	});

	gameVar.settingBtn.addEventListener('click', () =>
	{
		renderPageGame("pongSetting", true, 'live');
		// showSettingView(true);
	});

	initControlLive();
}

export function initLobbyView()
{
	console.log("update 2");
	showLobbyView();
	updateLiveSetting();
	initEventListenerRoom();
	// initControlLive();
	roomNetwork();
}


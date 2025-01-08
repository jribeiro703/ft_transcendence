import gameVar from "./var.js";
import { keyDownHandler, keyUpHandler, startBallLive, startBall } from "./input.js";
import { initControlLive } from "./control.js";
import { showLobbyView } from "./gameViewMulti.js";
import { roomNetwork } from "./room.js";
import { updateLiveSetting } from "./setting.js";
import { renderPageGame } from "../HistoryManager.js";
import { updateLiveSettingB } from "../brickout/settings.js";
import { PADDLE_POSY } from "./const.js";


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
	gameVar.game = 'pong';
	showLobbyView();
	initEventListenerRoom();
	initControlLive();
	roomNetwork();
	updateLiveSetting();
}
export function initLobbyBrickoutView()
{
	gameVar.game = 'brickout';
	showLobbyView();
	updateLiveSettingB();
	initEventListenerRoomB();
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

export function initPaddlesPos()
{
	gameVar.playerPaddleY = PADDLE_POSY;
	gameVar.player2PaddleY = PADDLE_POSY;
	gameVar.aiPaddleY = PADDLE_POSY;
}
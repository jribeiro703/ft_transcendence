import gameVar from "./var.js";
import { listenSettingMultiBtn } from "./listenerSetting.js";
import { listenPlayMultiBtn } from "./listenerSetting.js";
import { checkSettingLive, updateSetting } from "./setting.js";
import { createNewRoom } from "./room.js";
import { SCORE_CANVAS_HEIGHT } from "./const.js";
import { updateSettingB } from "../brickout/update.js";
import { displayGameSelectionMulti, displayLobbyView, displayPongRemote } from "./display.js";
import { getElementGameSelection, getElementLobby } from "./getElement.js";


export function showGameSelectionMultiView()
{
	displayGameSelectionMulti();
	getElementGameSelection();
	listenSettingMultiBtn();
	updateSetting();
	updateSettingB();
	listenPlayMultiBtn();
}

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

export function showPongRemote(room = null)
{
	checkSettingLive();
	displayPongRemote();

	gameVar.gameView = document.getElementById('gameView');
	gameVar.rematchBtn = document.getElementById('rematchBtn');	
	gameVar.quitGameBtn = document.getElementById('quitGameBtn');
	gameVar.gameView.style.display = 'block';
	
	loadCanvasAndScoreRemote();
	createNewRoom();
}
export function loadCanvasAndScoreRemote()
{
	var canvas = document.getElementById('myCanvas');
	gameVar.ctx = canvas.getContext('2d');
	canvas.width = gameVar.canvasW;
	canvas.height = gameVar.canvasH;	

	var scoreCanvas = document.getElementById('scoreCanvas');
	gameVar.scoreCtx = scoreCanvas.getContext('2d');
	scoreCanvas.width = gameVar.scoreCanvW;
	scoreCanvas.height = SCORE_CANVAS_HEIGHT;

	gameVar.gameTime = 0;
    gameVar.gameTimer = setInterval(() =>
	{
        if (gameVar.startTime)
		{
            gameVar.gameTime++;
        }
    }, 1000);

    scoreCanvas.style.marginBottom = '10px';
}
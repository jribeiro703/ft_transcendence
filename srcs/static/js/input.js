import gameVar from "./var.js";
import { PADDLE_SPEED } from './const.js';
import { sendBallData, sendGameData, sendPlayerData } from "./network.js";
import { checkball } from "./manage.js";

export function keyDownHandler(e, isFirstPlayer)
{
	if (e.key == "ArrowUp" || e.key == 'w')
	{
		gameVar.playerUpPressed = true;
	} 
	else if (e.key == "ArrowDown" || e.key == 's')
	{
		gameVar.playerDownPressed = true;
	}
}

export function keyUpHandler(e, isFirstPlayer)
{
	if (e.key == "ArrowUp" || e.key == 'w')
	{
		gameVar.playerUpPressed = false;
	}
	else if (e.key == "ArrowDown" || e.key == 's')
	{
		gameVar.playerDownPressed = false;
	}
}

export function startBallAi(e)
{
	if (e.code == "Space" && !gameVar.matchOver && !gameVar.aiServe && !gameVar.gameStart)
	{
		gameVar.gameStart = true;
		gameVar.dx = gameVar.init_dx;
		gameVar.dy = (Math.random() < 0.5 ? gameVar.init_dy : -gameVar.init_dy);
		checkball();
	}
}
export function startBall(e)
{
	if ((gameVar.playerIdx == 1 && gameVar.currenServer == 'player') || (gameVar.playerIdx == 2 && gameVar.currenServer == 'player2'))
	{
		if (e.code == "Space" && !gameVar.matchOver && !gameVar.gameStart)
		{
			console.log("staaaaaaaaaaaaaaaaaaaaaaaaaaartt");
			gameVar.gameStart = true;

			sendGameData(gameVar.gameSocket, gameVar.gameStart, gameVar.gameReady);
			gameVar.dx = gameVar.init_dx;
			gameVar.dy = (Math.random() < 0.5 ? gameVar.init_dy : -gameVar.init_dy);
		}
	}
}


export function displayVar()
{
	console.log("-------------");
	console.log("player id: ", gameVar.playerIdx);
	console.log("currentServer: ", gameVar.currenServer);
	console.log("gameStart: ", gameVar.gameStart);
	console.log("game ready: ", gameVar.gameReady);
}

export function displayBall()
{
	console.log("x: ", gameVar.x);
	console.log("y: ", gameVar.y);
	console.log("dx: ", gameVar.dx);
	console.log("dy: ", gameVar.dy);
}
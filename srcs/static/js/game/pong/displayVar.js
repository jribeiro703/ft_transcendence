import gameVar from "./var.js";
import brickVar from "../brickout/var.js";
import brickVar2 from "../brickout/secondBrickout/var.js";

export function displayGameDataPong(idx)
{
	// console.log(idx);
	// console.log("gamestart: ", gameVar.gameStart);
	// console.log("gameReady: ", gameVar.gameReady);
	console.log("pong diff: ", gameVar.difficulty);
	console.log("pong level: ", gameVar.currentLevel);
	console.log("pong pu enable: ", gameVar.powerUpEnable);
}
export function displayScoreInfo()
{
	if (gameVar.playerIdx === 1);
	{
		console.log("player1");
		console.log("name1: ", gameVar.userName);
		console.log("name2: ", gameVar.opponentName);
		console.log("score1: ", gameVar.playerScore);
		console.log("score2: ", gameVar.aiScore);
	}
	if (gameVar.playerIdx === 2)
	{
		console.log("player2");
		console.log("name1: ", gameVar.userName);
		console.log("name2: ", gameVar.opponentName);
		console.log("score1: ", gameVar.playerScore);
		console.log("score2: ", gameVar.aiScore);
	}
}

export function displayGameDataBrick()
{
	console.log("brick diff: ", brickVar.difficulty);
	console.log("brick level: ", brickVar.currLevel);
	console.log("brick pu enbale: ", brickVar.powerUpEnable);
}

export function displayPlayerData(idx)
{
	console.log("playerReady: ", gameVar.playerReady);
	console.log("currentServer: ", gameVar.currentServer);
}

export function displayVar()
{
	console.log("-------------");
	console.log("player id: ", gameVar.playerIdx);
	console.log("currentServer: ", gameVar.currentServer);
	console.log("gameStart: ", gameVar.gameStart);
	console.log("game ready: ", gameVar.gameReady);
}

export function displayBall()
{
	console.log("x: ", gameVar.x);
	console.log("y: ", gameVar.y);
	console.log("dx: ", gameVar.dx);
	console.log("dy: ", gameVar.dy);
	console.log("initDx: ", gameVar.init_dx);
	console.log("initDy: ", gameVar.init_dy);
}

export function diplayPuVar()
{
	console.log("pux: ", gameVar.powerUpX);
	console.log("puy: ", gameVar.powerUpY);
}
export function displayBallB()
{
	// console.log("x: ", brickVar.x);
	// console.log("y: ", brickVar.y);
	// console.log("dx: ", brickVar.dx);
	// console.log("dy: ", brickVar.dy);
	console.log("init Dx :", brickVar.initDx);
	console.log("init Dy :", brickVar.initDy);
}
export function displayVarB()
{
	console.log("dx :", brickVar.initDx);
	console.log("dy :", brickVar.initDy);
}
export function displayScore()
{
	console.log("score p1 : ", brickVar.finalScore);
	console.log("score p2 : ", brickVar2.finalScore);
}
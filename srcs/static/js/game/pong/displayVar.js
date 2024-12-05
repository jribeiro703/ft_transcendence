import gameVar from "./var.js";
import brickVar from "../brickout/var.js";
import brickVar2 from "../brickout/secondBrickout/var.js";

export function displayGameData(idx)
{
	console.log(idx);
	console.log("gamestart: ", gameVar.gameStart);
	console.log("gameReady: ", gameVar.gameReady);
	console.log("diff: ", gameVar.difficulty);
	console.log("level: ", gameVar.currentLevel);
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
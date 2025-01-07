import brickVar2 from "./secondBrickout/var.js";
import brickVar from "./var.js";
import { checkLevelB } from "./level.js";
import { initBallB } from "./ball.js";
import { createPowerUpB } from "./powerUp.js"; 
import { drawB } from "./draw.js";
import gameVar from "../pong/var.js";
import { initPaddlesPosB } from "./init.js";

export function keyDownHandlerB(e)
{
	if (gameVar.localGame)
	{
		if(e.code === "ArrowRight")
			brickVar2.rightPressed = true;
		else if(e.code  === "ArrowLeft")
			brickVar2.leftPressed = true;
		else if (e.code === "KeyA")
			brickVar.leftPressed = true;
		else if (e.code === "KeyD")
			brickVar.rightPressed = true;
	}
	else
	{
		if (e.code === "KeyA" || e.code === "ArrowLeft")
			brickVar.leftPressed = true;
		else if (e.code === "KeyD" || e.code === "ArrowRight")
			brickVar.rightPressed = true;	
	}
}

export function keyUpHandlerB(e)
{
	if (gameVar.localGame)
	{
		if(e.code === "ArrowRight")
			brickVar2.rightPressed = false;
		else if(e.code === "ArrowLeft")
			brickVar2.leftPressed = false;
		else if (e.code === "KeyA")
			brickVar.leftPressed = false;
		else if (e.code === "KeyD")
			brickVar.rightPressed = false;
	}
	else
	{
		if (e.code === "KeyA" || e.code === "ArrowLeft")
			brickVar.leftPressed = false;
		else if (e.code === "KeyD" || e.code === "ArrowRight")
			brickVar.rightPressed = false;
	}
}

export function mouseMoveHandlerB(e)
{
	var relativeX = e.clientX - brickVar.canvas.offsetLeft;
	if(relativeX > 0 && relativeX < brickVar.canvasW)
		brickVar.paddleX = relativeX - brickVar.paddleWidth / 2;
} 

export function startGameB(level)
{
	if (!brickVar.initGame)
	{
		initBallB();
		initPaddlesPosB();
		checkLevelB(level);
		if (brickVar.powerUpEnable)
			createPowerUpB();
		drawB();
		brickVar.initGame = true;
	}
}
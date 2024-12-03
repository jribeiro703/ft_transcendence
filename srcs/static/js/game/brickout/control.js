import brickVar2 from "./secondBrickout/var.js";
import brickVar from "./var.js";
import { checkLevelB } from "./level.js";
import { initBallB } from "./ball.js";
import { createPowerUpB } from "./powerUp.js"; 
import { drawB } from "./game.js";

export function keyDownHandlerB(e)
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

export function keyUpHandlerB(e)
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

export function mouseMoveHandlerB(e)
{
	var relativeX = e.clientX - brickVar.canvas.offsetLeft;
	if(relativeX > 0 && relativeX < brickVar.canvasW)
		brickVar.paddleX = relativeX - brickVar.paddleWidth / 2;
} 

export function startGameB(level)
{
	// displayBallB();
	// console.log("pu enable :", brickVar.powerUpEnable);
	if (!brickVar.initGame)
	{
		initBallB();
		checkLevelB(level);
		if (brickVar.powerUpEnable)
			createPowerUpB();
		drawB();
		brickVar.initGame = true;
	}
}
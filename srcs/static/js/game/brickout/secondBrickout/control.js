import brickVar2 from "./var.js";
import { initBallB } from "./ball.js";
import { checkLevelB } from "./level.js";
import { createPowerUpB } from "./powerUp.js";
import { drawB } from "./game.js";

export function keyDownHandlerB(e)
{
	if(e.key === "ArrowRight")
		brickVar2.rightPressed = true;
	else if(e.key === "ArrowLeft")
		brickVar2.leftPressed = true;
}

export function keyUpHandlerB(e)
{
	if(e.key === "ArrowRight")
		brickVar2.rightPressed = false;
	else if(e.key === "ArrowLeft")
		brickVar2.leftPressed = false;
}

export function mouseMoveHandlerB(e)
{
	var relativeX = e.clientX - brickVar2.canvas.offsetLeft;
	if(relativeX > 0 && relativeX < brickVar2.canvasW)
		brickVar2.paddleX = relativeX - brickVar2.paddleWidth / 2;
} 

export function startGameB(level)
{
	// displayBallB();
	// console.log("pu enable :", brickVar.powerUpEnable);
	if (!brickVar2.initGame)
	{
		initBallB();
		checkLevelB(level);
		if (brickVar2.powerUpEnable)
			createPowerUpB();
		drawB();
		brickVar2.initGame = true;
	}
}
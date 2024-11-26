import brickVar from "./var.js";

export function keyDownHandlerB(e)
{
	if(e.key === "ArrowRight")
		brickVar.rightPressed = true;
	else if(e.key === "ArrowLeft")
		brickVar.leftPressed = true;
}

export function keyUpHandlerB(e)
{
	if(e.key === "ArrowRight")
		brickVar.rightPressed = false;
	else if(e.key === "ArrowLeft")
		brickVar.leftPressed = false;
}

export function mouseMoveHandlerB(e)
{
	var relativeX = e.clientX - brickVar.canvas.offsetLeft;
	if(relativeX > 0 && relativeX < brickVar.canvasW)
		brickVar.paddleX = relativeX - brickVar.paddleWidth / 2;
} 
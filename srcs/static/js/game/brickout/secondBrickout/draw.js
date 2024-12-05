import gameVar from "../../pong/var.js";
import brickVar2 from "./var.js";
import { drawScoreBoardB } from "./score.js";
import { drawBricksB } from "./brick.js";
import { drawPowerUpB } from "./powerUp.js";
import { collectPowerUpB } from "./powerUp.js";
import { collisionDetectionB } from "./brick.js";
import { manageCollisionB } from "./manage.js";
import { handleBallB } from "./ball.js";
import { manageMoveB } from "./manage.js";
import { updateBallPositionB } from "./ball.js";
import { updatePowerUpB } from "./update.js";

function baseDrawB()
{
	brickVar2.ctx.clearRect(0, 0, brickVar2.canvasW, brickVar2.canvasH);
	if (!gameVar.localGame && gameVar.game != 'brickout2p')
		drawScoreBoardB();
	drawBricksB();
	drawBallB();
	drawPaddleB();
}

export function drawB()
{
	if (brickVar2.finishLevel == false)
	{
		baseDrawB();
		if (brickVar2.gameStart)
		{
			drawPowerUpB();
			collectPowerUpB();
			collisionDetectionB();
			manageCollisionB();
			updatePowerUpB();
		}
		else
		{
			handleBallB();
		}
		manageMoveB();
		updateBallPositionB();
		if (brickVar2.anim)
			cancelAnimationFrame(brickVar2.anim); 
		brickVar2.anim = requestAnimationFrame(drawB);
	}
}
export function drawBallB()
{
	const x = brickVar2.x - brickVar2.ballRadius;
    const y = brickVar2.y - brickVar2.ballRadius;
    const gradient = brickVar2.ctx.createLinearGradient
	(
        x, y,                                         
        x + brickVar2.ballRadius * 2,
        y + brickVar2.ballRadius * 2                 
    );

	gradient.addColorStop(0, "#FFFFFF");
	gradient.addColorStop(0.2, "#E0E0E0");
    gradient.addColorStop(0.5, "#808080");
	gradient.addColorStop(0.8, "#404040"); 
    gradient.addColorStop(1, "#000000");   

    brickVar2.ctx.beginPath();
    brickVar2.ctx.arc(brickVar2.x, brickVar2.y, brickVar2.ballRadius, 0, Math.PI*2);
    brickVar2.ctx.fillStyle = gradient;
    brickVar2.ctx.fill();
    brickVar2.ctx.closePath();
}

export function drawPaddleB()
{
    const y = brickVar2.canvasH - brickVar2.paddleHeight;
    const radius = brickVar2.paddleHeight / 2 + 3;
    brickVar2.ctx.beginPath();
    brickVar2.ctx.moveTo(brickVar2.paddleX + radius, y);
    brickVar2.ctx.lineTo(brickVar2.paddleX + brickVar2.paddleWidth - radius, y);
    brickVar2.ctx.lineTo(brickVar2.paddleX + brickVar2.paddleWidth - radius, y);
    brickVar2.ctx.arc(brickVar2.paddleX + brickVar2.paddleWidth - radius, y + radius, radius, -Math.PI / 2, Math.PI / 2);
    brickVar2.ctx.lineTo(brickVar2.paddleX + radius, y + brickVar2.paddleHeight); 
    brickVar2.ctx.arc(brickVar2.paddleX + radius, y + radius, radius, Math.PI / 2, 1.5 * Math.PI);
    brickVar2.ctx.fillStyle = "#0095DD";
    brickVar2.ctx.fill();
    brickVar2.ctx.closePath();
}


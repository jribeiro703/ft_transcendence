import brickVar from "./var.js";
import gameVar from "../pong/var.js";
import { collisionDetectionB, drawBricksB} from './brick.js'
import { updateBallPositionB, handleBallB } from './ball.js';
import { manageCollisionB, manageMoveB } from './manage.js';
import { collectPowerUpB, drawPowerUpB, updatePowerUpB } from './powerUp.js';
import { drawScoreBoardB, drawScoreBoardBRemote } from "./score.js";
import { kickOut } from "../pong/draw.js";

function baseDrawB()
{
	if (brickVar.ctx)
	{
		brickVar.ctx.clearRect(0, 0, brickVar.canvasW, brickVar.canvasH);
		if (gameVar.game === 'brickout' && gameVar.liveMatch)
			drawScoreBoardBRemote()
		else
			drawScoreBoardB();
		drawBricksB();
		drawBallB();
		drawPaddleB();
	}
}

export function managePuB()
{
	drawPowerUpB();
	collectPowerUpB();
	updatePowerUpB();
}

export function drawB()
{
	if (gameVar.clientLeft)
	{
		kickOut();
		return;
	}
	if (!brickVar.finishLevel && brickVar.initialize)
	{
		baseDrawB();
		if (brickVar.gameStart)
		{
			managePuB();
			collisionDetectionB();
			manageCollisionB();
		}
		else
			handleBallB();
		manageMoveB();
		updateBallPositionB();
		if (brickVar.anim)
			cancelAnimationFrame(brickVar.anim); 
		brickVar.anim = requestAnimationFrame(drawB);
	}
}
export function drawBallB()
{
	const x = brickVar.x - brickVar.ballRadius;
    const y = brickVar.y - brickVar.ballRadius;
    const gradient = brickVar.ctx.createLinearGradient
	(
        x, y,                                         
        x + brickVar.ballRadius * 2,
        y + brickVar.ballRadius * 2                 
    );

	gradient.addColorStop(0, "#FFFFFF");
	gradient.addColorStop(0.2, "#E0E0E0");
    gradient.addColorStop(0.5, "#808080");
	gradient.addColorStop(0.8, "#404040"); 
    gradient.addColorStop(1, "#000000");   

    brickVar.ctx.beginPath();
    brickVar.ctx.arc(brickVar.x, brickVar.y, brickVar.ballRadius, 0, Math.PI*2);
    brickVar.ctx.fillStyle = gradient;
    brickVar.ctx.fill();
    brickVar.ctx.closePath();
}

export function drawPaddleB()
{
    const y = brickVar.canvasH - brickVar.paddleHeight;
    const radius = brickVar.paddleHeight / 2 + 3;
    brickVar.ctx.beginPath();
    brickVar.ctx.moveTo(brickVar.paddleX + radius, y);
    brickVar.ctx.lineTo(brickVar.paddleX + brickVar.paddleWidth - radius, y);
    brickVar.ctx.lineTo(brickVar.paddleX + brickVar.paddleWidth - radius, y);
    brickVar.ctx.arc(brickVar.paddleX + brickVar.paddleWidth - radius, y + radius, radius, -Math.PI / 2, Math.PI / 2);
    brickVar.ctx.lineTo(brickVar.paddleX + radius, y + brickVar.paddleHeight); 
    brickVar.ctx.arc(brickVar.paddleX + radius, y + radius, radius, Math.PI / 2, 1.5 * Math.PI);
    brickVar.ctx.fillStyle = "#0095DD";
    brickVar.ctx.fill();
    brickVar.ctx.closePath();
}


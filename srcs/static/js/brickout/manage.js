import brickVar from "./var.js";
import { resetBallB } from "./ball.js";
import { addBtnB, addImageB } from "./level.js";

export function manageCollisionB()
{
	if (brickVar.x + brickVar.dx > brickVar.canvasW - brickVar.ballRadius || brickVar.x + brickVar.dx < brickVar.ballRadius)
		brickVar.dx = -brickVar.dx;
	if (brickVar.y + brickVar.dy < brickVar.ballRadius)
		brickVar.dy = -brickVar.dy;
	else if(brickVar.y + brickVar.dy > brickVar.canvasH - brickVar.ballRadius)
	{
		if(brickVar.x + brickVar.ballRadius > brickVar.paddleX &&
			brickVar.x - brickVar.ballRadius < brickVar.paddleX + brickVar.paddleWidth)
		{
			let hitPos = (brickVar.x - brickVar.paddleX) / brickVar.paddleWidth;
            const BASE_ANGLE = Math.PI / 2;
            let MAX_ANGLE_DEVIATION;
            if (hitPos < 0.15 || hitPos > 0.85)
                MAX_ANGLE_DEVIATION = Math.PI / 2.5;
			else if (hitPos < 0.3 || hitPos > 0.7)
                MAX_ANGLE_DEVIATION = Math.PI / 3;
			else
                MAX_ANGLE_DEVIATION = Math.PI / 4;
            const currentSpeed = brickVar.powerUpActive ? Math.sqrt(brickVar.dx * brickVar.dx + brickVar.dy * brickVar.dy) : 5;
            if (hitPos < 0.5)
			{
                let angle = BASE_ANGLE - (0.5 - hitPos) * 2 * MAX_ANGLE_DEVIATION;
                brickVar.dx = -Math.abs(currentSpeed * Math.cos(angle));
            }
			else
			{
                let angle = BASE_ANGLE + (hitPos - 0.5) * 2 * MAX_ANGLE_DEVIATION;
                brickVar.dx = Math.abs(currentSpeed * Math.cos(angle));
            }
            brickVar.dy = -currentSpeed * Math.sin(BASE_ANGLE);
			brickVar.y = brickVar.canvasH - brickVar.paddleHeight - brickVar.ballRadius - 1;
		}
		else
			losePointB();
	}
}

export function losePointB()
{
	brickVar.lives--;
	if(!brickVar.lives)
	{
		brickVar.finish = true;
		brickVar.finishLevel = true;
		saveScoreB();
		brickVar.ctx.clearRect(0, 0, brickVar.canvasW, brickVar.canvasH);
		brickVar.ctx.font = "35px Arial";
		brickVar.ctx.fillStyle = "white";	
		brickVar.ctx.fillText("You lose..." , brickVar.canvasW / 2 - 100, brickVar.canvasH / 6 - 30);
		brickVar.ctx.fillText("Score : " + brickVar.finalScore, brickVar.canvasW / 2 - 100, brickVar.canvasH / 6 + 20);
		addBtnB();
		addImageB('/static/css/images/nooo.png');
	}
	else
		resetBallB();
}

export function manageMoveB()
{
	if (brickVar.leftPressed && brickVar.paddleX > 0)
	{
		brickVar.paddleX -= brickVar.paddleSpeed;
	} 
	else if (brickVar.rightPressed && brickVar.paddleX < brickVar.canvasW - brickVar.paddleWidth)
	{
		brickVar.paddleX += brickVar.paddleSpeed;
	}
}

function saveScoreB()
{
	var levelScore = 0;
	if (brickVar.currLevel === 'classic')
		levelScore = 0;
	if (brickVar.currLevel === 'castle')
		levelScore = 104;
	else if (brickVar.currLevel === 'x')
		levelScore = 104 + 169;
	else if (brickVar.currLevel === 'invader')
		levelScore = 104 + 169 + 169;
	brickVar.finalScore = brickVar.score + levelScore;
	sendScoreB();
}

export function sendScoreB()
{
	console.log("finalScroe : ", brickVar.finalScore);
}
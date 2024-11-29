import brickVar2 from "./var.js";
import { resetBallB } from "./ball.js";
import { addBtnB, addImageB } from "./level.js";

export function manageCollisionB()
{
	if (brickVar2.x + brickVar2.dx > brickVar2.canvasW - brickVar2.ballRadius || brickVar2.x + brickVar2.dx < brickVar2.ballRadius)
		brickVar2.dx = -brickVar2.dx;
	if (brickVar2.y + brickVar2.dy < brickVar2.ballRadius)
		brickVar2.dy = -brickVar2.dy;
	else if(brickVar2.y + brickVar2.dy > brickVar2.canvasH - brickVar2.ballRadius)
	{
		if(brickVar2.x + brickVar2.ballRadius > brickVar2.paddleX &&
			brickVar2.x - brickVar2.ballRadius < brickVar2.paddleX + brickVar2.paddleWidth)
		{
			let hitPos = (brickVar2.x - brickVar2.paddleX) / brickVar2.paddleWidth;
            const BASE_ANGLE = Math.PI / 2;
            let MAX_ANGLE_DEVIATION;
            if (hitPos < 0.15 || hitPos > 0.85)
                MAX_ANGLE_DEVIATION = Math.PI / 2.5;
			else if (hitPos < 0.3 || hitPos > 0.7)
                MAX_ANGLE_DEVIATION = Math.PI / 3;
			else
                MAX_ANGLE_DEVIATION = Math.PI / 4;
            const currentSpeed = brickVar2.powerUpActive ? Math.sqrt(brickVar2.dx * brickVar2.dx + brickVar2.dy * brickVar2.dy) : 5;
            if (hitPos < 0.5)
			{
                let angle = BASE_ANGLE - (0.5 - hitPos) * 2 * MAX_ANGLE_DEVIATION;
                brickVar2.dx = -Math.abs(currentSpeed * Math.cos(angle));
            }
			else
			{
                let angle = BASE_ANGLE + (hitPos - 0.5) * 2 * MAX_ANGLE_DEVIATION;
                brickVar2.dx = Math.abs(currentSpeed * Math.cos(angle));
            }
            brickVar2.dy = -currentSpeed * Math.sin(BASE_ANGLE);
			brickVar2.y = brickVar2.canvasH - brickVar2.paddleHeight - brickVar2.ballRadius - 1;
		}
		else
			loseLives();
	}
}

export function loseLives()
{
	brickVar2.lives--;
	if(!brickVar2.lives)
	{
		brickVar2.finish = true;
		brickVar2.finishLevel = true;
		saveScoreB();
		brickVar2.ctx.clearRect(0, 0, brickVar2.canvasW, brickVar2.canvasH);
		brickVar2.ctx.font = "35px Arial";
		brickVar2.ctx.fillStyle = "white";	
		brickVar2.ctx.fillText("You lose..." , brickVar2.canvasW / 2 - 100, brickVar2.canvasH / 6 - 30);
		brickVar2.ctx.fillText("Score : " + brickVar2.finalScore, brickVar2.canvasW / 2 - 100, brickVar2.canvasH / 6 + 20);
		addBtnB();
		addImageB('/static/css/images/nooo.png');
	}
	else
		resetBallB();
}

export function manageMoveB()
{
	if (brickVar2.leftPressed && brickVar2.paddleX > 0)
	{
		brickVar2.paddleX -= brickVar2.paddleSpeed;
	} 
	else if (brickVar2.rightPressed && brickVar2.paddleX < brickVar2.canvasW - brickVar2.paddleWidth)
	{
		brickVar2.paddleX += brickVar2.paddleSpeed;
	}
}

function saveScoreB()
{
	var levelScore = 0;
	if (brickVar2.currLevel === 'classic')
		levelScore = 0;
	if (brickVar2.currLevel === 'castle')
		levelScore = 104;
	else if (brickVar2.currLevel === 'x')
		levelScore = 104 + 169;
	else if (brickVar2.currLevel === 'invader')
		levelScore = 104 + 169 + 169;
	brickVar2.finalScore = brickVar2.score + levelScore;
	sendScoreB();
}

export function sendScoreB()
{
	console.log("finalScroe : ", brickVar2.finalScore);
}
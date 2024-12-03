import gameVar from "../../pong/var.js";
import brickVar from "../var.js";
import brickVar2 from "./var.js";
import { resetBallB } from "./ball.js";
import { addBtnB } from "./level.js";
import { drawScoreBoardB } from "./draw.js";
import { displayScore } from "../../pong/displayVar.js";

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
            const currentSpeed = brickVar2.powerUpActive ? Math.sqrt(brickVar2.dx * brickVar2.dx + brickVar2.dy * brickVar2.dy) : brickVar2.initDx;
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

function compareScore()
{
	console.log("compare2");
	brickVar.ctx.clearRect(0, 0, brickVar.canvasW, brickVar.canvasH);
	brickVar2.ctx.clearRect(0, 0, brickVar2.canvasW, brickVar2.canvasH);
	displayScore();
	if (brickVar.finalScore < brickVar2.finalScore)
	{
		brickVar2.ctx.font = 'bold 24px fontScore';
		brickVar2.ctx.fillStyle = '#66a5e8';
		brickVar2.ctx.textAlign = 'left';
		brickVar2.ctx.fillText("Congratulations ! You've defeat your opponent...", brickVar2.canvasW/ 4 - 100, (brickVar2.canvasH / 2) - 100);
		brickVar2.ctx.fillText("Your score : ", brickVar2.canvasW / 4, brickVar2.canvasH / 2);
		brickVar2.ctx.fillText(brickVar2.finalScore, brickVar2.canvasW / 4 + 200, brickVar2.canvasH / 2)

		brickVar2.ctx.fillText("Your opponent has score only : ", brickVar2.canvasW / 4, brickVar2.canvasH / 2 + 50);
		brickVar2.ctx.fillText(brickVar.finalScore, brickVar2.canvasW / 4 + 420, brickVar2.canvasH / 2 + 50);

		brickVar.ctx.fillText("Too Bad ! You lose...", brickVar.canvasW / 4 , (brickVar.canvasH / 2) - 100);
		brickVar.ctx.fillText("Your score : ", brickVar.canvasW / 4, brickVar.canvasH / 2);
		brickVar.ctx.fillText(brickVar.finalScore, brickVar.canvasW / 4 + 200, brickVar.canvasH / 2);

		brickVar.ctx.fillText("Your opponent has score : ", brickVar.canvasW / 4, brickVar.canvasH / 2 + 50);
		brickVar.ctx.fillText(brickVar2.finalScore, brickVar.canvasW / 4 + 380, brickVar.canvasH / 2 + 50)
	}
}

export function chechOpponent()
{
	let display = false;
	if (gameVar.localGame)
	{
		const waiting = setInterval(() =>
		{
			if (brickVar.startTime === true)
			{
				if (!display)
				{
					display = true;
					drawScoreBoardB();
					brickVar2.ctx.clearRect(0, 0, brickVar2.canvasW, brickVar2.canvasH);
					brickVar2.ctx.font = 'bold 24px fontScore';
					brickVar2.ctx.fillStyle = '#66a5e8';
					brickVar2.ctx.textAlign = 'left';
					brickVar2.ctx.fillText("Waiting for opponent to finish...", brickVar2.canvasW / 4, brickVar2.canvasH / 2 - 100);
					brickVar2.ctx.fillText("Your final score :" , brickVar2.canvasW / 4, brickVar2.canvasH / 2);
					brickVar2.ctx.fillText(brickVar2.finalScore, brickVar2.canvasW / 4 + 250, (brickVar2.canvasH / 2));
				}
			}
			else
			{
				clearInterval(waiting)
				compareScore();
			}
		}, 1000);
	}
}

export function loseLives()
{
	brickVar2.lives--;
	if(!brickVar2.lives)
	{
		brickVar2.finish = true;
		brickVar2.finishLevel = true;
		brickVar2.startTime = false;
		saveScoreB();
		// brickVar2.ctx.clearRect(0, 0, brickVar2.canvasW, brickVar2.canvasH);
		// brickVar2.ctx.font = "35px Arial";
		// brickVar2.ctx.fillStyle = "white";	
		// brickVar2.ctx.fillText("You lose..." , brickVar2.canvasW / 2 - 100, brickVar2.canvasH / 6 - 30);
		// brickVar2.ctx.fillText("Score : " + brickVar2.finalScore, brickVar2.canvasW / 2 - 100, brickVar2.canvasH / 6 + 20);

		chechOpponent();
		if (!gameVar.localGame)
		{
			addBtnB();
		}
		// addImageB('/static/css/images/nooo.png');
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
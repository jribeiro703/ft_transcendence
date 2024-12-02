import brickVar from "./var.js";
import brickVar2 from "./secondBrickout/var.js";
import { resetBallB } from "./ball.js";
import { addBtnB, addImageB } from "./level.js";
import gameVar from "../var.js";
import { drawScoreBoard } from "../gameView.js";
import { drawScoreBoardB } from "./draw.js";

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
			loseLives();
	}
}

export function chechOpponent()
{
	let display = false;
	if (gameVar.localGame)
	{
		const waiting = setInterval(() =>
		{
			if (brickVar2.startTime === true)
			{
				if (!display)
				{
					display = true;
					brickVar.ctx.clearRect(0, 0, brickVar.canvasW, brickVar.canvasH);
					drawScoreBoardB();
					brickVar.ctx.font = 'bold 24px fontScore';
					brickVar.ctx.fillStyle = '#66a5e8';
					brickVar.ctx.textAlign = 'left';
					brickVar.ctx.fillText("Waiting for opponent to finish...", brickVar.canvasW / 4, brickVar.canvasH / 2 - 100);
					brickVar.ctx.fillText("Your final score :", brickVar.canvasW / 4, (brickVar.canvasH / 2));
					brickVar.ctx.fillText(brickVar.finalScore, brickVar.canvasW / 4 + 250, (brickVar.canvasH / 2));
				}
			}
			else
			{
				clearInterval(waiting);
				compareScore();
			}
		},1000);
	}
}


export function displayScore()
{
	console.log("score p1 : ", brickVar.finalScore);
	console.log("score p2 : ", brickVar2.finalScore);
}
function compareScore()
{

	console.log("compare1");
	brickVar.ctx.clearRect(0, 0, brickVar.canvasW, brickVar.canvasH);
	brickVar2.ctx.clearRect(0, 0, brickVar2.canvasW, brickVar2.canvasH);
	displayScore();
	if (brickVar.finalScore > brickVar2.finalScore)
	{
		brickVar.ctx.font = 'bold 24px fontScore';
		brickVar.ctx.fillStyle = '#66a5e8';
		brickVar.ctx.textAlign = 'left';
		brickVar.ctx.fillText("Congratulations ! You've defeat your opponent...", brickVar.canvasW/ 4 - 100, (brickVar.canvasH / 2) - 100);
		brickVar.ctx.fillText("Your score : ", brickVar.canvasW / 4, brickVar.canvasH / 2);
		brickVar.ctx.fillText(brickVar.finalScore, brickVar.canvasW / 4 + 200, brickVar.canvasH / 2)

		brickVar.ctx.fillText("Your opponent has score only : ", brickVar.canvasW / 4, brickVar.canvasH / 2 + 50);
		brickVar.ctx.fillText(brickVar2.finalScore, brickVar.canvasW / 4 + 420, brickVar.canvasH / 2 + 50);

		brickVar2.ctx.fillText("Too Bad ! You lose...", brickVar.canvasW / 4, (brickVar.canvasH / 2) - 100);
		brickVar2.ctx.fillText("Your score : ", brickVar.canvasW / 4, brickVar.canvasH / 2);
		brickVar2.ctx.fillText(brickVar2.finalScore, brickVar.canvasW / 4 + 200, brickVar.canvasH / 2);

		brickVar2.ctx.fillText("Your opponent has score : ", brickVar2.canvasW / 4, brickVar2.canvasH / 2 + 50);
		brickVar2.ctx.fillText(brickVar.finalScore, brickVar2.canvasW / 4 + 380, brickVar2.canvasH / 2 + 50)

	}
}

export function loseLives()
{
	brickVar.lives--;
	if(!brickVar.lives )
	{
		brickVar.finish = true;
		brickVar.startTime = false;
		brickVar.finishLevel = true;
		saveScoreB();
		chechOpponent();
		addBtnB();
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
	// console.log("finalScroe : ", brickVar.finalScore);
}
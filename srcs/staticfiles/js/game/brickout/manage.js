import brickVar from "./var.js";
import gameVar from "../pong/var.js";
import { resetBallB } from "./ball.js";
import { chechOpponent } from "./score.js"
import { saveScoreB } from "./score.js";
import { displayNextLevel, displayFinish, displayLocalRematch } from "./display.js";
import { listenFinishBtn, listenNextLevelBtn, listenLocalRematchBtn } from "./listenerBtn.js";
import { handleNextLevelB, restartLevelB } from "./level.js";
import { renderPageGame } from "../pong/myHistory.js";

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
            const currentSpeed = brickVar.powerUpActive ? Math.sqrt(brickVar.dx * brickVar.dx + brickVar.dy * brickVar.dy) : brickVar.initDx;
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

export function addBtnB()
{
	if (!gameVar.localGame)
	{
		if (!brickVar.finish)
			displayNextLevel();
		else
			displayFinish();
	}
	else
		displayLocalRematch();
}

export function checkBtnB(status)
{
	if (status === 'nextLevel')
		listenNextLevelBtn();
	else if (status === 'finish')
		listenFinishBtn();
	else if (status === 'localRematch')
		listenLocalRematchBtn();
}

export function clearBtnB()
{
	const nextLevel = document.getElementById("nextLevel");
    try
	{
        const nextLevelBtn = document.getElementById("nextLevelBtn");
		const quitBtn = document.getElementById("quitBtn");
        const restartLevelBtn = document.getElementById("restartLevelBtn");
        if (nextLevelBtn)
            nextLevelBtn.removeEventListener("click", handleNextLevelB);
    	if (restartLevelBtn)
            restartLevelBtn.removeEventListener("click", restartLevelB);
		if (quitBtn)
			quitBtn.addEventListener('click', () => renderPageGame("home"), true);
        nextLevel.parentNode.remove();
    }
	catch (error)
	{
        console.error("Error removing buttons:", error);
    }
}
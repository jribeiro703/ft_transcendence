import gameVar from "../../pong/var.js";
import brickVar2 from "./var.js";
import { resetBallB } from "./ball.js";
import { saveScoreB } from "./score.js";
import { handleNextLevelB, restartLevelB } from "./level.js";
import { displayFinish, displayNextLevel } from "./display.js";
import { listenFinishBtn, listenNextLevelBtn} from "./listenBtn.js";
import { chechOpponent } from "./score.js";

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

export function loseLives()
{
	brickVar2.lives--;
	if(!brickVar2.lives)
	{
		brickVar2.finish = true;
		brickVar2.finishLevel = true;
		brickVar2.startTime = false;
		saveScoreB();
		chechOpponent();
		if (!gameVar.localGame)
			addBtnB();
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

export function addBtnB()
{
	if (!gameVar.localGame)
	{
		if (!brickVar2.finish)
			displayNextLevel();
		else
			displayFinish();
	}
	else
	{
		console.log("else...");
	}
}

export function checkBtnB(status)
{
	if (status === 'nextLevel')
	{
		listenNextLevelBtn();
	}
	else if (status === 'finish')
	{
		listenFinishBtn();
	}
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
			quitBtn.addEventListener('click', () => renderPageGame("home", true));
        nextLevel.parentNode.remove();
    }
	catch (error)
	{
        console.error("Error removing buttons:", error);
    }
}
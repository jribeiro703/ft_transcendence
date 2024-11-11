import gameVar from "./var.js";
import { BALL_RADIUS } from "./const.js";
import { WIN_SCORE, GAP_SCORE,  } from "./const.js";
import { draw, initDraw, initializeBall } from "./draw.js";
import { aiServeBall, manageAi } from "./ai.js";
import { createPowerUp } from "./powerUp.js";
import { sendBallData } from "./network.js";
import { checkball } from "./manage.js";

export function resetGame()
{
	console.log("resetGame");
	resetMatch();
}

export function resetMatch()
{
	console.log("resetMatch");
	gameVar.playerScore = 0;
	gameVar.aiScore = 0;
	gameVar.matchOver = false;
	gameVar.serveCount = 0;
	document.getElementById("playerScore").innerText = gameVar.playerScore;
	document.getElementById("aiScore").innerText = gameVar.aiScore;
	gameVar.playerScoreElement.textContent = gameVar.playerScore;
	gameVar.aiScoreElement.textContent = gameVar.aiScore;
	console.log("player : ", gameVar.playerScore);
	console.log("ai: ", gameVar.aiScore);
	gameVar.gameStart = false;
	if (gameVar.animationFrame)
	{
		cancelAnimationFrame(gameVar.animationFrame);
		gameVar.animationFrame = null;
	}
	if (gameVar.aiMoveInterval)
	{
		clearInterval(gameVar.aiMoveInterval);
		gameVar.aiMoveInterval = null;
	}
}

export function checkServer()
{
	if (gameVar.scoreBoard.length % 2 == 0)
	{
		gameVar.currenServer = 'player';
		gameVar.aiServe = false;
		resetBall('player');
	}
	else
	{
		gameVar.currenServer = 'ai';
		gameVar.aiServe = true;
		resetBall('ai');
	}
}

export function checkScore()
{
	console.log("check score");
	if ((gameVar.playerScore >= WIN_SCORE || gameVar.aiScore >= WIN_SCORE) && Math.abs(gameVar.playerScore - gameVar.aiScore) >= GAP_SCORE)
	{
		gameVar.matchOver = true;
		gameVar.rematchBtn.disabled = false;
		gameVar.rematchBtn.style.cursor = false ? "pointer" : "not-allowed";
		cancelAnimationFrame(gameVar.animationFrame);
	}	
}

export function resetBall(winner)
{
	console.log("resetBall win: ", winner);
	if (gameVar.matchOver)
		return;
	if (winner == 'player')
		gameVar.playerScore++;
	else
		gameVar.aiScore++;
	checkScore();
	gameVar.serveCount++;
	if (gameVar.serveCount >= 2)
	{
		gameVar.serveCount = 0;
		if (!gameVar.liveMatch)
			gameVar.currenServer = (gameVar.currenServer == 'player') ? 'ai' : 'player';
		else if (gameVar.liveMatch)
			gameVar.currenServer = (gameVar.currenServer == 'player') ? 'player2' : 'player';
	}
	initializeBall();
	gameVar.dx = 0;
	gameVar.dy = 0;
	checkball();
	gameVar.gameStart = false;
	gameVar.aiScoreElement.textContent = gameVar.aiScore;
	gameVar.playerScoreElement.textContent = gameVar.playerScore;
	if (gameVar.currenServer == 'ai')
	{
		gameVar.aiServe = true;
		aiServeBall();
	}
}

// export function updateBallPosition()
// {
//     gameVar.x += gameVar.dx;
//     gameVar.y += gameVar.dy;

//     if (gameVar.x + BALL_RADIUS > canvas.width || gameVar.x - BALL_RADIUS < 0)
//         gameVar.dx = -gameVar.dx;
//     if (gameVar.y - BALL_RADIUS < 0)
//         gameVar.dy = -gameVar.dy;
//     checkCollisionWithPaddle();
//     if (gameVar.y + BALL_RADIUS > canvas.height)
//         resetBall('ai');
// }

// export function checkCollisionWithPaddle()
// {
//     if (gameVar.y + BALL_RADIUS > gameVar.playerPaddleY &&
//         gameVar.x > gameVar.playerPaddleX &&
//         gameVar.x < gameVar.playerPaddleX + gameVar.playerPaddleWidth) 
// 	{
//         gameVar.y = gameVar.playerPaddleY - BALL_RADIUS;
//         gameVar.dy = -gameVar.dy;
//     }

//     if (gameVar.y - BALL_RADIUS < gameVar.aiPaddleY + gameVar.aiPaddleHeight &&
//         gameVar.x > gameVar.aiPaddleX &&
//         gameVar.x < gameVar.aiPaddleX + gameVar.aiPaddleWidth)
// 	{
//         gameVar.y = gameVar.aiPaddleY + gameVar.aiPaddleHeight + BALL_RADIUS;
//         gameVar.dy = -gameVar.dy;
//     }
// }
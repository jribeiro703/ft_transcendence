import gameVar from "./var.js";
import { BALL_RADIUS } from "./const.js";
import { WIN_SCORE, GAP_SCORE,  } from "./const.js";
import { draw, initializeBall } from "./draw.js";
import { aiServeBall } from "./ai.js";

export function resetGame()
{
	// cancelAnimationFrame(gameVar.animationFrame);
	resetMatch();
	// gameVar.defaultView.style.display = 'block';
	// gameVar.gameView.style.display = 'none';
	// gameVar.startGameBtn.style.display = 'none';
	clearInterval(gameVar.aiMoveInterval);
}

export function resetMatch()
{
	gameVar.playerScore = 0;
	gameVar.aiScore = 0;
	gameVar.matchOver = false;
	gameVar.currenServer = 'player';
	gameVar.serveCount = 0;
	gameVar.playerScoreElement.textContent = gameVar.playerScore;
	gameVar.aiScoreElement.textContent = gameVar.aiScore;
	gameVar.gameStart = false;
	gameVar.aiServe= false;
	
	// initializeBall();
	// draw();
}

export function checkScore()
{
	if ((gameVar.playerScore >= WIN_SCORE || gameVar.aiScore == WIN_SCORE) && Math.abs(gameVar.playerScore - gameVar.aiScore) >= GAP_SCORE)
	{
		gameVar.matchOver = true;
		cancelAnimationFrame(gameVar.animationFrame);
		gameVar.rematchBtn.disabled = false;
		gameVar.rematchBtn.style.cursor = false ? "pointer" : "not-aalowed";
	
	}	
}

export function resetBall(winner)
{
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
		gameVar.currenServer = (gameVar.currenServer == 'player') ? 'ai' : 'player';
	}
	initializeBall();
	gameVar.dx = 0;
	gameVar.dy = 0;
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
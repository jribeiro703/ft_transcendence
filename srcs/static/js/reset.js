import gameVar from "./var.js";
import { WIN_SCORE, GAP_SCORE,  } from "./const.js";
import { initializeBall } from "./draw.js";
import { aiServeBall } from "./ai.js";

export function resetGame()
{
	cancelAnimationFrame(gameVar.animationFrame);
	resetMatch();
	gameVar.defaultView.style.display = 'block';
	gameVar.gameView.style.display = 'none';
	clearInterval(gameVar.aiMoveInterval);
}

export function resetMatch()
{
	gameVar.playerScore = 0;
	gameVar.aiScore = 0;
	gameVar.matchOver = false;
	gameVar.currenServer = 'player';
	gameVar.serveCount = 0;
	gameVar.playerScoreElement.textContent = playerScore;
	gameVar.aiScoreElement.textContent = aiScore;
	gameVar.gameStart = false;
	initializeBall();
}

export function checkScore()
{
	if ((gameVar.playerScore >= WIN_SCORE || gameVar.aiScore == WIN_SCORE) && Math.abs(gameVar.playerScore - gameVar.aiScore) >= GAP_SCORE)
	{
		gameVar.matchOver = true;
		alert((gameVar.playerScore > gameVar.aiScore ? 'Fantastique ! Tu as gagne' : 'Dommage... L IA a gagne'));
		alert('Merci d\'avoir joué ! À la prochaine fois !');
		resetGame();
	}	
}

export function resetBall(winner)
{
	if (gameVar.matchOver)
		return;
	if (winner == 'player')
	{
		gameVar.playerScore++;
	}
	else
	{
		gameVar.aiScore++;
	}
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

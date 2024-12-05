import gameVar from "./var.js";
import { initializeBall } from "./ball.js";
import { aiServeBall } from "./ai.js";
import { checkball } from "./check.js";
import { sendGameData } from "./network.js";
import { startGame } from "./start.js";
import { checkScore } from "./score.js";

export function listenBtn()
{
	gameVar.rematchBtn.addEventListener('click', () =>
	{
		resetMatch();
		startGame();
	});

	gameVar.quitGameBtn.addEventListener('click', () => document.location.reload());
}

export function resetMatch()
{
	gameVar.playerScore = 0;
	gameVar.aiScore = 0;
	gameVar.matchOver = false;
	gameVar.serveCount = 0;
	gameVar.gameStart = false;
	gameVar.currentServer = 'player';
	gameVar.aiPaddleY = (420 - 75) / 2;
	gameVar.targetY = (420 - 75) / 2;
	gameVar.gameTime = 0;
	gameVar.finishGame = false;
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
		if (!gameVar.liveMatch && !gameVar.localGame)
			gameVar.currentServer = (gameVar.currentServer == 'player') ? 'ai' : 'player';
		else
		{
			console.log("in if curr server before: ", gameVar.currentServer);
			gameVar.currentServer = (gameVar.currentServer == 'player') ? 'player2' : 'player';
			console.log("in if curr server after: ", gameVar.currentServer);
			if (gameVar.liveMatch)
				sendGameData(gameVar.gameSocket, gameVar.gameStart, gameVar.currentServer, gameVar.startTime);
		}
	}
	initializeBall();
	gameVar.dx = 0;
	gameVar.dy = 0;
	if (gameVar.liveMatch)
		checkball();
	gameVar.gameStart = false;
	if (gameVar.liveMatch)
		sendGameData(gameVar.gameSocket, gameVar.gameStart, gameVar.currentServer, gameVar.startTime);
	console.log("server current in reset: ", gameVar.currentServer);
	if (gameVar.currentServer == 'ai')
	{
		gameVar.aiServe = true;
		aiServeBall();
	}
}
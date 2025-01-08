import gameVar from "./var.js";
import { initializeBall } from "./ball.js";
import { aiServeBall } from "./ai.js";
import { checkball } from "./check.js";
import { sendGameData, sendScoreInfo } from "./network.js";
import { checkScore } from "./score.js";
import { updateDifficultySelection, updateLevelSelection } from "./update.js";
import { resetPu, updatePowerUpSelection } from "./powerUp.js";
import { renderPageGame } from "../HistoryManager.js";
import { initPaddlesPos } from "./init.js";

export function listenBtn()
{
	if (!gameVar.liveMatch)
	{
		gameVar.rematchBtn.addEventListener('click', () =>
		{
			resetMatch();
			clearBtn();
			renderPageGame('playPong', true);
		});
	}
	else
	{
		gameVar.returnLobby.addEventListener('click', () =>
		{
			resetLiveMatch();
			clearBtn();
			renderPageGame('pongLobby', true);
		});
	}

	gameVar.quitGameBtn.addEventListener('click', () => 
	{
		clearAllpongStates();
		resetMatch();
		clearBtn();
		renderPageGame('home', true);
	});
}

export function clearBtn()
{
	gameVar.quitGameBtn.style.display = 'none';
	if (gameVar.rematchBtn)
		gameVar.rematchBtn.style.display = 'none';
	if (gameVar.returnLobby)
		gameVar.returnLobby.style.display = 'none';
}

export function resetLiveMatch()
{
	resetTimeFrame();
	initPaddlesPos();
	updateDifficultySelection('medium', true);
	updateLevelSelection('classicPong', true);
	updatePowerUpSelection(false, true);
	gameVar.startTime = false;
	gameVar.gameTime = 0;
	gameVar.gameStart = false;
	gameVar.playerScore = 0;
	gameVar.aiScore = 0;
	gameVar.matchOver = false;
	gameVar.serveCount = 0;
	gameVar.finishGame = false;
	gameVar.clientLeft = false;
	gameVar.playerReady = false;
	gameVar.currentServer = 'player';
}

export function clearAllpongStates()
{
	resetTimeFrame();
	resetPu();
	initPaddlesPos();
	updateDifficultySelection('medium', true);
	updateLevelSelection('classicPong', true);
	updatePowerUpSelection(false, true);
	gameVar.startTime = false;
	gameVar.gameTime = 0;
	gameVar.gameStart = false;
	gameVar.playerScore = 0;
	gameVar.aiScore = 0;
	gameVar.matchOver = false;
	gameVar.serveCount = 0;
	gameVar.finishGame = false;
	gameVar.clientLeft = false;
	gameVar.playerReady = false;
	gameVar.liveMatch = false;
	gameVar.localGame = false;
	gameVar.tournament = false;
	gameVar.currentServer = 'player';
}

export function resetMatch()
{
	gameVar.playerScore = 0;
	gameVar.aiScore = 0;
	gameVar.matchOver = false;
	gameVar.serveCount = 0;
	gameVar.gameStart = false;
	gameVar.currentServer = 'player';
	gameVar.targetY = 0;
	gameVar.finishGame = false;
	gameVar.aiServe = false; 
	gameVar.matchOver = false;
	resetPu();
	initPaddlesPos();
	resetTimeFrame();
}

function resetTimeFrame()
{
	gameVar.gameTime = 0;
	gameVar.startTime = false;
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
	if(gameVar.gameTimer)
	{
		clearInterval(gameVar.gameTimer);
		gameVar.gameTimer = null;
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
	if (gameVar.liveMatch)
		sendScoreInfo(gameVar.gameSocket, gameVar.playerIdx, gameVar.userName, gameVar.playerScore, gameVar.aiScore);
	checkScore();
	gameVar.serveCount++;
	if (gameVar.serveCount >= 2)
	{
		gameVar.serveCount = 0;
		if (!gameVar.liveMatch && !gameVar.localGame)
			gameVar.currentServer = (gameVar.currentServer == 'player') ? 'ai' : 'player';
		else
		{
			gameVar.currentServer = (gameVar.currentServer == 'player') ? 'player2' : 'player';
			if (gameVar.liveMatch)
				sendGameData(gameVar.gameSocket, gameVar.gameStart, gameVar.currentServer, gameVar.startTime, gameVar.clientLeft);
		}
	}
	initializeBall();
	gameVar.dx = 0;
	gameVar.dy = 0;
	if (gameVar.liveMatch)
		checkball();
	gameVar.gameStart = false;
	if (gameVar.liveMatch)
		sendGameData(gameVar.gameSocket, gameVar.gameStart, gameVar.currentServer, gameVar.startTime, gameVar.clientLeft);
	if (gameVar.currentServer == 'ai')
	{
		gameVar.aiServe = true;
		aiServeBall();
	}
}

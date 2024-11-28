import gameVar from "./var.js";
import { WIN_SCORE, GAP_SCORE,  } from "./const.js";
import { initializeBall } from "./draw.js";
import { aiServeBall } from "./ai.js";
import { checkball } from "./check.js";
import { sendGameData } from "./network.js";
import { startGame } from "./start.js";

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
	console.log("resetMatch");
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

export function checkServer()
{
	if (gameVar.scoreBoard.length % 2 == 0)
	{
		gameVar.currentServer = 'player';
		gameVar.aiServe = false;
		resetBall('player');
	}
	else
	{
		gameVar.currentServer = 'ai';
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
		gameVar.startTime = false;
		gameVar.rematchBtn.style.display = 'block';
		gameVar.quitGameBtn.style.display = 'block';
		gameVar.rematchBtn.disabled = false;
		gameVar.rematchBtn.style.cursor = false ? "pointer" : "not-allowed";
		cancelAnimationFrame(gameVar.animationFrame);
		sendScore();
		listenBtn();
	}	
}

export function sendScore()
{
	console.log("we send =>");
	console.log("name player1"); // string
	console.log("name player2"); // string
	console.log("score player : ", gameVar.playerScore); // int
	console.log("score opponent : ", gameVar.aiScore); // int 
	console.log("game time : ", gameVar.gameTime); // int
	console.log("Difficulty : ",gameVar.difficulty); // string = 'easy' || 'medium' || 'hard'
	console.log("PowerUp active : ", gameVar.powerUpEnable); // boolean
	console.log("Level : ", gameVar.currentLevel);  // string = 'tableTennis' || 'Football' || 'tennis' ( maybe an other : 'classic')
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
		if (!gameVar.liveMatch)
			gameVar.currentServer = (gameVar.currentServer == 'player') ? 'ai' : 'player';
		else if (gameVar.liveMatch)
		{
			gameVar.currentServer = (gameVar.currentServer == 'player') ? 'player2' : 'player';
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
	console.log("server: ", gameVar.currentServer);
	if (gameVar.currentServer == 'ai')
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
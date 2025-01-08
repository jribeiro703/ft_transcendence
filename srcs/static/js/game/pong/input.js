import gameVar from "./var.js";
import { sendDirectionData, sendGameData } from "./network.js";
import { updateDifficultySelection } from "./update.js";

export function keyDownHandler(e, local)
{
	if (!local)
	{
		if (e.code === "ArrowUp" || e.code === 'KeyW')
		{
			gameVar.playerUpPressed = true;
		} 
		else if (e.code === "ArrowDown" || e.code === 'KeyS')
		{
			gameVar.playerDownPressed = true;
		}
	}
	else
	{
		if (e.code === 'KeyW')
		{
			gameVar.playerUpPressed = true;
		}
		else if (e.code === 'KeyS')
		{
			gameVar.playerDownPressed = true;
		}
		if (e.code === "ArrowUp")
		{
			gameVar.player2UpPressed = true;
		} 
		else if (e.code === "ArrowDown")
		{
			gameVar.player2DownPressed = true;
		}
	}
}

export function keyUpHandler(e, local)
{
	if (!local)
	{
		if (e.code === "ArrowUp" || e.code === 'KeyW')
		{
			gameVar.playerUpPressed = false;
		}
		else if (e.code === "ArrowDown" || e.code === 'KeyS')
		{
			gameVar.playerDownPressed = false;
		}
	}
	else
	{
		if (e.code === "KeyW")
		{
			gameVar.playerUpPressed = false;
		}
		else if (e.code === "KeyS")
		{
			gameVar.playerDownPressed = false;
		}
		if (e.code === "ArrowUp")
		{
			gameVar.player2UpPressed = false;
		}
		else if (e.code === "ArrowDown")
		{
			gameVar.player2DownPressed = false;
		}
	}
}

export function startBall(e)
{
	if (e.code == "Space" && !gameVar.matchOver && !gameVar.aiServe && !gameVar.gameStart && gameVar.currentServer == 'player'
		|| e.code == "Enter" && !gameVar.matchOver && !gameVar.aiServe && !gameVar.gameStart && gameVar.currentServer == 'player2')
	{

		if (!gameVar.finishGame)
		{
			if (!gameVar.init_dx || !gameVar.init_dy)
			{
				console.log("init est nul, diff :", gameVar.difficulty);
				updateDifficultySelection(gameVar.difficulty, true);
			}
			gameVar.startTime = true;
			gameVar.gameStart = true;
			gameVar.dx = gameVar.init_dx;
			gameVar.dy = (Math.random() < 0.5 ? gameVar.init_dy : -gameVar.init_dy);
		}
		else
		{
			console.log("Level finished - ignoring space");
            e.preventDefault();
            e.stopPropagation();
		}
	}
}

export function startBallLive(e)
{
	if ((gameVar.playerIdx == 1 && gameVar.currentServer == 'player') || (gameVar.playerIdx == 2 && gameVar.currentServer == 'player2'))
	{
		if (e.code == "Space" && !gameVar.matchOver && !gameVar.gameStart)
		{
			if (!gameVar.init_dx || !gameVar.init_dy)
			{
				console.log("init est nul diff ", gameVar.difficulty);
				updateDifficultySelection(gameVar.difficulty, true);
			}
            gameVar.gameStart = true;
			gameVar.startTime = true;
			gameVar.dx = gameVar.init_dx;
            gameVar.dy = (Math.random() < 0.5 ? gameVar.init_dy : -gameVar.init_dy);
            sendDirectionData(gameVar.dx, gameVar.dy, gameVar.init_dx, gameVar.init_dy, gameVar.gameSocket);
            sendGameData(gameVar.gameSocket, gameVar.gameStart, gameVar.currentServer, gameVar.startTime, gameVar.clientLeft);
		}
	}
}

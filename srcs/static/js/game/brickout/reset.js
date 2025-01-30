import { initPaddlesPosB } from "./init.js";
import { clearAllBrickStates } from "./manage.js";
import brickVar from "./var.js";

export function resetPuB()
{
	brickVar.powerUpX = null;
	brickVar.powerUpY = null;
	brickVar.powerUpActive = false;
	brickVar.powerUpOnscreen = false;
	brickVar.currentPowerUp = null;
	brickVar.paddleWidth = 75;
}

export function resetMatchB()
{
	brickVar.initGame = false;
	brickVar.finish = false;
	brickVar.finishLevel = false;
	brickVar.gameReady = false;
	brickVar.initialize = false;
	brickVar.score = 0;
	brickVar.opponentScore = 0;
	brickVar.playerScore = 0;
	brickVar.opponentLives = 5;
	brickVar.playerLives = 5;
	brickVar.lives = 5;
	brickVar.gameStart = false;
	brickVar.gameTime = 0;
	brickVar.startTime = false;
	brickVar.loose = false;
	brickVar.initialize = false;
	brickVar.loose = false
	brickVar.win = false;
	resetPuB();
	initPaddlesPosB();
	if (brickVar.anim)
	{
		cancelAnimationFrame(brickVar.anim);
		brickVar.anim = null;
	}
	if(brickVar.gameTimer)
	{
		clearInterval(brickVar.gameTimer);
		brickVar.gameTimer = null;
	}
}
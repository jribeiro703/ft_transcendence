import gameVar from "./var.js";
import brickVar from "./brickout/var.js";
import { drawScoreBoard } from "./gameView.js";
import { initializeBall } from "./draw.js";
import { newPowerUp } from "./powerUp.js";
import { draw } from "./draw.js";
import { manageAi } from "./ai.js";
import { displayBallB, initBallB } from "./brickout/ball.js";
import { checkLevelB } from "./brickout/level.js";
import { createPowerUpB } from "./brickout/powerUp.js";
import { drawB } from "./brickout/game.js";


export function startGame()
{
	drawScoreBoard();
	initializeBall();
	if (gameVar.powerUpEnable)
	{
		newPowerUp(true, 1000);
		newPowerUp(false, 1000);
	}
	draw();
	if (!gameVar.localGame)
		manageAi();
}


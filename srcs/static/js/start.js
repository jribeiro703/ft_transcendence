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
		newPowerUp(true, 3000);
		newPowerUp(false, 3000);
	}
	draw();
	if (!gameVar.localGame)
	manageAi();
}

export function startGameB(level)
{
	displayBallB();
	console.log("pu enable :", brickVar.powerUpEnable);
	if (!brickVar.initGame)
	{
		initBallB();
		checkLevelB(level);
		if (brickVar.powerUpEnable)
			createPowerUpB();
		drawB();
		brickVar.initGame = true;
	}
}
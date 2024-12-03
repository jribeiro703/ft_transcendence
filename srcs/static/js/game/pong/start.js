import gameVar from "./var.js";
import { initializeBall } from "./draw.js";
import { newPowerUp } from "./powerUp.js";
import { draw } from "./draw.js";
import { manageAi } from "./ai.js";
import { drawScoreBoard } from "./draw.js";


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


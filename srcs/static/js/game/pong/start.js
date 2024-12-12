import gameVar from "./var.js";
import { initializeBall } from "./ball.js";
import { newPowerUp } from "./powerUp.js";
import { draw } from "./draw.js";
import { manageAi } from "./ai.js";
import { drawScoreBoard } from "./score.js";
import { updateCanvasColor } from "./update.js";
import { drawLive } from "./draw.js";
import { sendScoreInfo } from "./network.js";
import { displayScoreInfo } from "./displayVar.js";

export function startLiveGame()
{
	initializeBall();
	updateCanvasColor();
	drawLive();
}
export function startGame()
{
	// getUserInfos();
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

export function preventNavTouch()
{
	document.addEventListener('keydown', function(e)
	{
		const keysToPrevent =
		[
			'ArrowUp',
			'ArrowDown',
			'ArrowLeft',
			'ArrowRight',
			' ' // Espace
		];
		
		if (keysToPrevent.includes(e.key))
		{
			e.preventDefault();
		}
	}, false);
}
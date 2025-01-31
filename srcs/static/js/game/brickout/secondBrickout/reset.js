import brickVar2 from "./var.js";

export function resetPuB()
{
	brickVar2.powerUpX = null;
	brickVar2.powerUpY = null;
	brickVar2.powerUpActive = false;
	brickVar2.powerUpOnscreen = false;
	brickVar2.currentPowerUp = null;
	brickVar2.paddleWidth = 75;
}
export function resetMatchB()
{
	brickVar2.initGame = false;
	brickVar2.finish = false;
	brickVar2.finishLevel = false;
	brickVar2.gameReady = false;
	brickVar2.initialize = false;
	brickVar2.score = 0;
	brickVar2.lives = 5;
	brickVar2.gameStart = false;
	brickVar2.gameTime = 0;
	brickVar2.startTime = false;
	resetPuB();
	if (brickVar2.anim)
	{
		cancelAnimationFrame(brickVar2.anim);
		brickVar2.anim = null;
	}
	if(brickVar2.gameTimer)
	{
		clearInterval(brickVar2.gameTimer);
		brickVar2.gameTimer = null;
	}
}
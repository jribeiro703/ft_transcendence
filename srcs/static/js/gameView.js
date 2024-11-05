import gameVar from "./var.js";
import { initializeBall } from "./draw.js";
import { aiMovement } from "./ai.js";
import { createPowerUp } from "./powerUp.js";
import { draw } from "./draw.js";


export function showGameplayView()
{
	gameplayView.style.display = 'block';
	defaultView.style.display = 'none';
	startGameBtn.style.display = 'block';
}

export function showGameView()
{
	gameplayView.style.display = 'none';
	gameView.style.display = 'block';
	startGameBtn.style.display = 'none';
	initializeBall();
	if (gameVar.powerUpEnable)
		createPowerUp();
	aiMovement();
	
	draw();
}
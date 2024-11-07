import gameVar from "./var.js";
import { showGameView, showGameplayView, showDefaultView, rematchView } from "./gameView.js";
import { keyDownHandler, keyUpHandler, startBall } from "./input.js";
import { updatePowerUpSelection } from "./powerUp.js";
import { updateLevelSelection, updateMapSelection } from "./gameMode.js";

export function initGameVar()
{
	gameVar.defaultView = document.getElementById('defaultView');
	gameVar.gameplayView = document.getElementById('gameplayView');
	gameVar.gameView = document.getElementById('gameView');
	gameVar.startGameBtn = document.getElementById('startGameBtn');
	gameVar.quickGameBtn = document.getElementById('quickGameBtn');
	gameVar.playGameBtn = document.getElementById('playGameBtn');
	gameVar.tournamentGameBtn = document.getElementById('tournamentGameBtn');
	gameVar.rematchBtn = document.getElementById('rematchBtn');	
	gameVar.quitGameBtn = document.getElementById('quitGameBtn');
	
	gameVar.withPowerUp = document.getElementById('withPowerUps');
	gameVar.withoutPowerUp = document.getElementById('withoutPowerUps');
	gameVar.easy = document.getElementById('easy');
	gameVar.medium = document.getElementById('medium');
	gameVar.hard = document.getElementById('hard');
	gameVar.tableTennis = document.getElementById('tableTennis');
	gameVar.brickLevel = document.getElementById('bricksLevel');

	gameVar.playerScoreElement = document.getElementById('playerScore');
	gameVar.aiScoreElement = document.getElementById('aiScore');

	gameVar.playGameBtn.addEventListener('click', showGameplayView);
	gameVar.quickGameBtn.addEventListener('click', showGameView);
	gameVar.quitGameBtn.addEventListener('click', showDefaultView);
	gameVar.rematchBtn.addEventListener('click', rematchView);
}


export function initEventListener()
{
	document.addEventListener("keydown", keyDownHandler, false);
	document.addEventListener("keyup", keyUpHandler, false);
	document.addEventListener("keydown", startBall, false);
	gameVar.withoutPowerUp.classList.add('selected');
	gameVar.medium.classList.add('selected');
	gameVar.tableTennis.classList.add('selected');

	gameVar.withPowerUp.addEventListener('click', () =>
	{
		gameVar.withPowerUp.classList.add('selected');
		gameVar.withoutPowerUp.classList.remove('selected');
		updatePowerUpSelection(true);
	});

	gameVar.withoutPowerUp.addEventListener('click', () => 
	{
		gameVar.withoutPowerUp.classList.add('selected');
		gameVar.withPowerUp.classList.remove('selected');
		updatePowerUpSelection(false); 
	});

	gameVar.easy.addEventListener('click', () => 
	{
		gameVar.easy.classList.add('selected');
		gameVar.medium.classList.remove('selected');
		gameVar.hard.classList.remove('selected');
		updateLevelSelection('easy');
	});
	
	gameVar.medium.addEventListener('click', () => 
	{
		gameVar.easy.classList.remove('selected');
		gameVar.medium.classList.add('selected');
		gameVar.hard.classList.remove('selected');
		updateLevelSelection('medium');
	});

	gameVar.hard.addEventListener('click', () => 
	{
		gameVar.easy.classList.remove('selected');
		gameVar.medium.classList.remove('selected');
		gameVar.hard.classList.add('selected');
		updateLevelSelection('hard');
	});

	gameVar.tableTennis.addEventListener('click', () =>
	{
		gameVar.tableTennis.classList.add('selected');
		gameVar.brickLevel.classList.remove('selected');
		updateMapSelection('tableTennis');
	});

	gameVar.brickLevel.addEventListener('click', () =>
	{
		gameVar.tableTennis.classList.remove('selected');
		gameVar.brickLevel.classList.add('selected');
		updateMapSelection('brickLevel');
	})
}
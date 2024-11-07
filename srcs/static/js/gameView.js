import gameVar from "./var.js";
import { initializeBall } from "./draw.js";
import { createPowerUp } from "./powerUp.js";
import { draw } from "./draw.js";
import { resetGame } from "./reset.js";


export function showDefaultView()
{
	gameView.style.display = 'none';
	rematchBtn.style.display = 'none';
	quitGameBtn.style.display = 'none';
	defaultView.style.display = 'block';
	playGameBtn.style.display = 'block';
}
export function showGameplayView()
{
	defaultView.style.display = 'none';
	playGameBtn.style.display = 'none';

	gameplayView.style.display = 'block';
	quickGameBtn.style.display = 'block';
	startGameBtn.style.display = 'block';
	tournamentGameBtn.style.display = 'block'
}

export function showGameView()
{
	gameplayView.style.display = 'none';
	quickGameBtn.style.display = 'none';
	startGameBtn.style.display = 'none';
	tournamentGameBtn.style.display = 'none'

	gameView.style.display = 'block';
	rematchBtn.style.display = 'block';
	quitGameBtn.style.display = 'block';	
	// resetMatch();
	initializeBall();
	if (gameVar.powerUpEnable)
		createPowerUp();
	draw();
}


export function rematchView()
{
	gameplayView.style.display = 'none';
	quickGameBtn.style.display = 'none';
	startGameBtn.style.display = 'none';
	tournamentGameBtn.style.display = 'none'

	gameView.style.display = 'block';
	rematchBtn.style.display = 'block';
	rematchBtn.disabled = true;
	quitGameBtn.style.display = 'block';	
	saveScore();
	resetGame();
	// showGameView();
	initializeBall();
	if (gameVar.powerUpEnable)
		createPowerUp();
	draw();

}

export function saveScore()
{
	const scoreEntry = {
		playerScore: gameVar.playerScore,
		aiscore: gameVar.aiScore
	}
	gameVar.scoreBoard.push(scoreEntry);
}
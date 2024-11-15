import gameVar from "./var.js";
import { initializeBall } from "./draw.js";
import { createPowerUp } from "./powerUp.js";
import { draw } from "./draw.js";
import { resetMatch, checkServer } from "./reset.js";
import { initEventListenerAi, manageAi } from "./ai.js";
import { initEventListenerRoom } from "./init.js";


export function showGameplayMultiView()
{
	defaultView.style.display = 'none';
	playsoloGameBtn.style.display = 'none';

	gameplayView.style.display = 'block';
	quickGameBtn.style.display = 'none';
	startGameBtn.style.display = 'block';
	tournamentGameBtn.style.display = 'block'

	initEventListenerRoom();
}

export function showDefaultView()
{
	gameView.style.display = 'none';
	rematchBtn.style.display = 'none';
	quitGameBtn.style.display = 'none';
	defaultView.style.display = 'block';
	playsoloGameBtn.style.display = 'block';
	playmultiGameBtn.style.display = 'block';
}
export function showGameplaySoloView()
{
	defaultView.style.display = 'none';
	playmultiGameBtn.style.display = 'none';

	gameplayView.style.display = 'block';
	quickGameBtn.style.display = 'block';
	startGameBtn.style.display = 'none';
	tournamentGameBtn.style.display = 'block'
	initEventListenerAi();	

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
	initializeBall();
	if (gameVar.powerUpEnable)
		createPowerUp();
	draw();
	manageAi();
}

export function startGameVieW()
{
	gameplayView.style.display = 'none';
	quickGameBtn.style.display = 'none';
	startGameBtn.style.display = 'none';
	tournamentGameBtn.style.display = 'none';

	gameView.style.display = 'block';

}

export function rematchView()
{
	console.log("rematch");
	gameplayView.style.display = 'none';
	quickGameBtn.style.display = 'none';
	startGameBtn.style.display = 'none';
	tournamentGameBtn.style.display = 'none'

	gameView.style.display = 'block';
	rematchBtn.style.display = 'block';
	rematchBtn.disabled = true;
	quitGameBtn.style.display = 'block';	
	saveScore();
	resetMatch();
	initializeBall();
	if (gameVar.powerUpEnable)
		createPowerUp();
	checkServer();
	manageAi();
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
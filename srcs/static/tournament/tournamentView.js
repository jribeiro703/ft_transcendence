import gameVar from '../js/var.js';
import { initGameVar, initEventListener } from '../js/init.js';
import { showDefaultView } from "../js/gameView.js";

export function showTournamentView()
{
	defaultView.style.display = 'none';
	playGameBtn.style.display = 'none';

	gameplayView.style.display = 'none';
	quickGameBtn.style.display = 'none';
	startGameBtn.style.display = 'none';
	tournamentGameBtn.style.display = 'none'

	gameView.style.display = 'none';
	rematchBtn.style.display = 'none';
	quitGameBtn.style.display = 'none';

	tournamentView.style.display = 'block';
	startTournamentBtn.style.display = 'block';
	quitTournamentBtn.style.display = 'block';
}

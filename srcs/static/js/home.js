import { alertUserToLogin, isAuthenticated } from "./utils.js"
import { showTournamentView } from "../tournament/tournamentPage.js"


function createHomeContent() {
	const box = document.getElementById('mainContent');
	box.innerHTML = `
		<div id="defaultView">
			<div class="container">
				<div class="mx-auto">
					<img class="img-fluid" src="${staticImageURL}" alt="Pong Game">
					<br><br><br>
				</div>
			</div>
		</div>
		<div class="container py-2 d-flex flex-column align-items-center py-2">
			<button id="btn-QuickGame" class="btn custom-btn mb-4">QuickGame</button>
			<button id="btn-Match" class="btn custom-btn mb-4">Match</button>
			<button id="btn-Tournament" class="btn custom-btn mb-4">Tournament</button>
			<button id="btn-Leaderboard" class="btn custom-btn mb-4">Leaderboard</button>
		</div>
	`;
}

export function renderHomePage() {
	createHomeContent();

	document.getElementById('btn-QuickGame').addEventListener('click', () => {
		history.pushState({ page: 'quickgame' }, 'QuickGame', '?page=quickgame')
	    console.log('QuickGame button clicked');
	});

	document.getElementById('btn-Match').addEventListener('click', () => {
		if (!isAuthenticated()) { alertUserToLogin(); };
		history.pushState({ page: 'match' }, 'Match', '?page=match');
		console.log('Match button clicked');
	});

	document.getElementById('btn-Tournament').addEventListener('click', () => {
		// if (!isAuthenticated()) { alertUserToLogin(); };
		history.pushState({ page: 'tournament' }, 'Tournament', '?page=tournament');
		console.log('Tournament button clicked');
		// playerListner();
		showTournamentView();
	});

	document.getElementById('btn-Leaderboard').addEventListener('click', () => {
		if (!isAuthenticated())  { alertUserToLogin(); };
		history.pushState({ page: 'leaderboard' }, 'Leaderboard', '?page=leaderboard');
		console.log('Leaderboard button clicked');
	});
}
import { createTournament, fetchPlayers, performMatchmaking } from "../services/tournamentAPIService.js";

export function showRegistration() {
	const box = document.getElementById('mainContent');
	box.innerHTML = `
		<div id="registrationView">
			<h1>Registration</h1>
			<p>Register for the tournament</p>
			<button id="createTournamentBtn">Create Tournament</button>
			<button id="nextStageBtn">Next Stage</button>
			<div class="container participants-container">
				<h4>Participants</h4>
				<ul id="playersList" class="list-group">
					<!-- Dynamically insert participants here -->
				</ul>
			</div>
			<div class="button-container">
				<button id="quitTournamentBtn">Quit Tournament</button>
			</div>
			<br/>
			<br/>
			<h3>Bracket</h3>
			<ul id="bracketList" class="list-group">
				<!-- Dynamically insert bracket here -->
			</ul>
		</div>
	`;

	// Add event listeners for the buttons
	document.getElementById('createTournamentBtn').addEventListener('click', async () => {
		await createTournament();
		await fetchPlayers();
		performMatchmaking();
	});

	document.getElementById('nextStageBtn').addEventListener('click', () => {
		window.location.hash = '#tournament/bracketSetup';
	});

	document.getElementById('quitTournamentBtn').addEventListener('click', () => {
		alert('Quit Tournament functionality not implemented yet!');
	});
}
	
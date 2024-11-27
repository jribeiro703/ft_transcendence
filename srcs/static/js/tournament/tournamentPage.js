import { getPlayerList } from "./handlers/tournamentWebSocketHandler.js";
import { createTournament, fetchParticipants, performMatchmaking } from "./services/tournamentAPIService.js";

export function showTournamentView() {
	const box = document.getElementById('mainContent');
	box.innerHTML = `
		<!-- Tournament View starts here -->
		<div id="tournamentView">
			<h1 class="tournament-title">Tournament</h1>
			<p class="tournament-description">Win to Advance, Lose and You're Out!</p>
			<div class="container participants-container">
				<h4>Participants</h4>
				<ul id="playersList" class="list-group">
					<!-- Dynamically insert participants here -->
				</ul>
			</div>
			<div class="button-container">
				<button id="createTournamentBtn">Create Tournament</button>
				<button id="quitTournamentBtn">Quit Tournament</button>
			</div>
			<br/>
			<br/>
			<button id="createGameBtn">Create Demo Game</button>
			<h3>Game Log</h3>
			<ul id="gameLog"></ul>
		</div>
		<!-- Tournament View ends here -->
	`;

	// Add event listeners for the buttons
	document.getElementById('createTournamentBtn').addEventListener('click', async () => {
		const tournament = await createTournament();
		await fetchParticipants();
		await performMatchmaking(tournament.id); // Ensure matchmaking is performed after creating the tournament
	});

	document.getElementById('quitTournamentBtn').addEventListener('click', () => {
		alert('Quit Tournament functionality not implemented yet!');
	});

	document.getElementById('createGameBtn').addEventListener('click', () => {
		alert('Create Demo Game functionality not implemented yet!');
	});
}

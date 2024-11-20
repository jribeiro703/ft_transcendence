import { getPlayerList } from "./js/getPlayerList.js"

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
					<!-- <li class="list-group-item">Player 1</li> -->
					<!-- Add more players as needed -->
				</ul>
			</div>
			<div class="button-container">
				<button id="startTournamentBtn">Start Tournament</button>
				<button id="quitTournamentBtn">Quit Tournament</button>
			</div>
		</div>
		<!-- Tournament View ends here -->
	`;
	getPlayerList();
}

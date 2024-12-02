import { getPlayerList } from "./handlers/tournamentWebSocketHandler.js";
import { setupTournamentFlow, createTournament, fetchParticipants, performMatchmaking } from "./services/tournamentAPIService.js";
import { generateTournamentName, validateTournamentName } from "./services/tournamentAPIService.js";

export async function showCreateTournamentForm() {
	const box = document.getElementById('mainContent');
	const randomName = await generateTournamentName();
	box.innerHTML = `
	<div class="container-fluid p-3 p-sm-5">
		<div class="row h-100">
			<div class="col-sm-12 col-lg-6 mx-auto">
				<div class="card h-100">
					<div class="card-body">
						<h1 class="tournament-title">Create Tournament</h1>
						<form id="createTournamentForm">
							<div class="mb-3">
								<label for="tournamentName" class="form-label">Tournament Name</label>
								<input type="text" class="form-control" id="tournamentName" placeholder="Enter tournament name" value="${randomName}">
							</div>
							<button type="submit" class="btn btn-primary">Create Tournament</button>
						</form>
					</div>
				</div>
			</div>
		</div>
	</div>
	`;

	document.getElementById('createTournamentForm').addEventListener('submit', async function(event) {
		event.preventDefault();
		const tournamentName = document.getElementById('tournamentName').value;
		const isValid = await validateTournamentName(tournamentName);
		if (isValid) {
			createTournament(tournamentName).then(() => {
				showTournamentView();
			});
		} else {
			alert('Tournament name must be between 3 and 30 characters.');
		}
	});
}

export function showTournamentView() {
	const box = document.getElementById('mainContent');
	box.innerHTML = `
	<div class="d-flex flex-grow-1 w-100 overflow-hidden">
			<div class="container-fluid d-flex flex-column flex-grow-1 p-3">
				<div class="row mb-4">
					<div class="col bg-body border rounded py-1 px-2 d-flex align-items-center">
						<div class="fw-bold ms-3">Tournament Status</div>
						<div class="fw-bold ms-3 text-primary-emphasis h5" id="score-text"><status> 0 : 0</div>
						<div class="vr mx-3"></div>
						<div class="d-flex flex-nowrap gap-3 flex-grow-1" style="overflow-x: auto; white-space: nowrap" id="tournament-matches"></div>
					</div>
				</div>
				<div class="row flex-grow-1">
					<div class="col-lg-8 col-md-7 col-sm-12 d-flex justify-content-center align-items-center bg-body-secondary p-3 rounded position-relative">
						<canvas id="game-board" width="800" height="600" style="max-height: 600px"></canvas>
						<div id="waiting-overlay" class="position-absolute top-50 start-50 translate-middle w-100 h-100 d-flex justify-content-center align-items-center" style="background: rgba(0, 0, 0, 0.7)">
							<div class="text-center text-white">
								<h2>Waiting for tournament to start...</h2>
								<button type="button" id="start-tournament">Start Tournament</button>
							</div>
						</div>
						<div id="intermission-overlay" class="position-absolute top-50 start-50 translate-middle w-100 h-100 d-flex justify-content-center align-items-center d-none" style="background: rgba(0, 0, 0, 0.7)">
							<div class="text-center text-white">
								<h2 class="fs-1 animate-pulse" id="intermission-countdown">5</h2>
							</div>
						</div>
						<div id="finished-overlay" class="position-absolute top-50 start-50 translate-middle w-100 h-100 d-none d-flex justify-content-center align-items-center" style="background: rgba(0, 0, 0, 0.7)">
							<div class="text-center text-white">
								<h2 id="winner-text"></h2>
								<p id="finalScore" class="fs-4 mt-2">Tournament winner: <span id="tournament-winner" class="text-success"></span></p>
								<a type="button" class="btn btn-primary mt-3" id="play-again" href="/play" data-router-navigation="true">Go to Lobby</a>
							</div>
						</div>
					</div>
					<div class="col-lg-4 col-md-5 col-sm-12 d-flex flex-column">
						<div class="bg-body border rounded p-2 mb-3 overflow-auto" style="height: 250px; overflow-y: auto">
							<div class="fw-bold mb-2">Current Players</div>
							<div id="current-players"></div>
						</div>
						<div class="bg-body border rounded p-2 mb-3 overflow-auto" style="height: 150px; overflow-y: auto">
							<div class="fw-bold mb-2">Invite Players</div>
							<div id="invite-box"></div>
						</div>
						<div class="bg-body border rounded flex-grow-1 mb-3 overflow-auto" style="height: 250px; overflow-y: auto" id="chat-box-container">
							<div class="p-2" id="chat-box"></div>
						</div>
						<form class="input-group" id="chat-form">
							<input type="text" class="form-control" placeholder="Type a message..." id="chat-input" />
							<button type="submit" class="btn btn-primary" id="send-chat-button">Send</button>
						</form>
					</div>
				</div>
			</div>
		</div>
	`;

	document.getElementById('quitTournamentBtn').addEventListener('click', () => {
		alert('Quit Tournament functionality not implemented yet!');
	});

	document.getElementById('createGameBtn').addEventListener('click', () => {
		alert('Create Demo Game functionality not implemented yet!');
	});

	// Trigger the flow on button click
	document.getElementById('setupTournamentBtn').addEventListener('click', setupTournamentFlow);

}

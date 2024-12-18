// tournament/templates/createTournamentFormTemplate.js

export function createTournamentFormHTML(tournamentName) {
	return `
					<div class="d-flex text-center justify-content-center flex-column align-items-center w-100 gap-1">
						<h1 class="fw-normal">Create Tournament</h1>
						<form id="createTournamentForm" class="d-flex justify-content-center align-items-center flex-column gap-3">
								<label for="tournamentName" class="form-label">Tournament Name</label>
								<input type="text" class="form-control" id="tournamentName" placeholder="Enter tournament name" value="${tournamentName}">
							<button class="settingsBtn rounded border-2" id="createTournament">Create Tournament</button>
						</form>
						<h2>Tournament List</h2>
						<div id="noTournamentMessage" style="display: block;">
							No tournament available for now. Create one !
						</div>
						<div id="tournamentContainer"></div>
						<div class="refresh"></div>
						<button id="refreshTourBtn" class="settingsBtn rounded border-2">Refresh</button>
  </div>
	`;
}


export function createTournamentLayoutHTML(tournamentName) {
    return `
        <div class="tournament-container">
            <h2>Tournament: ${tournamentName}</h2>
            <div class="tournament-lists">
                <div class="available-tournaments">
                    <h3>Available Tournaments</h3>
                    <div id="tournament-list" class="tournament-list">
                        <!-- Les tournois seront injectés ici -->
                    </div>
                </div>
                <div class="current-tournament">
                    <h3>Current Tournament</h3>
                    <div id="tournament-bracket"></div>
                </div>
            </div>
        </div>
    `;
}

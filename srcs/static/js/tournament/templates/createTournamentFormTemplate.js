// tournament/templates/createTournamentFormTemplate.js

export function createTournamentFormHTML(tournamentName) {
	return `
	<div class="container-fluid p-3 p-sm-5">
		<div class="row h-100">
			<div class="col-sm-12 col-lg-6 mx-auto">
				<div class="card h-100 rounded">
					<div class="card-body">
						<h1 class="tournament-title">Create Tournament</h1>
						<form id="createTournamentForm">
							<div class="mb-3">
								<label for="tournamentName" class="form-label">Tournament Name</label>
								<input type="text" class="form-control" id="tournamentName" placeholder="Enter tournament name" value="${tournamentName}">
							</div>
							<button class="btn btn-primary" id="createTournament">Create Tournament</button>
						</form>
					</div>
				</div>
			</div>
		</div>
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

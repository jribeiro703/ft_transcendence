// tournament/templates/createTournamentFormTemplate.js

export function createTournamentFormHTML(tournamentName) {
	return `
	<div class="container-fluid p-3 p-sm-5">
		<div class="row h-100">
			<div class="col-sm-12 col-lg-6 mx-auto">
				<div class="card h-100">
					<div class="card-body">
						<h1 class="tournament-title">Create Tournament</h1>
						<form id="createTournamentForm">
							<div class="mb-3">
								<label for="tournamentName" class="form-label">Tournament Name</label>
								<input type="text" class="form-control" id="tournamentName" placeholder="Enter tournament name" value="${tournamentName}">
							</div>
							<button type="submit" class="btn btn-primary">Create Tournament</button>
						</form>
					</div>
				</div>
			</div>
		</div>
	</div>
	`;
}

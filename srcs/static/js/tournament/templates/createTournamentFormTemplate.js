// tournament/templates/createTournamentFormTemplate.js

export function createTournamentFormHTML(tournamentName = '') {
	return `
	<div id="container">
		<div class="section" id="createSection">
			<h2>Create Tournament</h2>
			<form id="createTournamentForm">
				<div class="formGroup">
					<label for="tournamentName">Tournament Name</label>
					<input type="text" id="tournamentName" placeholder="Enter tournament name" value="${tournamentName}">
				</div>
				<button class="btn" id="createTournament">Create Tournament</button>
			</form>
		</div>

		<div class="section" id="tournamentsSection">
			<h2>Available Tournaments & Invitations</h2>
			<div id="tournamentsList">
				<p>No tournaments or invitations available.</p>
			</div>
		</div>
	</div>
	`;
}

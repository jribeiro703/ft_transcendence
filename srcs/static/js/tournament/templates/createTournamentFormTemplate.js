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
	`;
}

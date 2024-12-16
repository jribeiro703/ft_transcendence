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
				<button class="btn" id="createTournamentBtn">Create Tournament</button>
			</form>
		</div>
		<div class="bg-body border rounded p-2 mb-3 join-container">
			<div class="fw-bold mb-2">Join a Tournament</div>
			<form id="joinTournamentForm">
				<input type="text" id="joinTournamentId" placeholder="Enter Tournament ID"/>
				<button class="btn" id="joinTournamentBtn">Join Tournament</button>
			</form>
		</div>
	</div>
	`;
}

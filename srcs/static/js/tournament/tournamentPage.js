// tournamentPage.js

import { setupTournamentFlow } from './utils/tournamentFlow.js';
import { generateTournamentName, validateTournamentName } from './services/apiService.js';
import { createTournamentFormHTML } from './templates/createTournamentFormTemplate.js';
import { createTournamentLayoutHTML } from './templates/createTournamentLayoutTemplate.js';
import { setupEligiblePlayersRefresh } from './services/periodicService.js';

let currentTournamentId;

export async function showCreateTournamentForm() {
	const box = document.getElementById('mainContent');
	const randomName = await generateTournamentName();
	box.innerHTML = createTournamentFormHTML(randomName);

	document.getElementById('createTournamentForm').addEventListener('submit', async function(event) {
		event.preventDefault();
		const tournamentName = document.getElementById('tournamentName').value;
		const isValid = await validateTournamentName(tournamentName);
		if (isValid) {
			await showTournamentView(tournamentName);
		} else {
			alert('Tournament name must be between 3 and 30 characters.');
		}
	});
}

export async function showTournamentView(tournamentName) {
	const box = document.getElementById('mainContent');
	box.innerHTML = createTournamentLayoutHTML(tournamentName);

	
	// Call the setup flow directly
	currentTournamentId = await setupTournamentFlow(tournamentName);
	
	// Ensure the playersList element is present in the DOM
	const playersList = document.getElementById('playersList');
	if (!playersList) {
		console.error("playersList element is not found in the DOM");
		return;
	}
	
	// Start periodic fetching of eligible players
	setupEligiblePlayersRefresh();
}

// Call this function to start the periodic fetching
setupEligiblePlayersRefresh();

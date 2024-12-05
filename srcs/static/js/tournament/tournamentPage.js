import { setupTournamentFlow, createTournament, fetchEligiblePlayers, performMatchmaking } from "./services/tournamentAPIService.js";
import { generateTournamentName, validateTournamentName } from "./services/tournamentAPIService.js";
import { fetchTournamentBracket, fetchCurrentPlayers } from "./services/tournamentAPIService.js";

import { createTournamentFormHTML } from "./templates/createTournamentFormTemplate.js";
import { createTournamentLayoutHTML } from "./templates/createTournamentLayoutTemplate.js";

import { getFriendsList } from "./handlers/tournamentWebSocketHandler.js";

export async function showCreateTournamentForm()
{
	const box = document.getElementById('mainContent');
	const randomName = await generateTournamentName();
	box.innerHTML = createTournamentFormHTML(randomName);

	document.getElementById('createTournamentForm').addEventListener('submit', async function(event)
	{
		event.preventDefault();
		const tournamentName = document.getElementById('tournamentName').value;
		const isValid = await validateTournamentName(tournamentName);
		if (isValid) {
			showTournamentView(tournamentName);
		} else {
			alert('Tournament name must be between 3 and 30 characters.');
		}
	});
}

export async function showTournamentView(tournamentName)
{
	const box = document.getElementById('mainContent');
	box.innerHTML = createTournamentLayoutHTML(tournamentName);
	// Trigger the setup flow on button click
	setupTournamentFlow(tournamentName);

}


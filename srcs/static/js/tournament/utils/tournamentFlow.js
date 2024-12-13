// tournament/utils/tournamentFlow.js

import { createTournament, fetchEligiblePlayers, performMatchmaking, preRegisterPlayers, fetchTournamentBracket, fetchCurrentPlayers } from '../services/apiService.js';
import { setupTournamentBracketRefresh, createRealtimeConnection } from '../services/realtimeService.js';
import { getFriendsList } from '../handlers/friendManagement.js';
import { renderBracket } from '../services/realtimeService.js';

export async function setupTournamentFlow(name) {
	try {
		// Step 1: Create the tournament
		const tournamentId = await createTournament(name);
		if (!tournamentId) return;

		// Step 2: Fetch eligible players
		const eligiblePlayers = await fetchEligiblePlayers();
		if (!eligiblePlayers || eligiblePlayers.length < 2) {
			console.error('Not enough players to proceed.');
			return;
		}

		// Step 3: Pre-register players
		const playerIds = eligiblePlayers.map(player => player.id);
		await preRegisterPlayers(tournamentId, playerIds);

		// Step 4: Perform matchmaking
		await performMatchmaking(tournamentId);

		// Step 5: Fetch and render the tournament bracket
		//const bracket = await fetchTournamentBracket(tournamentId);
		//renderBracket(bracket, tournamentId);

		// Step 6: Fetch and render the friends list
		getFriendsList(tournamentId);

		// Step 7: Establish WebSocket connection for tournament bracket
/* 		const bracketSocket = createRealtimeConnection(
			"wss://" + window.location.host + "/ws/tournament/",
			"update_bracket",
			(data) => {
				if (data.action === "update_bracket") {
					renderBracket(data.bracket, tournamentId);
				} else if (data.error) {
					console.error("Error from server:", data.error);
				} else {
					console.warn("Unexpected action:", data);
				}
			}
		);

		bracketSocket.onerror = function (error) {
			console.error("WebSocket error for tournament bracket:", error);
		};

		bracketSocket.onclose = function () {
			console.log("WebSocket connection closed for tournament bracket");
		}; */

		// Step 8: Fetch and render the current players
		const players = await fetchCurrentPlayers(tournamentId);
		const playersList = document.getElementById('playersList');
		if (playersList) {
			playersList.innerHTML = players.map(player => `<span class="online-players">✅️ ${player.username} </span>`).join('');
		} else {
			console.error("playersList element is not found in the DOM");
		}

		// Step 9: Start periodic fetching of the tournament bracket
		//setupTournamentBracketRefresh(tournamentId);

		// console.log('Tournament setup completed successfully.');
		return tournamentId; // Return the tournament ID
	} catch (error) {
		console.error('Error during tournament setup flow:', error);
	}
}

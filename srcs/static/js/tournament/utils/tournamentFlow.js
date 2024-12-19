// tournament/utils/tournamentFlow.js

import { createTournament, fetchPlayers, performMatchmaking, preRegisterPlayers, fetchTournamentBracket, fetchCurrentPlayers } from '../services/apiService.js';
import { getFriendsList } from '../handlers/friendManagement.js';

export async function setupTournamentFlow(name, tournamentId, isCreator) {
	try {
		console.log('[setupTournamentFlow] Starting setup...');
		console.log('[setupTournamentFlow] isCreator:', isCreator);

		if (isCreator) {
			console.log('[setupTournamentFlow] Creator flow initiated...');
			
			// Step 1: Create the tournament
			const newTournamentId = await createTournament(name);
			console.log('[setupTournamentFlow] newTournamentId (from createTournament):', newTournamentId);
			if (!newTournamentId) {
				console.error('[setupTournamentFlow] Failed to create tournament.');
				return;
			}

			tournamentId = newTournamentId;
			console.log('[setupTournamentFlow] tournamentId updated to:', tournamentId);

			// Step 2: Fetch eligible players
			console.log('[setupTournamentFlow] Fetching eligible players...');
			const eligiblePlayers = await fetchPlayers();
			if (!eligiblePlayers || eligiblePlayers.length < 2)
			{
				console.error('[setupTournamentFlow] Not enough eligible players to proceed.');
				const bracketContainer = document.getElementById('tournament-bracket');
				bracketContainer.innerHTML = `
					<div class="no-players-message text-danger">
						Not enough players for the tournament.
					</div>
				`;
				//const generateMatchesButton = document.getElementById('generateMatches');
				//if (generateMatchesButton) generateMatchesButton.style.display = 'none';

			}
			console.log('[setupTournamentFlow] Eligible players fetched:', eligiblePlayers);
			
			// Step 3: Pre-register players
			const playerIds = eligiblePlayers.map(player => player.id);
			console.log('[setupTournamentFlow] Pre-registering players with IDs:', playerIds);
			await preRegisterPlayers(tournamentId, playerIds);
			
			// Step 4: Perform matchmaking
			console.log('[setupTournamentFlow] Performing matchmaking for tournamentId:', tournamentId);
			await performMatchmaking(tournamentId);
		}

		// Step 6: Fetch and render the friends list
		console.log('[setupTournamentFlow] Fetching friends list for tournamentId:', tournamentId);
		getFriendsList(tournamentId);

		// Step 8: Fetch and render the current players
		console.log('[setupTournamentFlow] Fetching current players for tournamentId:', tournamentId);
		let players;
		try {
			players = await fetchCurrentPlayers(tournamentId);
			console.log('[setupTournamentFlow] Current players fetched:', players);
		} catch (error) {
			console.error('[setupTournamentFlow] Error fetching current players:', error.message);
			players = []; // Default to an empty array to avoid further errors
		}

		const playersList = document.getElementById('playersList');
		if (playersList && players.length > 0) {
			console.log('[setupTournamentFlow] Rendering players list...');
			playersList.innerHTML = players
				.map(player => `<span class="online-players">✅️ ${player.username}</span>`)
				.join('');
		} else {
			console.warn('[setupTournamentFlow] Players list element not found in the DOM or no players available.');
		}

		console.log('[setupTournamentFlow] Tournament setup flow completed successfully.');
		return tournamentId; // Return the tournament ID
	} catch (error) {
		console.error('[setupTournamentFlow] Error during tournament setup flow:', error);
	}
}

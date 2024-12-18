// tournament/services/periodicService.js

import { fetchEligiblePlayers } from './apiService.js';
import { fetchTournamentBracketPeriodically } from './realtimeService.js';

let eligiblePlayersInterval;
let currentTournamentId;

export function fetchEligiblePlayersPeriodically() {
	fetchEligiblePlayers().then(data => {
		const playersList = document.getElementById('playersList');
		if (playersList) {
			playersList.innerHTML = '';
			if (data.length === 0) {
				playersList.textContent = "No players online.";
			} else {
				const onlinePlayers = data.map(player => player.username).join(', ');
				playersList.innerHTML = `<span class="online-players">${onlinePlayers} are online</span>`;
			}
		} else {
			//console.error("playersList is null");
		}

		// Fetch and update the tournament bracket
		if (currentTournamentId) {
			fetchTournamentBracketPeriodically(currentTournamentId);
		}
	}).catch(error => console.error('Error fetching eligible players:', error));
}

export function setupEligiblePlayersRefresh() {
	fetchEligiblePlayersPeriodically(); // Initial fetch
	eligiblePlayersInterval = setInterval(fetchEligiblePlayersPeriodically, 10000); // Fetch every 10 seconds
}

// WebSocket setup for user status
const statusSocket = new WebSocket(
	'wss://' + window.location.host + '/ws/tournament/user-status/'
);

statusSocket.onmessage = function(event) {
	const data = JSON.parse(event.data);
	if (data.action === 'update_status') {
		fetchEligiblePlayersPeriodically(); // Refresh the list of online players
		if (currentTournamentId) {
			fetchTournamentBracketPeriodically(currentTournamentId); // Refresh the tournament bracket
		}
	}
};

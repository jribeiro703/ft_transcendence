// tournament/services/periodicService.js

import { fetchPlayers } from './apiService.js';

let eligiblePlayersInterval;
let currentTournamentId;

export function fetchPlayersPeriodically() {
	fetchPlayers().then(data => {
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
	}).catch(error => console.error('Error fetching eligible players:', error));
}

export function setupEligiblePlayersRefresh() {
	fetchPlayersPeriodically(); // Initial fetch
	eligiblePlayersInterval = setInterval(fetchPlayersPeriodically, 10000); // Fetch every 10 seconds
}

// WebSocket setup for user status
const statusSocket = new WebSocket(
	'wss://' + window.location.host + '/ws/tournament/user-status/'
);

statusSocket.onmessage = function(event) {
	const data = JSON.parse(event.data);
	if (data.action === 'update_status') {
		fetchPlayersPeriodically(); // Refresh the list of online players
	}
};

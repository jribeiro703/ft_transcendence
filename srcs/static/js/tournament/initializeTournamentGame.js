// initializeTournamentGame.js

import gameVar from "../game/pong/var.js";
import { sendPlayerData, sendRoomData } from "../game/pong/network.js";

export function initializeLobbySocket() {
	const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
	const lobbySocket = new WebSocket(protocol + '//' + window.location.host + '/ws/pong/check_rooms/');

	lobbySocket.onopen = function(e) {
		console.log('Lobby socket opened');
		gameVar.lobbySocket = lobbySocket;
	};

	lobbySocket.onmessage = function(e) {
		const data = JSON.parse(e.data);
		if (data.type === 'room_data')
			gameVar.roomTour1 = data.room_data.roomName;
		// console.log("Lobby data: ", data);
		// Handle lobby messages
	};

	lobbySocket.onerror = function(e) {
		console.error('Lobby socket error:', e);
	};

	lobbySocket.onclose = function(e) {
		console.error('Lobby socket closed unexpectedly code : ', e.code, 'reason', e.reason);
	};
	// sendRoomData(lobbySocket, gameVar.roomTour1);
}

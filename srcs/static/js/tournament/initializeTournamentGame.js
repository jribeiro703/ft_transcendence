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
	};

	lobbySocket.onerror = function(e) {
		console.error('Lobby socket error:', e);
	};

	lobbySocket.onclose = function(e) {
		console.error('Lobby socket closed unexpectedly code : ', e.code, 'reason', e.reason);
	};
}

export function initializeJoinSocket()
{
	const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
	const tournamentSocket = new WebSocket(protocol + '//' + window.location.host + '/ws/pong/check_rooms/');

	tournamentSocket.onopen = function(e)
	{
		console.log('Tournemant socket opened');
		gameVar.tournamenetSocket = tournamentSocket;

		tournamentSocket.send(JSON.stringify({
            type: 'get_tournaments'
        }));
	};

	tournamentSocket.onmessage = function(e)
	{
		const data = JSON.parse(e.data);
		if (data.type === 'tournament_list' || data.type === 'tournament_update')
		{
			updateTournamentsList(data.tournaments)
		}
	};

	tournamentSocket.onerror = function(e)
	{
		console.error('Lobby socket error:', e);
	};

	tournamentSocket.onclose = function(e)
	{
		console.error('Lobby socket closed unexpectedly code : ', e.code, 'reason', e.reason);
	};
}



function updateTournamentsList(tournaments)
{
    gameVar.tournamentArray = tournaments;
    
    const tournamentList = document.getElementById('tournament-list');
    if (!tournamentList) return;

    tournamentList.innerHTML = '';
    
    tournaments.forEach(tournament =>
	{
        const tournamentElement = document.createElement('div');
        tournamentElement.className = 'tournament-item';
        tournamentElement.innerHTML = `
            <div class="tournament-name">${tournament.name}</div>
            <div class="tournament-status">${tournament.status}</div>
            <button class="join-tournament-btn" 
                    ${tournament.status !== 'waiting' ? 'disabled' : ''}
                    onclick="joinTournament('${tournament.name}')">
                Join Tournament
            </button>
        `;
        tournamentList.appendChild(tournamentElement);
    });
}
export function createTournament(name)
{
    if (!gameVar.tournamentSocket) return;
    
    gameVar.tournamentSocket.send(JSON.stringify(
	{
        type: 'create_tournament',
        tournament_name: name,
        creator: gameVar.userName
    }));
}
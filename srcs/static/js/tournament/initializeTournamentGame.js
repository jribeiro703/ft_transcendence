// initializeTournamentGame.js

import gameVar from "../game/pong/var.js";

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

//TODO: Ask boty if he uses this function
export function initializeJoinSocket()
{
	const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
	const tournamentSocket = new WebSocket(protocol + '//' + window.location.host + '/ws/pong/check_rooms/');

	tournamentSocket.onopen = function(e)
	{
		console.log('Tournemant socket opened');
		gameVar.tournamentSocket = tournamentSocket;
		askForTournamentList();

		tournamentSocket.send(JSON.stringify({
			type: 'get_tournaments'
		}));
	};

	tournamentSocket.onmessage = function(e)
	{
		const data = JSON.parse(e.data);
		if (data.type === 'tournament_info')
		{
			console.log("recept tournament info");
			updateTournamentsList(data.tournament_info.name, data.tournament_info.creator);
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

//TODO: Ask boty if he uses this function
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

//TODO: Ask boty if he uses this function
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

// createTournamentLayoutTemplate.js
export function createTournamentLayoutHTML(tournamentName) {
    return `
        <div class="tournament-container">
            <h2>Tournament: ${tournamentName}</h2>
            <div class="tournament-lists">
                <div class="available-tournaments">
                    <h3>Available Tournaments</h3>
                    <div id="tournament-list" class="tournament-list">
                        <!-- Les tournois seront injectés ici -->
                    </div>
                </div>
                <div class="current-tournament">
                    <h3>Current Tournament</h3>
                    <div id="tournament-bracket"></div>
                </div>
            </div>
        </div>
    `;
}
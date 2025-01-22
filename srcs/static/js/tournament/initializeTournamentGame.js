// initializeTournamentGame.js

import gameVar from "../game/pong/var.js";
import { sendPlayerData } from "../game/pong/network.js";

export function initializeLobbySocket(tournamentName) {
	const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
	const lobbySocket = new WebSocket(protocol + '//' + window.location.host + `/ws/pong/${tournamentName}/`);

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

export function askForTournamentList()
{
	if (!gameVar.tournamentArray)
		console.log("No tournament available");
	else
	{
		console.log("there are some tournament");
		const tournamentList = document.getElementById("tournamentContainer");
		gameVar.tournamentArray.forEach(tournament =>
		{
			const tournamentElement = document.createElement('div');
			tournamentElement.className = 'tournament-item';
			tournamentElement.innerHTML = `
				<div class="tournament-name">${tournament.name} created by ${tournament.creator}</div>
				<button class="join-tournament-btn" 
						onclick="joinTournament('${tournament.name}')">
					Join Tournament
				</button>
			`;
			tournamentList.appendChild(tournamentElement);
		});
	}
}

export function initializeTournamentSocket()
{
	const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
	const tournamentSocket = new WebSocket(protocol + '//' + window.location.host + '/ws/pong/check_rooms/');
	gameVar.tournamentSocket = tournamentSocket;
	const tourRefresh = document.getElementById('refreshTourBtn');

	tourRefresh.addEventListener('click', () =>
	{
		tournamentSocket.send(JSON.stringify({type: 'lobbyTour'}))
	});
	tournamentSocket.onopen = function(e)
	{
		console.log('Tournemant socket opened');
		tournamentSocket.send(JSON.stringify({type: 'lobbyTour'}));
		// askForTournamentList();
	};


	tournamentSocket.onmessage = function(e)
	{
		const data = JSON.parse(e.data);
		console.log("data", data);
		if (data.type === 'tournament_info')
		{
			console.log("recept tournament info");
			if (Array.isArray(data.tournament_info))
			{
				data.tournament_info.forEach(tournament => 
				{
					updateTournamentsList(tournament.name, tournament.creator)
				});
			}
		}
		if (data.type === 'ping')
		{
			tournamentSocket.send(JSON.stringify({ type: 'pong' }));
		}
	};

	tournamentSocket.onerror = function(e)
	{
		console.error('tournament socket error:', e);
	};

	tournamentSocket.onclose = function(e)
	{
		console.error('tournament socket closed unexpectedly code : ', e.code, 'reason', e.reason);
	};
}

function updateTournamentsList(name, creator)
{
	console.log("update tournament list");
    if (!gameVar.tournamentArray)
	{
        gameVar.tournamentArray = [];
    }

    const newTournament = {
        name: name,
        creator: creator,
    };
    gameVar.tournamentArray.push(newTournament);
	console.log("new name :", newTournament.name);
	console.log("new creat :", newTournament.creator);
    
    const tournamentList = document.getElementById('tournament-list');
    if (!tournamentList)
		return;

    tournamentList.innerHTML = '';
    
    // Afficher tous les tournois
    gameVar.tournamentArray.forEach(tournament =>
	{
        const tournamentElement = document.createElement('div');
        tournamentElement.className = 'tournament-item';
        tournamentElement.innerHTML = `
            <div class="tournament-name">${tournament.name} created by ${tournament.creator}</div>
            <button class="join-tournament-btn" 
                    onclick="joinTournament('${tournament.name}')">
                Join Tournament
            </button>
        `;
        tournamentList.appendChild(tournamentElement);
    });
}

// function updateTournamentsList(name, creator)
// {
    
//     const tournamentList = document.getElementById('tournament-list');
//     if (!tournamentList) return;

//     tournamentList.innerHTML = '';
    
//     tournaments.forEach(tournament =>
// 	{
//         const tournamentElement = document.createElement('div');
//         tournamentElement.className = 'tournament-item';
//         tournamentElement.innerHTML = `
//             <div class="tournament-name">${name} created by ${creator}</div>
//             <button class="join-tournament-btn" 
//                     onclick="joinTournament('${name}')">
//                 Join Tournament
//             </button>
//         `;
//         tournamentList.appendChild(tournamentElement);
//     });
// }

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
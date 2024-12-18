// tournament/services/realtimeService.js

import gameVar from '../../game/pong/var.js';
import { createWebSocketConnection } from '../utils/websocketUtils.js';
import { fetchTournamentBracket } from './apiService.js';
import { startGameWithPlayers2 } from '../tournamentPage.js';

let bracketInterval;
let bracketSocket;

export function setupTournamentBracketRefresh(tournamentId) {
	fetchTournamentBracketPeriodically(tournamentId); // Initial fetch
	if (bracketInterval) clearInterval(bracketInterval); // Clear any existing interval
	bracketInterval = setInterval(() => fetchTournamentBracketPeriodically(tournamentId), 10000); // Fetch every 10 seconds
}

export async function fetchTournamentBracketPeriodically(tournamentId) {
	try {
		const bracket = await fetchTournamentBracket(tournamentId);
		renderBracket(bracket, tournamentId);
	} catch (error) {
		console.error('Error fetching tournament bracket:', error);
	}
}

// export function renderBracket(bracket, tournamentId) {
// 	const bracketContainer = document.getElementById('tournament-bracket');
// 	if (bracketContainer) {
// 		bracketContainer.innerHTML = ''; // Clear existing content

// 		bracket.forEach((match, index) => {
// 			// Create the match div
// 			const matchDiv = document.createElement('div');
// 			matchDiv.className = 'match d-flex justify-content-between align-items-center px-3 py-2 bg-light rounded border mb-2';
// 			const player1Class = match.player1 === tournamentId ? 'highlighted-user' : '';
// 			const player2Class = match.player2 === tournamentId ? 'highlighted-user' : '';

// 			matchDiv.innerHTML = `
// 				<div class="player text-success d-flex align-items-center gap-2 ${player1Class}">
// 					🎉 <span class="fw-bold">${match.player1}</span>
// 				</div>
// 				<div class="vs text-muted fw-bold text-center">vs</div>
// 				<div class="player text-danger d-flex align-items-center gap-2 ${player2Class}">
// 					<span class="fw-bold">${match.player2}</span> 🔥
// 				</div>
// 			`;
// 			bracketContainer.appendChild(matchDiv);
// 			// Add a connector line if it's not the last match
// 			if (index < bracket.length - 1) {
// 				const connector = document.createElement('div');
// 				connector.className = 'connector d-flex justify-content-center align-items-center';
// 				connector.innerHTML = `
// 					<span class="line"></span>
// 				`;
// 				bracketContainer.appendChild(connector);
// 			}
// 		});
// 	} else {
// 		// console.error("Bracket container is null");
// 	}
// }

export function renderBracket(bracket, tournamentId)
{
	const bracketContainer = document.getElementById('tournament-bracket');
	if (bracketContainer)
	{
		if (bracketContainer.dataset.currentBracket === JSON.stringify(bracket))
		{
			return;
		}

		bracketContainer.innerHTML = ''; // Clear existing content
		bracketContainer.dataset.currentBracket = JSON.stringify(bracket);

		bracket.forEach((match, index) =>
		{
			// Create the match div
			const matchDiv = document.createElement('div');
			matchDiv.className = 'match d-flex justify-content-between align-items-center px-3 py-2 bg-light rounded border mb-2';
			const player1Class = match.player1 === tournamentId ? 'highlighted-user' : '';
			const player2Class = match.player2 === tournamentId ? 'highlighted-user' : '';
		
			matchDiv.innerHTML = `
				<div class="player text-success d-flex align-items-center gap-2 ${player1Class}">
					🎉 <span class="fw-bold">${match.player1}</span>
				</div>
				<div class="vs text-muted fw-bold text-center">vs</div>
				<div class="player text-danger d-flex align-items-center gap-2 ${player2Class}">
					<span class="fw-bold">${match.player2}</span> 🔥
				</div>
			`;
			bracketContainer.appendChild(matchDiv);

			// getUserInfos();
			console.log("player1: ", match.player1);
			console.log("player2: ", match.player2);
			console.log("username: ", gameVar.userName );
			const isPlayerInMatch = (match.player1 === gameVar.userName || match.player2 === gameVar.userName);

			if (isPlayerInMatch)
			{
				console.log("il est la !");
				const matchBTn = document.createElement('div');
				matchBTn.innerHTML = `
				<div class="vs text-muted fw-bold text-center">
					<button type="button" id="startTournamentGameBtn" class="btn btn-primary mt-2">Start Your Game</button>
				</div>
				`;
				

				bracketContainer.appendChild(matchBTn);
				document.getElementById('startTournamentGameBtn').addEventListener('click', () =>
				{
					startGameWithPlayers2(match.player1, match.player2, gameVar.userName);
				});
			}


			// Add a connector line if it's not the last match
			if (index < bracket.length - 1)
			{
				const connector = document.createElement('div');
				connector.className = 'connector d-flex justify-content-center align-items-center';
				connector.innerHTML = `
					<span class="line"></span>
				`;
				bracketContainer.appendChild(connector);
			}
		});
	}
	else
	{
		// console.error("Bracket container is null");
	}
}

export function createRealtimeConnection(url, action, onMessageCallback, onErrorCallback, onCloseCallback) {
	return createWebSocketConnection(url, action, (data) => {
		if (data.action === 'update_bracket') {
			onMessageCallback(data);
		} else {
			// console.error('Invalid action received:', data.action);
		}
	}, onErrorCallback, onCloseCallback);
}

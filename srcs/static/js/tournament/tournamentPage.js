// tournament/tournamentPage.js

import { setupTournamentFlow } from './utils/tournamentFlow.js';

import { fetchEligiblePlayers, generateTournamentName, validateTournamentName, fetchTournamentBracket } from './services/apiService.js';
import { setupEligiblePlayersRefresh } from './services/periodicService.js';
import { renderBracket } from './services/realtimeService.js';

import { createTournamentFormHTML } from './templates/createTournamentFormTemplate.js';
import { createTournamentLayoutHTML } from './templates/createTournamentLayoutTemplate.js';

import gameVar from '../game/pong/var.js';
import { createNewRoom, joinRoom } from "../game/pong/room.js";
import { initializeLobbySocket } from './initializeTournamentGame.js';
import { displayGameView } from '../game/pong/display.js';
import { initializeCanvasPong } from '../game/pong/canvas.js';
import { updateDifficultySelection, updateLevelSelection } from '../game/pong/update.js';
import { initControlLive } from '../game/pong/control.js';
import { getUserInfos2 } from '../game/getUser.js';
import { fetchAuthData } from '../user/fetchData.js';

let currentTournamentId;

export async function setupTournamentPage()
{
	const box = document.getElementById('mainContent');
	let randomName ="";
	randomName = await generateTournamentName();
	box.innerHTML = createTournamentFormHTML(randomName);
	getUserInfos2();

	document.getElementById('createTournamentBtn').addEventListener('click', () =>
	{
		const tournamentName = document.getElementById('tournamentName').value;
		const isValid = validateTournamentName(tournamentName);
		if (isValid) {
			showTournamentView2(tournamentName);
		} else {
			alert('Error: Tournament cannot be created.');
		}
	});

	// TODO: JOIN is a simulation of the invitation. 
	// 🤔 Not sure if we need this here, because if Invitations are dealt in the livechat, we may not need it here
	document.getElementById('joinTournamentBtn').addEventListener('click', async () => {
		const tournamentId = document.getElementById('joinTournamentId').value;
	
		if (!tournamentId) {
			alert("Tournament ID is required!");
			return;
		}
	
		try {
			// Fetch user details
			const userResponse = await fetchAuthData('/user/private/');
			if (userResponse.status !== 200) {
				throw new Error("Failed to fetch user details");
			}
	
			const userData = userResponse.data;
			const userId = userData.id;
	
			// Attempt to join the tournament
			const data = await joinTournament(tournamentId, userId);
	
			if (data.already_in_tournament) {
				alert(`Welcome back to Tournament: ${data.tournament_name}`);
			} else {
				alert(`Successfully joined Tournament: ${data.tournament_name}`);
			}
	
			// Call showTournamentView2 to render the layout
			showTournamentView2(data.tournament_name);
	
			// Update the players list dynamically
			updatePlayersList(data.players);
	
			// Optionally hide buttons for regular players if needed
			const lockButton = document.getElementById('lockTournamentBtn');
			const generateMatchesButton = document.getElementById('generateMatches');
			const startButton = document.getElementById('startTournamentBtn');
	
			if (lockButton) lockButton.style.display = 'none';
			if (generateMatchesButton) generateMatchesButton.style.display = 'none';
			if (startButton) startButton.style.display = 'none';
	
		} catch (error) {
			console.error("Error joining tournament:", error);
			alert(`Error: ${error.message}`);
		}
	});
}

export async function showTournamentView2(tournamentName)
{
	const box = document.getElementById('mainContent');
	box.innerHTML = createTournamentLayoutHTML(tournamentName);

	currentTournamentId = await setupTournamentFlow(tournamentName);

	const playersList = document.getElementById('playersList');
	if (!playersList)
	{
		console.error("playersList element is not found in the DOM");
		return;
	}
	initializeLobbySocket();
	gameVar.liveMatch = true;

	document.getElementById('generateMatches').addEventListener('click', async () =>
	{
		const bracket = await fetchTournamentBracket(currentTournamentId);
		console.log("Fetched bracket:", bracket);
		renderBracket(bracket, currentTournamentId);
	});
	setupEligiblePlayersRefresh();
}

export function startGameWithPlayers2(player1id, player2id, currentPlayer)
{
	const playerIdx = (currentPlayer === player1id) ? 1 : 2;

	gameVar.playerIdx = playerIdx;
	gameVar.tournament = true;
	gameVar.opponentName = player2id;

	if (playerIdx === 1)
		createTournamentGame();
	else
		joinTournamentGame();
}

export async function joinTournamentGame()
{
	gameVar.playerIdx = 2;
	gameVar.tournament = true;
	gameVar.playerReady = true;
	displayGameView();
	await initializeCanvasPong();
	initControlLive();
	joinRoom(gameVar.roomTour1);
}


export async function createTournamentGame()
{
	gameVar.tournament = true;
	updateDifficultySelection('medium');
	updateLevelSelection('classicPong');
	initControlLive();
	displayGameView();
	await initializeCanvasPong();
	createNewRoom();
}

//------------------------------------------------------------------//
// TODO: JOIN is a simulation of the invitation. 
// 🤔 Not sure if we need this here, because if Invitations are dealt in the livechat, we may not need it here
export async function joinTournament(tournamentId, userId) {
	const response = await fetch("/tournament/join/", {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
		},
		body: JSON.stringify({
			tournament_id: tournamentId,
			user_id: userId
		}),
	});

	const data = await response.json();
	console.log("after join tournament ", data);
	if (!response.ok) {
		throw new Error(data.error || "Unable to join the tournament.");
	}

	return data;
}

function updatePlayersList(players) {
	const playersList = document.getElementById("playersList");
	if (playersList) {
		playersList.innerHTML = players
			.map(player => `<span class="online-players">✅ ${player.username}</span>`)
			.join('');
	}
}
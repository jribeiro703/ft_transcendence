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

let currentTournamentId;

export async function setupTournamentPage()
{
	const box = document.getElementById('mainContent');
	let randomName ="";
	randomName = await generateTournamentName();
	box.innerHTML = createTournamentFormHTML(randomName);
	getUserInfos2();

	document.getElementById('createTournament').addEventListener('click', () =>
	{
		const tournamentName = document.getElementById('tournamentName').value;
		const isValid = validateTournamentName(tournamentName);
		if (isValid) {
			showTournamentView2(tournamentName);
		} else {
			alert('Error: Tournament cannot be created.');
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

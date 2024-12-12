// tournament/tournamentPage.js

import { setupTournamentFlow } from './utils/tournamentFlow.js';
import { fetchEligiblePlayers, generateTournamentName, validateTournamentName } from './services/apiService.js';
import { createTournamentFormHTML } from './templates/createTournamentFormTemplate.js';
import { createTournamentLayoutHTML } from './templates/createTournamentLayoutTemplate.js';
import { setupEligiblePlayersRefresh } from './services/periodicService.js';
import { createNewRoom, joinRoom, waitingPlayer } from "../game/pong/room.js";
import { initializeLobbySocket } from './initializeTournamentGame.js';
import gameVar from '../game/pong/var.js';
import { displayGameView } from '../game/pong/display.js';
import { initializeCanvasPong } from '../game/pong/canvas.js';
import { updateDifficultySelection, updateLevelSelection } from '../game/pong/update.js';
import { initControlLive } from '../game/pong/control.js';
import { getUserInfos } from '../game/getUser.js';
import { sendScoreInfo } from '../game/pong/network.js';
import { getUserInfos2 } from '../game/getUser.js';

let currentTournamentId;

export async function showCreateTournamentForm2()
{
	// initializeJoinSocket();
	const box = document.getElementById('mainContent');
	const randomName = await generateTournamentName();
	box.innerHTML = createTournamentFormHTML(randomName);
	getUserInfos2();

	document.getElementById('createTournament').addEventListener('click', () =>
	{
		showTournamentView2(randomName);
	}); 


	// gameVar.currTournament = randomName;
	
	// const joinTour = document.createElement('div');
	// joinTour.innerHTML = joinTournamentFormHTML(randomName);
	// box.appendChild(joinTour);
	
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

	setupEligiblePlayersRefresh();



	// joinTournament();
}
// export function joinTournament()
// {
// 	// const joinTournament = document.getElementById('joinTournament');
// 	// joinTournament.addEventListener('click', () =>
// 	// {
// 	// 	joinTournamentGame();
// 	// });
// }

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

// Function to join the room with a specific player
function joinRoomWithPlayer(roomName, playerId, callback) {
	// Set the player ID in gameVar (assuming gameVar is a global object)
	gameVar.playerIdx = playerId;

	// Join the room
	joinRoom(roomName);

	// Call the callback function once the room is joined
	callback();
}


function startGameWithPlayers(playerIds) {
	// Step 1: Create a new room
	createNewRoom((roomName) => {
		// Step 2: Join the room with the first player
		joinRoomWithPlayer(roomName, playerIds[0], () => {
			// Step 3: Wait for the second player to join
			//waitingPlayer();

			// Step 4: Join the room with the second player
			joinRoomWithPlayer(roomName, playerIds[1], () => {
				// Both players are now in the room, the game will start automatically
				console.log('Game started with players:', playerIds);
			});
		});
	});
}

export async function showTournamentView(tournamentName) {
	const box = document.getElementById('mainContent');
	box.innerHTML = createTournamentLayoutHTML(tournamentName);

	
	// Call the setup flow directly
	currentTournamentId = await setupTournamentFlow(tournamentName);
	
	// Ensure the playersList element is present in the DOM
	const playersList = document.getElementById('playersList');
	if (!playersList)
	{
		console.error("playersList element is not found in the DOM");
		return;
	}

	// Initialize lobby socket
	initializeLobbySocket();
	// Initialize game variables
	initializeGameVariables('medium', 1); // Set default difficulty and level

	// Start periodic fetching of eligible players
	setupEligiblePlayersRefresh();

	// Add event listener for the start game button
	document.getElementById('startTournamentGameBtn').addEventListener('click', () => {
		// initializeCanvasAndScore();
		startGameWithPlayers2([1, 2]); // Replace with actual player IDs
	});
}

export async function showCreateTournamentForm() {
	const box = document.getElementById('mainContent');
	const randomName = await generateTournamentName();
	tournamentName = randomName;
	box.innerHTML = createTournamentFormHTML(randomName);

	document.getElementById('createTournament').addEventListener('click', () => {
		showTournamentView(randomName);
	}); 
}
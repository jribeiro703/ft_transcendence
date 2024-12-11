// tournament/tournamentPage.js

import { setupTournamentFlow } from './utils/tournamentFlow.js';
import { generateTournamentName, validateTournamentName } from './services/apiService.js';
import { createTournamentFormHTML } from './templates/createTournamentFormTemplate.js';
import { createTournamentLayoutHTML } from './templates/createTournamentLayoutTemplate.js';
import { setupEligiblePlayersRefresh } from './services/periodicService.js';
import { createNewRoom, joinRoom, waitingPlayer } from "../game/pong/room.js";
import { initializeLobbySocket } from './initializeTournamentGame.js';
import gameVar from '../game/pong/var.js';
import { displayGameView } from '../game/pong/display.js';
import { initializeCanvasPong } from '../game/pong/canvas.js';
import { showGameRoom } from '../game/pong/gameView.js';
import { updateDifficultySelection, updateLevelSelection } from '../game/pong/update.js';
import { initControlLive } from '../game/pong/control.js';

let currentTournamentId;
let tournamentName;

export async function showCreateTournamentForm() {
	const box = document.getElementById('mainContent');
	const randomName = await generateTournamentName();
	tournamentName = randomName;
	box.innerHTML = createTournamentFormHTML(randomName);

	document.getElementById('createTournament').addEventListener('click', () => {
		showTournamentView(randomName);
	}); 
}


export function joinTournament()
{
	const joinTournament = document.getElementById('joinTournament');
	// console.log("roomname: ", gameVar.roomTour1);
	joinTournament.addEventListener('click', () =>
	{
		joinTournamentGame();
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
	gameVar.liveMatch = true;
	// Initialize game variables
	// initializeGameVariables('medium', 1); // Set default difficulty and level

	// Start periodic fetching of eligible players
	setupEligiblePlayersRefresh();

	// Add event listener for the start game button
	document.getElementById('startTournamentGameBtn').addEventListener('click', () => {
		// initializeCanvasAndScore();
		startGameWithPlayers([1, 2]); // Replace with actual player IDs
	});
	// console.log("roomname: ", gameVar.roomTour1);
	joinTournament();
}

// Call this function to start the periodic fetching
setupEligiblePlayersRefresh();

// Function to start the game with two player IDs
function startGameWithPlayers(playerIds) {
	// Step 1: Create a new room
	// createNewRoom((roomName) => {
	// 	// Step 2: Join the room with the first player
	// 	joinRoomWithPlayer(roomName, playerIds[0], () => {
	// 		// Step 3: Wait for the second player to join
	// 		//waitingPlayer();

	// 		// Step 4: Join the room with the second player
	// 		joinRoomWithPlayer(roomName, playerIds[1], () => {
	// 			// Both players are now in the room, the game will start automatically
	// 			console.log('Game started with players:', playerIds);
	// 		});
	// 	});
	// });
	createTournamentGame();
}

export function joinTournamentGame()
{
	gameVar.playerIdx = 2;
	gameVar.tournament = true;
	updateDifficultySelection('medium');
	updateLevelSelection('classicPong');
	initControlLive();
	displayGameView();
	initializeCanvasPong();
	joinRoom(gameVar.roomTour1);
}


export function createTournamentGame()
{
	gameVar.playerIdx = 1;
	gameVar.tournament = true;
	updateDifficultySelection('medium');
	updateLevelSelection('classicPong');
	initControlLive();
	displayGameView();
	initializeCanvasPong();
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

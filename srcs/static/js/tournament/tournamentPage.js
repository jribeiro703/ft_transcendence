// tournament/tournamentPage.js

import { setupTournamentFlow } from './utils/tournamentFlow.js';
import { generateTournamentName, validateTournamentName } from './services/apiService.js';
import { createTournamentFormHTML } from './templates/createTournamentFormTemplate.js';
import { createTournamentLayoutHTML } from './templates/createTournamentLayoutTemplate.js';
import { setupEligiblePlayersRefresh } from './services/periodicService.js';
import { createNewRoom, joinRoom, waitingPlayer } from "../game/pong/room.js";
import { initializeCanvasAndScore,  initializeLobbySocket, initializeGameVariables } from './initializeTournamentGame.js';

let currentTournamentId;

export async function showCreateTournamentForm() {
	const box = document.getElementById('mainContent');
	const randomName = await generateTournamentName();
	box.innerHTML = createTournamentFormHTML(randomName);

	document.getElementById('createTournamentForm').addEventListener('submit', async function(event) {
		event.preventDefault();
		const tournamentName = document.getElementById('tournamentName').value;
		const isValid = await validateTournamentName(tournamentName);
		if (isValid) {
			await showTournamentView(tournamentName);
		} else {
			alert('Tournament name must be between 3 and 30 characters.');
		}
	});
}

export async function showTournamentView(tournamentName) {
	const box = document.getElementById('mainContent');
	box.innerHTML = createTournamentLayoutHTML(tournamentName);

	
	// Call the setup flow directly
	currentTournamentId = await setupTournamentFlow(tournamentName);
	
	// Ensure the playersList element is present in the DOM
	const playersList = document.getElementById('playersList');
	if (!playersList) {
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
		initializeCanvasAndScore();
		startGameWithPlayers([1, 2]); // Replace with actual player IDs
	});
}

// Call this function to start the periodic fetching
setupEligiblePlayersRefresh();

// Function to start the game with two player IDs
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

// Function to join the room with a specific player
function joinRoomWithPlayer(roomName, playerId, callback) {
	// Set the player ID in gameVar (assuming gameVar is a global object)
	gameVar.playerIdx = playerId;

	// Join the room
	joinRoom(roomName);

	// Call the callback function once the room is joined
	callback();
}

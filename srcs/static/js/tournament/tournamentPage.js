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
			alert('Error: Tournament cannot be created.');
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

	 // Add event listener for the render bracket button
	 document.getElementById('renderBracketBtn').addEventListener('click', async () => {
		const players = await fetchCurrentPlayers(currentTournamentId);
		if (players.length >= 4) {
			renderTournamentBracket(currentTournamentId);
		} else {
			alert('Not enough players to render the bracket. Minimum 4 players required.');
		}
	});

 // Add event listener for the match players button
	document.getElementById('matchPlayersBtn').addEventListener('click', async () => {
		// Implement match players logic here
		const players = await fetchCurrentPlayers(currentTournamentId);
		if (players.length >= 4) {
			// Perform matchmaking logic here
			console.log('Players matched.');
		} else {
			alert('Not enough players to match. Minimum 4 players required.');
		}

	});

	// Add event listener for the start game button
	document.getElementById('startTournamentBtn').addEventListener('click', () => {
		initializeCanvasAndScore();
		startGameWithPlayers([1, 2]); // Replace with actual player IDs
	});
}

// Call this function to start the periodic fetching
setupEligiblePlayersRefresh();


// Function to start the game with two player IDs
function startGameWithPlayers(playerIds) {
	// Simulate creating a room and joining the first player
	createNewRoom((name) => {
		roomName = name;
		console.log(`Room created and Player 1 joined: ${roomName}`);
		// Now, wait for the second player to join
	});
}

// Simulate the second player joining the room
function joinAsSecondPlayer(roomName) {
	gameVar.playerIdx = 2; // Set the player index to 2 for the second player
	joinRoom(roomName, () => {
		console.log(`Player 2 joined room: ${roomName}`);
		// Update player ready state
		sendPlayerData(gameVar.gameSocket, true);
		console.log('Player 2 ready state sent.');
		// Simulate starting the game
		startLiveGame();
	});
}
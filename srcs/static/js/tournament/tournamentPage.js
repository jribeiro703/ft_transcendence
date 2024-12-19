// tournament/tournamentPage.js

import { setupTournamentFlow } from './utils/tournamentFlow.js';

import { fetchPlayers, generateTournamentName, validateTournamentName, fetchTournamentBracket, fetchUserTournaments } from './services/apiService.js';
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
import { getUserInfos } from '../game/getUser.js';
import { sendScoreInfo, sendTournamentInfo } from '../game/pong/network.js';
import { getUserInfos2 } from '../game/getUser.js';
import { fetchAuthData } from '../user/fetchData.js';

let currentTournamentId;

export async function setupTournamentPage() {

	console.log("[setupTournamentPage] Initializing tournament page setup");
	const box = document.getElementById('mainContent');
	let randomName = "";
	randomName = await generateTournamentName();
	console.log("[setupTournamentPage] Generated tournament name:", randomName);
	box.innerHTML = createTournamentFormHTML(randomName);
	getUserInfos2();
	console.log(">>>>>>>userName : ", gameVar.userName);

	document.getElementById('createTournamentBtn').addEventListener('click', () => {
		const tournamentName = document.getElementById('tournamentName').value;
		const isValid = validateTournamentName(tournamentName);
		console.log("[setupTournamentPage] Tournament name validation result:", isValid);
		if (isValid) {
			console.log("[setupTournamentPage] Creating tournament with name:", tournamentName);
			showTournamentView2(tournamentName, null, true);
		} else {
			alert('Error: Tournament cannot be created.');
		}
	});
	const tournaments = await fetchUserTournaments();
	const tournamentList = document.getElementById("tournament-list");
	if (tournaments && tournaments.length > 0) {
		tournamentList.innerHTML = tournaments
			.map(
				(tournament) => `
				<li>
					<span>ID: ${tournament.id}</span> - 
					<span>Name: ${tournament.name}</span>
				</li>`
			)
			.join("");
	} else {
		tournamentList.innerHTML = `<p>You are not part of any upcoming tournaments.</p>`;
	}
	document.getElementById('joinTournamentBtn').addEventListener('click', async () => {
		const tournamentId = document.getElementById('joinTournamentId').value;
		if (!tournamentId) {
			alert("Tournament ID is required!");
			return;
		}
		try {
			console.log("[setupTournamentPage] Fetching user details");
			const userResponse = await fetchAuthData('/user/private/');
			if (userResponse.status !== 200) {
				throw new Error("Failed to fetch user details");
			}
			const userData = userResponse.data;
			const userId = userData.id;
			console.log("[setupTournamentPage] User details fetched:", userData);
			const data = await joinTournament(tournamentId, userId);
			const isCreator = data.is_creator;
			if (data.already_in_tournament) {
				alert(`Welcome back to Tournament: ${data.tournament_name}`);
			} else {
				alert(`Successfully joined Tournament: ${data.tournament_name}`);
			}
			showTournamentView2(data.tournament_name, tournamentId, false);
			const lockButton = document.getElementById('lockTournamentBtn');
			const generateMatchesButton = document.getElementById('generateMatches');
			const startButton = document.getElementById('startTournamentBtn');

			if (lockButton) lockButton.style.display = 'none';
			if (generateMatchesButton) generateMatchesButton.style.display = 'none';
			if (startButton) startButton.style.display = 'none';
			updatePlayersList(data.players);

		} catch (error) {
			console.error("[setupTournamentPage] Error joining tournament:", error);
			alert(`Error: ${error.message}`);
		}
	});
}

export async function showTournamentView2(tournamentName, tournamentId, isCreator) {
	console.log("[showTournamentView2] Showing tournament view");
	const box = document.getElementById('mainContent');
	box.innerHTML = createTournamentLayoutHTML(tournamentName);
	console.log("[showTournamentView2] tournamentName:", tournamentName);
	console.log("[showTournamentView2] tournamentId:", tournamentId);
	console.log("[showTournamentView2] isCreator:", isCreator);
	if (gameVar.tournamentArray) {
		updateTournamentsList(gameVar.tournamentArray);
	}
	if (isCreator) {
		currentTournamentId = await setupTournamentFlow(tournamentName, null, isCreator);
	} else {
		currentTournamentId = await setupTournamentFlow(tournamentName, tournamentId, isCreator);
		currentTournamentId = tournamentId;
	}
	if (typeof currentTournamentId == 'undefined') {
		console.warn("[showTournamentView2] currentTournamentId is undefined");
		return;
	}
	console.log("[showTournamentView2] currentTournamentId:", currentTournamentId);
	const playersList = document.getElementById('playersList');
	if (!playersList) {
		console.error("[showTournamentView2] playersList element is not found in the DOM");
		return;
	}
	initializeLobbySocket();
	gameVar.liveMatch = true;
	if (typeof currentTournamentId !== 'undefined') {
		if (!isCreator) {
			try {
				const bracket = await fetchTournamentBracket(currentTournamentId);
				console.log("[showTournamentView2] Fetched bracket:", bracket);
				renderBracket(bracket, currentTournamentId);
			} catch (error) {
				console.error("[showTournamentView2] Error fetching tournament bracket:", error);
			}
		} else {
			document.getElementById('generateMatches').addEventListener('click', async () => {
				const bracket = await fetchTournamentBracket(currentTournamentId);
				console.log("[showTournamentView2] Fetched bracket:", bracket);
				renderBracket(bracket, currentTournamentId);
			});
		}
	}
	setupEligiblePlayersRefresh();
}

export function startGameWithPlayers2(player1id, player2id, currentPlayer) {
	console.log("[startGameWithPlayers2] Starting game with players:", player1id, player2id, currentPlayer);
	const playerIdx = (currentPlayer === player1id) ? 1 : 2;

	gameVar.playerIdx = playerIdx;
	console.log(playerIdx);
	gameVar.tournament = true;
	gameVar.opponentName = player2id;
	gameVar.game = 'pong';

	console.log("gameVar.game: ", gameVar.game);

	if (playerIdx === 1) {
		createTournamentGame();
	} else {
		joinTournamentGame();
	}
}

export async function joinTournamentGame() {
	console.log("[joinTournamentGame] Joining tournament game");
	gameVar.playerIdx = 2;
	gameVar.tournament = true;
	gameVar.playerReady = true;
	displayGameView();
	await initializeCanvasPong();
	initControlLive();
	console.log("Joining room with ID:", gameVar.roomTour1);
	console.log("ready 2:", gameVar.playerReady);
	joinRoom(gameVar.roomTour1);
}

export async function createTournamentGame() {
	console.log("[createTournamentGame] Creating tournament game");
	gameVar.tournament = true;
	updateDifficultySelection('medium');
	updateLevelSelection('classicPong');
	initControlLive();
	displayGameView();
	await initializeCanvasPong();
	createNewRoom();
	console.log("[createTournamentGame] Created room with ID:", gameVar.roomTour1);
}

function updateTournamentsList(tournaments) {
	console.log("[updateTournamentsList] Updating tournaments list:", tournaments);
	gameVar.tournamentArray = tournaments;

	const tournamentList = document.getElementById('tournament-list');
	if (!tournamentList) return;

	tournamentList.innerHTML = '';

	tournaments.forEach(tournament => {
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

export async function joinTournament(tournamentId, userId) {
	console.log("[joinTournament] Joining tournament with ID:", tournamentId, "and user ID:", userId);
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
	console.log("[joinTournament] Response data:", data);
	if (!response.ok) {
		throw new Error(data.error || "Unable to join the tournament.");
	}

	return data;
}

function updatePlayersList(players) {
	console.log("[updatePlayersList] Updating players list:", players);
	const playersList = document.getElementById("playersList");
	if (playersList) {
		playersList.innerHTML = players
			.map(player => `<span class="online-players">✅ ${player.username}</span>`)
			.join('');
	}
}

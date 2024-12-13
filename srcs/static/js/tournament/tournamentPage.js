// tournament/tournamentPage.js

import { setupTournamentFlow } from './utils/tournamentFlow.js';

import { fetchEligiblePlayers, generateTournamentName, validateTournamentName } from './services/apiService.js';
import { setupEligiblePlayersRefresh } from './services/periodicService.js';

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

const sampleNotifications = [

 	{ id: 1, name: "Champions League", host: "boty", type: "invite", startTime: new Date(Date.now() + 600000) },
	{ id: 2, name: "Friendly Tournament", host: "fumo", type: "invite", startTime: new Date(Date.now() + 1200000) },
	{ id: 3, name: "Global Championship", host: "yabing", type: "join", startTime: new Date(Date.now() + 1800000) },
	{ id: 4, name: "Regional Qualifiers", host: "latha", type: "join", startTime: new Date(Date.now() + 300000) }

];

export async function setupTournamentPage(userState = { 
	tournaments: sampleNotifications 
})
{
	const box = document.getElementById('mainContent');
	let randomName ="";
	console.log("userState.tournaments=", userState.tournaments);
	console.log("userState.tournaments.length=", userState.tournaments.length);
	if (userState.tournaments.length == 0) {
		randomName = await generateTournamentName();
	}
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

	const createButton = document.getElementById('createTournament');
	const tournamentNameText = document.getElementById('tournamentName');
	userState.tournaments.sort((a, b) => b.startTime - a.startTime);

	// Populate tournaments and invitations
	if (userState.tournaments.length > 0) {
		createButton.disabled = true;
		tournamentNameText.disabled = true;
		const message = document.createElement('p');
    		message.className = 'info-message';
    		message.textContent = "You cannot create a tournament while having pending invites.";
    		createButton.parentElement.appendChild(message);
		tournamentsList.innerHTML = userState.tournaments.map(
			(tournament) => {
				const minutesToStart = Math.ceil((tournament.startTime - Date.now()) / 60000);
				return `
					<div class="tournament-item">
						<div class="tournament-row">
							<div class="tournament-name">
								<strong>${tournament.name}</strong> - Hosted by ${tournament.host} 
								<span>(Starts in ${minutesToStart} minutes)</span>
							</div>
							<div class="tournament-actions">
								${tournament.type === "invite" ? `<button class="btn acceptInvite" data-id="${tournament.id}">Accept</button>` : ''}
								${tournament.type === "invite" ? `<button class="btn rejectInvite" data-id="${tournament.id}">Reject</button>` : ''}
								${tournament.type === "join" ? `<button class="btn joinTournament" data-id="${tournament.id}">Join</button>` : ''}
							</div>
						</div>
					</div>
				`;
				}).join('');
	} else {
		createButton.disabled = false;
		createButton.title = "";
		tournamentsList.innerHTML = '<p>No tournaments or invitations available.</p>';
	}

	document.querySelectorAll('.acceptInvite').forEach(button => {
		button.addEventListener('click', (event) => {
			const inviteId = event.target.dataset.id;
			alert(`Accepted invite with ID: ${inviteId}`);
			// Handle accept logic here
		});
	});

	document.querySelectorAll('.rejectInvite').forEach(button => {
		button.addEventListener('click', (event) => {
			const inviteId = event.target.dataset.id;
			alert(`Rejected invite with ID: ${inviteId}`);
			// Handle reject logic here
		});
	});

	document.querySelectorAll('.joinTournament').forEach(button => {
		button.addEventListener('click', (event) => {
			const tournamentId = event.target.dataset.id;
			alert(`Joined tournament with ID: ${tournamentId}`);
			// Handle join logic here
		});
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

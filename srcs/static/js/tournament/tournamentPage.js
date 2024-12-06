import { setupTournamentFlow, createTournament, fetchEligiblePlayers, performMatchmaking, fetchTournamentBracket, setupTournamentBracketRefresh, fetchTournamentBracketPeriodically } from "./services/tournamentAPIService.js";
import { generateTournamentName, validateTournamentName } from "./services/tournamentAPIService.js";
import { fetchCurrentPlayers } from "./services/tournamentAPIService.js";

import { createTournamentFormHTML } from "./templates/createTournamentFormTemplate.js";
import { createTournamentLayoutHTML } from "./templates/createTournamentLayoutTemplate.js";

import { getFriendsList } from "./handlers/tournamentWebSocketHandler.js";

let eligiblePlayersInterval;
let bracketInterval;
let bracketSocket;
let currentTournamentId;

function fetchEligiblePlayersPeriodically() {
    fetchEligiblePlayers().then(data => {
        const playersList = document.getElementById('playersList');
        if (playersList) {
            playersList.innerHTML = '';
            if (data.length === 0) {
                playersList.textContent = "No players online.";
            } else {
                const onlinePlayers = data.map(player => player.username).join(', ');
                playersList.innerHTML = `<span class="online-players">${onlinePlayers} are online</span>`;
            }
        } else {
            console.error("playersList is null");
        }

        // Fetch and update the tournament bracket
        if (currentTournamentId) {
            fetchTournamentBracketPeriodically(currentTournamentId);
        }
    }).catch(error => console.error('Error fetching eligible players:', error));
}

function setupEligiblePlayersRefresh() {
    fetchEligiblePlayersPeriodically(); // Initial fetch
    eligiblePlayersInterval = setInterval(fetchEligiblePlayersPeriodically, 10000); // Fetch every 10 seconds
}

// WebSocket setup for user status
const statusSocket = new WebSocket(
    'ws://' + window.location.host + '/ws/user-status/'
);

statusSocket.onmessage = function(event) {
    const data = JSON.parse(event.data);
    if (data.action === 'update_status') {
        fetchEligiblePlayersPeriodically(); // Refresh the list of online players
        if (currentTournamentId) {
            fetchTournamentBracketPeriodically(currentTournamentId); // Refresh the tournament bracket
        }
    }
};

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
    if (currentTournamentId) {
        // Establish WebSocket connection for tournament bracket
        bracketSocket = new WebSocket(
            "wss://" + window.location.host + "/ws/tournament/"
        );

        bracketSocket.onopen = function () {
            console.log("WebSocket connection established for tournament bracket");
        };

        bracketSocket.onmessage = function (event) {
            console.log("Message received from server for tournament bracket:", event.data);
            try {
                const data = JSON.parse(event.data);
                if (data.action === "update_bracket") {
                    renderBracket(data.bracket, currentTournamentId);
                } else if (data.error) {
                    console.error("Error from server:", data.error);
                } else {
                    console.warn("Unexpected action:", data);
                }
            } catch (e) {
                console.error("Failed to process message:", e);
            }
        };

        bracketSocket.onerror = function (error) {
            console.error("WebSocket error for tournament bracket:", error);
        };

        bracketSocket.onclose = function () {
            console.log("WebSocket connection closed for tournament bracket");
        };

        // Fetch and render the tournament bracket
        const bracket = await fetchTournamentBracket(currentTournamentId);
        renderBracket(bracket, currentTournamentId);

        // Fetch and render the current players
        const players = await fetchCurrentPlayers(currentTournamentId);
        const playersContainer = document.getElementById('current-players');
        playersContainer.innerHTML = players.map(player => `<div>${player.username}</div>`).join('');

        // Fetch and render the friends list
        getFriendsList(currentTournamentId);

        // Start periodic fetching of the tournament bracket
        setupTournamentBracketRefresh(currentTournamentId);
    }

    // Start periodic fetching of eligible players
    setupEligiblePlayersRefresh();
}

// Function to render the bracket
function renderBracket(bracket, tournamentId) {
    const bracketContainer = document.getElementById('tournament-bracket');
    if (bracketContainer) {
        bracketContainer.innerHTML = ''; // Clear existing content

        bracket.forEach((match, index) => {
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

            // Add a connector line if it's not the last match
            if (index < bracket.length - 1) {
                const connector = document.createElement('div');
                connector.className = 'connector d-flex justify-content-center align-items-center';
                connector.innerHTML = `
                    <span class="line"></span>
                `;
                bracketContainer.appendChild(connector);
            }
        });
    } else {
        console.error("Bracket container is null");
    }
}

// Call this function to start the periodic fetching
setupEligiblePlayersRefresh();

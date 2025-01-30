// tournoi/tournamentLayout.js

import gameVar from "../game/pong/var.js";
import { createTournamentLayoutHTML } from './templates/createTournamentLayoutTemplate.js';
import { fetchAuthData } from "../user/fetchData.js";
import { isTournamentPage, renderPageGame } from "../game/HistoryManager.js";
import { clearPongVar } from '../game/pong/reset.js';

let currentMatchId = null;
let playNextMatchButton = null;

export async function displayTournamentLayout(tournamentId) {
    const box = document.getElementById('mainContent');
    try {
        const response = await fetchAuthData(`/tournament/${tournamentId}/`, "GET");
        console.log(".... Response:", response.data);
        if (response.status === 200 && response.data) {
            box.innerHTML = createTournamentLayoutHTML();
            currentMatchId = response.data.current_match;
            renderBracket(response.data.matches, currentMatchId);
            
            playNextMatchButton = document.getElementById('play-next-match');
            playNextMatchButton.disabled = false;
            playNextMatchButton.style.border = "5px solid blue"; 
            playNextMatchButton.textContent = "Play This Match";

            playNextMatchButton.addEventListener('click', () => {
                playNextMatchButton.disabled = true;
                playNextMatchButton.style.border = "5px solid red";
                playNextMatchButton.textContent = "Starting match...";

                console.log("....currentMatchId", currentMatchId);
                launchNextMatch(tournamentId, response.data);
            });

            document.getElementById("delete-tournament-btn").addEventListener('click', () => {
                deleteTournament(tournamentId);
            });

        } else {
            console.warn("[displayTournamentLayout] Failed to load tournament layout. Status:", response.status);
        }
    } catch (error) {
        console.error("[displayTournamentLayout] Error loading tournament layout:", error);
    }
}

function getNextMatchId(currentMatchId, matches) {
    // Logic to get the next match ID based on the current match ID and matches array
    const currentIndex = matches.findIndex(match => match.match_id === currentMatchId);
    if (currentIndex !== -1 && currentIndex < matches.length - 1) {
        return matches[currentIndex + 1].match_id;
    }
    return currentMatchId; // Return the same ID if no next match is found
}

function renderBracket(matches, currentMatchId) {
    const bracketContainer = document.getElementById('tournament-bracket');

    bracketContainer.innerHTML = matches.map(match => {
        const isCurrentMatch = match.match_id === currentMatchId;
        const player1Winner = match.score_one > match.score_two;
        const player2Winner = match.score_two > match.score_one;

        return `
            <p> match.match_id: ${match.match_id} </p>
            <div class="matchup ${isCurrentMatch ? 'highlight-current' : ''}" data-match-id="${match.match_id}">
                <div class="player ${player1Winner ? 'winner' : ''}">
                    ${match.player1 || 'TBD'} ${player1Winner ? '🏆' : ''}
                </div>
                <div class="vs">vs</div>
                <div class="player ${player2Winner ? 'winner' : ''}">
                    ${match.player2 || 'TBD'} ${player2Winner ? '🏆' : ''}
                </div>
                <div class="scores">
                    ${match.score_one || 0} - ${match.score_two || 0}
                </div>
            </div>

        `;
    }).join('');
}

async function launchNextMatch(tournamentId, data) {
    console.log("[launchNextMatch] Starting...");

    if (!currentMatchId) {
        return console.error("[launchNextMatch] No match ID provided");
    }

    const currentMatch = data.matches.find(match => match.match_id === currentMatchId);

    if (!currentMatch) {
        return console.error("[launchNextMatch] Current match not found in matches array");
    }

    // Launch the game first
    launchGame(currentMatch.player1, currentMatch.player2);

    // Wait for the game to finish
    const intervalId = setInterval(async () => {
        if (gameVar.matchOver) {
            clearInterval(intervalId);

            // Update the match scores after the game is finished
            const payload = {
                matchId: currentMatchId,
                score_one: gameVar.playerScore,
                score_two: gameVar.aiScore,
            };

            console.log("[launchNextMatch] Payload:", payload);

            try {
                const response = await fetchAuthData(`/tournament/next/${tournamentId}/`, "POST", payload);

                if (response.status === 200) {
                    console.log("[launchNextMatch] Match score updated successfully");

                    playNextMatchButton.disabled = false;
                    playNextMatchButton.style.border = "5px solid blue";
                    playNextMatchButton.textContent = "Play Next Match";

                    // Update the match data and re-fetch the tournament data
                    const updatedResponse = await fetchAuthData(`/tournament/${tournamentId}/`, "GET");
                    if (updatedResponse.status === 200 && updatedResponse.data) {
                        data = updatedResponse.data;
                        currentMatchId = getNextMatchId(currentMatchId, data.matches);
                        renderBracket(data.matches, currentMatchId);

                        if (currentMatchId === data.matches[data.matches.length - 1].match_id) {
                            playNextMatchButton.disabled = true;
                            playNextMatchButton.textContent = "Tournament Finished";
                            announceWinner(data.winner);
                        }
                    } else {
                        // Set up the event listener for the next match
                        playNextMatchButton.addEventListener('click', () => {
                            playNextMatchButton.disabled = true;
                            playNextMatchButton.style.border = "5px solid red";
                            playNextMatchButton.textContent = "Starting match...";
                            launchNextMatch(tournamentId, data);
                        });
                    }
                } else {
                    console.error("[launchNextMatch] Failed to update match score:", response.data);
                }
            } catch (error) {
                console.error("[launchNextMatch] Error updating match score:", error);
            }
        }
    }, 1000);
}

function launchGame(player1, player2) {
    console.log("[launchGame] Starting...");

    clearPongVar();

    gameVar.matchOver = false;
    gameVar.game = "pong";
    gameVar.localGame = true;
    gameVar.tournament = true;

    gameVar.userName = player1;
    gameVar.opponentName = player2;
    renderPageGame("playTournamentLocal", true);

    playNextMatchButton.disabled = true;
    playNextMatchButton.textContent = "Game In Progress...";
}

function announceWinner(winner) {
    const winnerSection = document.getElementById('winner-section');
    if (winnerSection) {
        winnerSection.innerHTML = `<h2 class="text-center">Winner: ${winner}</h2>`;
    }
}

export async function deleteTournament(tournamentId) {
    try {  
        const deleteTournament = await fetchAuthData(`/tournament/delete/${tournamentId}/`, "DELETE");
        if (deleteTournament.status === 200) {
            console.log("Tournament deleted successfully", tournamentId);
            window.location.href = '/#home'; //TODO: ???
        } else {
            console.error("Failed to delete tournament:", deleteTournament.data);
        }
    } catch (error) {
        console.error("Error deleting tournament:", error);
    }
}
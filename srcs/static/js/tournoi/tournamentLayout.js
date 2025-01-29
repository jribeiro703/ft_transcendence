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

        if (response.status === 200 && response.data) {
            box.innerHTML = createTournamentLayoutHTML();
            currentMatchId = response.data.current_match;
            
            renderBracket(response.data.matches, response.data.current_match);
            
            playNextMatchButton = document.getElementById('play-next-match');
            playNextMatchButton.disabled = false;
            playNextMatchButton.style.border = "5px solid blue"; 
            playNextMatchButton.textContent = "Play This Match";

            playNextMatchButton.addEventListener('click', () => {
                playNextMatchButton.disabled = true;
                console.log("[DEBUG] playNextMatchButton.disabled set to:", playNextMatchButton.disabled);
                playNextMatchButton.style.border = "5px solid red";
                playNextMatchButton.textContent = "Starting match...";

                launchNextMatch(tournamentId, response.data);
            });

            document.getElementById("delete-tournament-btn").addEventListener('click', () => {
                deleteTournament(tournamentId);
            });

            checkIfMatchOver(tournamentId);
        } else {
            console.warn("[displayTournamentLayout] Failed to load tournament layout. Status:", response.status);
        }
    } catch (error) {
        console.error("[displayTournamentLayout] Error loading tournament layout:", error);
    }
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

    if (!data.current_match) {
        return console.error("[launchNextMatch] No match ID provided");
    }

    const currentMatch = data.matches.find(match => match.match_id === data.current_match);

    if (!currentMatch) {
        return console.error("[launchNextMatch] Current match not found in matches array");
    }

    const payload = {
        matchId: data.current_match,
        score_one: gameVar.playerScore,
        score_two: gameVar.aiScore,
    };

    try {
        const response = await fetchAuthData(`/tournament/next/${tournamentId}/`, "POST", payload);

        if (response.status === 200) {
            console.log("[launchNextMatch] Match launched successfully");
            currentMatchId = data.current_match;
            console.log("[launchNextMatch] Updated currentMatchId:", currentMatchId);

            launchGame(currentMatch.player1, currentMatch.player2);

            if (gameVar.matchOver) {
                playNextMatchButton.disabled = true;
                playNextMatchButton.textContent = "Tournament Finished";
                console.log("[launchNextMatch] Tournament finished");

                announceWinner(data.winner);
            } else {
               // displayTournamentLayout(tournamentId);
            }
        } else {
            console.error("[launchNextMatch] Failed to launch match:", response.data);
        }
    } catch (error) {
        console.error("[launchNextMatch] Error launching match:", error);
    }
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

    console.log("[DEBUG] playNextMatchButton fetched in launchGame:", playNextMatchButton);

    playNextMatchButton.disabled = true;
    playNextMatchButton.textContent = "Game In Progress...";
    console.log("[DEBUG] playNextMatchButton.disabled set to true in launchGame:", playNextMatchButton.disabled);

    const intervalId = setInterval(() => {
        console.log("[DEBUG] Checking game over state. gameVar.matchOver:", gameVar.matchOver);
        console.log("[DEBUG] playNextMatchButton.disabled:", playNextMatchButton.disabled);
        
        if (gameVar.matchOver) {
            clearInterval(intervalId);
            playNextMatchButton.disabled = false;
            console.log("[DEBUG] playNextMatchButton re-enabled:", playNextMatchButton.disabled);
        }
    }, 1000);
}

export async function deleteTournament(tournamentId) {
    try {  
        const deleteTournament = await fetchAuthData(`/tournament/delete/${tournamentId}/`, "DELETE");
        if (deleteTournament.status === 200) {
            console.log("Tournament deleted successfully");
        } else {
            console.error("Failed to delete tournament:", deleteTournament.data);
        }
    } catch (error) {
        console.error("Error deleting tournament:", error);
    }
}

function checkIfMatchOver(tournamentId = null) {

    // Periodically check if the match is over
    const intervalId = setInterval(() => {
        const currentPage = window.location.hash || '';
        if (tournamentId && !isTournamentPage(currentPage))
        {
            deleteTournament(tournamentId);
            clearInterval(intervalId);
        }
        console.log("[checkIfMatchOver] Checking match state... gameVar.matchOver:", gameVar.matchOver);

        // Handle game start
        if (gameVar.gameStart) {
            console.log("[checkIfMatchOver] Game has started! Updating button state.");
            if (playNextMatchButton) {
                playNextMatchButton.style.border = "5px solid orange"; // Indicate game is in progress
                playNextMatchButton.disabled = true; // Disable the button during the game
                playNextMatchButton.textContent = "Game In Progress...";
            }
        }
    
        if (gameVar.matchOver) {
            console.log("[checkIfMatchOver] Match is over! Re-enabling button.");
            console.log("gameVar.player1Score", gameVar.playerScore);
            console.log("gameVar.player2Score", gameVar.aiScore);
            gameVar.rematchBtn.style.display = 'none';
            gameVar.quitGameBtn.style.display = 'none';
            if (playNextMatchButton) {
                playNextMatchButton.style.border = "5px solid green";
                playNextMatchButton.disabled = false;
                playNextMatchButton.textContent = "Play Next Match";
            }
            clearInterval(intervalId); // Clear the interval
        }
    }, 1000);
}

function announceWinner(winner) {
    const winnerSection = document.getElementById('winner-section');
    if (winnerSection) {
        winnerSection.innerHTML = `<h2 class="text-center">Winner: ${winner}</h2>`;
    }
}

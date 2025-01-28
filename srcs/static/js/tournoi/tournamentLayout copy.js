// tournoi/tournamnetLayout.js

import gameVar from "../game/pong/var.js";
import { createTournamentLayoutHTML } from './templates/createTournamentLayoutTemplate.js';
import { fetchAuthData } from "../user/fetchData.js";
import { renderPageGame } from "../game/HistoryManager.js";
import { clearPongVar } from '../game/pong/reset.js';

let currentMatchId = null;

export async function displayTournamentLayout(tournamentId) {
    const box = document.getElementById('mainContent');
    try {
        const response = await fetchAuthData(`/tournament/${tournamentId}/`, "GET");
        if (response.status === 200 && response.data) {
            box.innerHTML = createTournamentLayoutHTML();
            console.log("...Tournament layout created...");
            currentMatchId = response.data.current_match;

            renderBracket(response.data.matches, response.data.current_match);

            const playNextMatchButton = document.getElementById('play-next-match');
            playNextMatchButton.disabled = false;
            console.log("...playNextMatchButton active...");
            
            // TODO: BUG: What if the button is pressed 4th time? The tournament finishes in 3 matches
            document.getElementById('play-next-match').addEventListener('click', () => {
                const playNextMatchButton = document.getElementById('play-next-match');
                playNextMatchButton.disabled  = true;
                console.log("...playNextMatchButton disabled...");
                console.log("...Launching next match...");
                console.log("...Tournament ID:", tournamentId);
                console.log("...Response data:", response.data);
                console .log("...Current match:", response.data.current_match);
                launchNextMatch(tournamentId, response.data);
                checkIfMatchOver();

                
            });
        } else {
            console.warn("Failed to load tournament layout. Status:", response.status);
        }
    } catch (error) {
        console.error("Error loading tournament layout:", error);
    }
}

function renderBracket(matches, currentMatchId) {
    const bracketContainer = document.getElementById('tournament-bracket');
    console.log("matches", matches);
    console.log("currentMatchId", currentMatchId);
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
        })
        .join('');
}

async function launchNextMatch(tournamentId, data) {
    if (!data.current_match) return console.error("No match ID provided");

    const currentMatch = data.matches.find(match => match.match_id === data.current_match);
    if (!currentMatch) return console.error("Current match not found in matches array");

    const payload = {
        matchId: data.current_match,
        score_one: gameVar.playerScore,
        score_two: gameVar.aiScore,
    };
    console.log(`[launchNextMatch] Launching match ${data.current_match} for tournament ${tournamentId}`);

    try {
        const response = await fetchAuthData(`/tournament/next/${tournamentId}/`, "POST", payload);
        if (response.status === 200) {
            console.log("Match launched successfully");
            currentMatchId = data.current_match;
            console.log("Updated currentMatchId:", currentMatchId);
            launchGame(currentMatch.player1, currentMatch.player2);
            if (data.status === "finished") {
                const playNextMatchButton = document.getElementById('play-next-match');
                playNextMatchButton.disabled = true;
                playNextMatchButton.textContent = "Tournament Finished";
                announceWinner(data.winner);
            } else {
                displayTournamentLayout(tournamentId);
            }
        } else {
            console.error("Failed to launch match:", response.data);
        }
    } catch (error) {
        console.error("Error launching match:", error);
    }
}

function launchGame(player1, player2) {
    console.log("[launchGame] Preparing game launch...");

    clearPongVar();
    gameVar.matchOver = false;
    gameVar.game = "pong";
    gameVar.localGame = true;
    gameVar.tournament = true;
    gameVar.userName = player1;
    gameVar.opponentName = player2;

    renderPageGame("playPongLocal", true);
    console.log("[launchGame] Game launched successfully.");

    const playNextMatchButton = document.getElementById('play-next-match');
    playNextMatchButton.disabled = true;

    // Clear any existing intervals
    if (gameVar.checkGameOverInterval) {
        clearInterval(gameVar.checkGameOverInterval);
    }

    // Start checking when the game is finished
    gameVar.checkGameOverInterval = setInterval(() => {
        if (gameVar.matchOver) {
            console.log("[launchGame] Game finished!");
            clearInterval(gameVar.checkGameOverInterval);

            // Re-enable the button when the game ends
            if (playNextMatchButton) {
                playNextMatchButton.disabled = false;
            }
        }
    }, 1000);
}

function announceWinner(winnerName) {
    const winnerSection = document.createElement('div');
    winnerSection.id = 'winner-section';
    winnerSection.innerHTML = `
        <div class="winner-banner">
            <h2>🏆 Congratulations to the Winner! 🏆</h2>
            <h3>${winnerName}</h3>
        </div>
    `;
    const bracketContainer = document.getElementById('tournament-bracket-section');
    bracketContainer.insertAdjacentElement('afterend', winnerSection);
}


function checkIfMatchOver() {
    // Periodically check if the match is over
    const intervalId = setInterval(() => {
        console.log("[checkIfMatchOver] Checking match state... gameVar.matchOver:", gameVar.matchOver);

        if (gameVar.matchOver) {
            console.log("[checkIfMatchOver] Match is over! Re-enabling button.");
            console.log("Match is over");
            console.log("gameVar.player1Score", gameVar.playerScore);
            console.log("gameVar.player2Score", gameVar.aiScore);
            gameVar.rematchBtn.style.display = 'none';
            gameVar.quitGameBtn.style.display = 'none';
            const playNextMatchButton = document.getElementById('play-next-match');
            if (playNextMatchButton) {
                playNextMatchButton.disabled = false;
            }
            clearInterval(intervalId);
        }
    }, 1000);
}
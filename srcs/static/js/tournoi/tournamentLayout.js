// tournoi/tournamnetLayout.js

import { createTournamentLayoutHTML } from './templates/createTournamentLayoutTemplate.js';
import { fetchAuthData } from "../user/fetchData.js";
import gameVar from "../game/pong/var.js";
import { renderPageGame } from "../game/HistoryManager.js";
import { clearPongVar } from '../game/pong/reset.js';

export async function displayTournamentLayout(tournamentId) {
    const box = document.getElementById('mainContent');
    try {
        const response = await fetchAuthData(`/tournament/${tournamentId}/`, "GET");
        if (response.status === 200 && response.data) {
            box.innerHTML = createTournamentLayoutHTML();

            renderBracket(response.data.matches);

            const playNextMatchButton = document.getElementById('play-next-match');
            playNextMatchButton.disabled = false;
            console.log("...playNextMatchButton disabled...");
            

            // TODO: BUG: What if the button is pressed 4th time? The tournament finishes in 3 matches
            document.getElementById('play-next-match').addEventListener('click', () => {
                playNextMatchButton.disabled = true;
                console.log("...Launching next match...");
                console.log("...Tournament ID:", tournamentId);
                console.log("...Response data:", response.data);
                console .log("...Current match:", response.data.current_match);
                launchNextMatch(tournamentId, response.data);

            });
            // Periodically check if the match is over
            const intervalId = setInterval(() => {
                // TODO: if the score is >= 11 and if the gap score is >= 2 , but actually it s score >= 4 for debug
                if (gameVar.matchOver) {
                    console.log("Match is over");
                    // gameVar.rematchBtn.style.display = 'none';
                    // gameVar.quitGameBtn.style.display = 'none';`
                    clearInterval(intervalId);
                    playNextMatchButton.disabled = false;
                }
            }, 1000); // Check every second
        } else {
            console.warn("Failed to load tournament layout. Status:", response.status);
        }
    } catch (error) {
        console.error("Error loading tournament layout:", error);
    }
}

function renderBracket(matches) {
    const bracketContainer = document.getElementById('tournament-bracket');
    bracketContainer.innerHTML = matches.map(match => `
        <div class="matchup">
            <div class="player">${match.player1 || 'TBD'}</div>
            <div class="vs">vs</div>
            <div class="player">${match.player2 || 'TBD'}</div>
            <div class="scores">${match.score_player1 || 0} - ${match.score_player2 || 0}</div>
        </div>
    `).join('');
}

async function launchNextMatch(tournamentId, data) {
    if (!data.current_match) return console.error("No match ID provided");

    const currentMatch = data.matches.find(match => match.match_id === data.current_match);
    if (!currentMatch) return console.error("Current match not found in matches array");

    const payload = { matchId: data.current_match, score_one: 0, score_two: 0 };
    console.log(`[launchNextMatch] Launching match ${data.current_match} for tournament ${tournamentId}`);

    try {
        const response = await fetchAuthData(`/tournament/next/${tournamentId}/`, "POST", payload);
        if (response.status === 200) {
            console.log("Match launched successfully");
            displayTournamentArena();

            // Launch Play Local game
            launchGame(currentMatch.player1, currentMatch.player2);
            if (data.status === "finished") {
                const playNextMatchButton = document.getElementById('play-next-match');
                playNextMatchButton.disabled = true;
                playNextMatchButton.textContent = "Tournament Finished";
                announceWinner(data.winner);
            } else {
                displayTournamentLayout(tournamentId); // Refresh
            }
        } else {
            console.error("Failed to launch match:", response.data);
        }
    } catch (error) {
        console.error("Error launching match:", error);
    }
}

function displayTournamentArena() {
    const matchupSection = document.getElementById('matchup');
    const tournamentViewSection = document.getElementById('tournamentView');

    if (matchupSection) bracketSection.style.display = 'none';
    if (tournamentViewSection) gameViewSection.style.display = 'block';

}

function launchGame(player1, player2) {
    console.log("[launchGame] Preparing game launch...");

    clearPongVar();
    gameVar.game = "pong";
    gameVar.localGame = true;
    gameVar.tournament = true;
    gameVar.userName = player1;
    gameVar.opponentName = player2;

    // Render the game
    renderPageGame("playPongLocal", true);
    console.log("[launchGame] Game launched successfully.");
}

function updateWinnerInBracket(matchId, winnerName) {
    const matchElement = document.querySelector(`[data-match-id="${matchId}"]`);
    if (matchElement) {
        const winnerElement = matchElement.querySelector('.winner');
        if (winnerElement) {
            winnerElement.textContent = winnerName;
        }
    }
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


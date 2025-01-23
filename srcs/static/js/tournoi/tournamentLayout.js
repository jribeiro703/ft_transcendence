// tournoi/tournamnetLayout.js

import { createTournamentLayoutHTML } from './templates/createTournamentLayoutTemplate.js';
import { fetchAuthData } from "../user/fetchData.js";
import gameVar from "../game/pong/var.js";
import { renderPageGame } from "../game/HistoryManager.js";

export async function displayTournamentLayout(tournamentId) {
    const box = document.getElementById('mainContent');
    try {
        const response = await fetchAuthData(`/tournament/${tournamentId}/`, "GET");
        if (response.status === 200 && response.data) {
            box.innerHTML = createTournamentLayoutHTML();

            renderBracket(response.data.matches);

            const playNextMatchButton = document.getElementById('play-next-match');
            playNextMatchButton.disabled = false;

            // TODO: BUG: What if the button is pressed 4th time? The tournament finishes in 3 matches
            document.getElementById('play-next-match').addEventListener('click', () => {
                playNextMatchButton.disabled = true;
                launchNextMatch(tournamentId, response.data.current_match);

            });
            // Periodically check if the match is over
            const intervalId = setInterval(() => {
                // TODO: Bug: ??
                if (gameVar.matchOver) {
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

async function launchNextMatch(tournamentId, currentMatch) {
    if (!currentMatch) return console.error("No match ID provided");

    const payload = { matchId: currentMatch, score_one: 0, score_two: 0 };
    console.log(`[launchNextMatch] Launching match ${currentMatch} for tournament ${tournamentId}`);

    try {
        const response = await fetchAuthData(`/tournament/next/${tournamentId}/`, "POST", payload);
        if (response.status === 200) {
            console.log("Match launched successfully");
            displayTournamentArena();

            // Launch Play Local game
            launchGame();
            
            displayTournamentLayout(tournamentId); // Refresh -temporarily disabled
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

function launchGame() {
    console.log("[launchGame] Preparing game launch...");
    // Set gameVar properties based on the tournament and match
    gameVar.game = "pong";
    gameVar.localGame = true;
    gameVar.tournament = true; // Indicate this is a tournament game
    //gameVar.currTournament = tournamentData;

    // Render the game
    renderPageGame("playPongLocal", true); // Assume renderPageGame is globally available
    gameVar.rematchBtn.style.display = 'none';
    gameVar.quitGameBtn.style.display = 'none';
    console.log("[launchGame] Game launched successfully.");
}

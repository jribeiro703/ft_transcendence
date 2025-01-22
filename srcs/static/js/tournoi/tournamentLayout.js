// tournoi/tournamnetLayout.js

import { createTournamentLayoutHTML } from './templates/createTournamentLayoutTemplate.js';
import { fetchAuthData, getCookie } from "../user/fetchData.js";

export async function displayTournamentLayout(tournamentId) {
    const box = document.getElementById('mainContent');
    try {
        const response = await fetchAuthData(`/tournament/${tournamentId}/`, "GET");
        if (response.status === 200 && response.data) {
            box.innerHTML = createTournamentLayoutHTML();

            // Render matches dynamically
            renderBracket(response.data.matches);

            document.getElementById('play-next-match').addEventListener('click', () => {
                launchNextMatch(tournamentId, response.data.current_match);
            });
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
    try {
        const response = await fetchAuthData(`/tournament/next/${tournamentId}/`, "POST", payload);
        if (response.status === 200) {
            console.log("Match launched successfully");
            displayTournamentLayout(tournamentId); // Refresh
        } else {
            console.error("Failed to launch match:", response.data);
        }
    } catch (error) {
        console.error("Error launching match:", error);
    }
}

document.addEventListener('DOMContentLoaded', () => {
    const tournamentId = document.getElementById('bracket-container').dataset.tournamentId;

    const fetchBracket = async () => {
        const response = await fetch(`/tournament/${tournamentId}/bracket/fetch/`);
        const data = await response.json();

        const bracketContainer = document.getElementById('bracket');
        bracketContainer.innerHTML = data.matches.map((match) => `
            <div class="matchup">
                <div class="player">${match.player1}</div>
                <div class="vs">vs</div>
                <div class="player">${match.player2}</div>
            </div>
        `).join('');
    };

    fetchBracket();
    setInterval(fetchBracket, 5000); // Update every 5 seconds
});

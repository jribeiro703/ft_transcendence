document.addEventListener('DOMContentLoaded', () => {
    const winnerDisplay = document.getElementById('winner');
    const tournamentId = winnerDisplay.dataset.tournamentId;

    const fetchWinner = async () => {
        const response = await fetch(`/tournament/${tournamentId}/winner/fetch/`);
        const data = await response.json();

        winnerDisplay.textContent = data.winner || 'TBD';
    };

    fetchWinner();
});

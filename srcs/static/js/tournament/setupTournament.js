document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('tournament-setup-form');
    const playerFieldsContainer = document.getElementById('player-fields-container');

    const updatePlayerFields = (playerCount) => {
        playerFieldsContainer.innerHTML = ''; // Clear fields
        for (let i = 1; i <= playerCount; i++) {
            const playerField = document.createElement('div');
            playerField.className = 'mb-3';
            playerField.innerHTML = `
                <label>Player ${i}</label>
                <select class="form-select" name="player_${i}" required>
                    <option value="" disabled selected>Select Player</option>
                    <!-- Users will be injected server-side -->
                </select>`;
            playerFieldsContainer.appendChild(playerField);
        }
    };

    document.querySelectorAll('input[name="playerCount"]').forEach((radio) => {
        radio.addEventListener('change', (e) => updatePlayerFields(parseInt(e.target.value, 10)));
    });

    form.addEventListener('submit', async (e) => {
        e.preventDefault();

        const formData = new FormData(form);
        const response = await fetch('/tournament/create/', { method: 'POST', body: formData });
        const data = await response.json();

        if (data.success) {
            alert('Tournament created successfully!');
            window.location.href = `/tournament/${data.tournament_id}/bracket/`;
        } else {
            alert(data.error);
        }
    });
});

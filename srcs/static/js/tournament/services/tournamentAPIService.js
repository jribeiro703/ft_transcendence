// Create a new tournament dynamically via the API
// This function triggers a REST API call to create a new tournament with default parameters.
// The UI is updated to reflect success or failure.
export const createTournament = async () => {
	try {
		const payload = {
			start_date: new Date().toISOString(),
			max_score: 100,
			status: 'UPCOMING'
		}
		const endpoint = 'https://localhost:8081/tournament/'
		const response = await fetch(endpoint,
			{
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify(payload),
			});

		if (response.ok) {
			// Tournament successfully created
			const tournament = await response.json();
			console.log('Tournament started:', tournament);
			alert('Tournament created successfully!');
		} else {
			// Handle failure cases for tournament creation
			console.error('Failed to create tournament:', response.status);
			alert('Failed to create tournament.');
		}
	} catch (error) {
		// Log errors during the API call
		console.error('Error creating tournament:', error);
	}
};


// Fetch participants and populate the list
export const fetchParticipants = async () => {
	try {
		const response = await fetch('https://localhost:8081/players/', {
			method: 'GET',
			headers: {
				'Content-Type': 'application/json',
			},
		});

		if (response.ok) {
			const players = await response.json();
			const playersList = document.getElementById('playersList');
			playersList.innerHTML = ''; // Clear existing participants

			players.forEach(player => {
				const listItem = document.createElement('li');
				listItem.className = 'list-group-item';
				listItem.textContent = player.username;
				playersList.appendChild(listItem);
			});
		} else {
			console.error('Failed to fetch participants:', response.status);
		}
	} catch (error) {
		console.error('Error fetching participants:', error);
	}
};

// Quit the tournament (placeholder)
export const quitTournament = () => {
	alert('Quit Tournament functionality not implemented yet!');
};

// Create a demo game
export const createGame = async () => {
	try {
		const response = await fetch('https://localhost:8081/game/', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({
				tournament_id: 1, // Replace with actual tournament ID
				player_one: 1,    // Replace with actual player IDs
				player_two: 2,
				max_score: 10,
			}),
		});

		if (response.ok) {
			const game = await response.json();
			const gameLog = document.getElementById('gameLog');
			const logEntry = document.createElement('li');
			logEntry.className = 'list-group-item';
			logEntry.textContent = `Game created: Player ${game.player_one} vs Player ${game.player_two}`;
			gameLog.appendChild(logEntry);
		} else {
			console.error('Failed to create game:', response.status);
		}
	} catch (error) {
		console.error('Error creating game:', error);
	}
};

// Attach event listeners to buttons
document.addEventListener('DOMContentLoaded', () => {
	console.log('DOM fully loaded and parsed');

	// Attach a click event listener to the parent element that exists initially
	document.getElementById('mainContent').	('click', (event) => {
		// Check if the clicked element is the "Create Tournament" button
		if (event.target && event.target.id === 'createTournamentBtn') {
			console.log('Create Tournament button clicked');
			createTournament();
		}

		// Check if the clicked element is the "Quit Tournament" button
		if (event.target && event.target.id === 'quitTournamentBtn') {
			console.log('Quit Tournament button clicked');
			quitTournament();
		}

		// Check if the clicked element is the "Create Demo Game" button
		if (event.target && event.target.id === 'createGameBtn') {
			console.log('Create Demo Game button clicked');
			createGame();
		}
	});
});

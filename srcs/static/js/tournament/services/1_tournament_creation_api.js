// Create a new tournament dynamically via the API
// This function triggers a REST API call to create a new tournament with default parameters.
// The UI is updated to reflect success or failure.
export const createTournament = async () => {
	try {
		const response = await fetch('https://localhost:8081/tournament/', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({
				start_date: new Date().toISOString(),
				max_score: 100,
				status: 'UPCOMING',
			}),
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
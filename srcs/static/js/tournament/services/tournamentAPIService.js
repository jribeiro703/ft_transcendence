// Fetch participants and populate the list
export const fetchParticipants = async () => {
	try {
		const response = await fetch('https://localhost:8081/tournament/players/', {
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

// Create a new tournament dynamically via the API
export const createTournament = async () => {
	try {
		const payload = {
			start_date: new Date().toISOString(),
			max_score: 100,
			status: 'UPCOMING'
		};
		const endpoint = 'https://localhost:8081/tournament/';
		const response = await fetch(endpoint, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify(payload),
		});

		if (response.ok) {
			const tournament = await response.json();
			console.log('Tournament started:', tournament);
			alert('Tournament created successfully!');
		} else {
			console.error('Failed to create tournament:', response.status);
			alert('Failed to create tournament.');
		}
	} catch (error) {
		console.error('Error creating tournament:', error);
	}
};

// Perform random matchmaking and display the bracket
export const performMatchmaking = async () => {
	try {
		const response = await fetch('https://localhost:8081/tournament/matchmaking/', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
		});

		if (response.ok) {
			const bracket = await response.json();
			const bracketContainer = document.createElement('div');
			bracketContainer.innerHTML = `
				<h3>Bracket</h3>
				<ul id="bracketList" class="list-group">
					<!-- Dynamically insert bracket here -->
				</ul>
			`;
			document.getElementById('tournamentView').appendChild(bracketContainer);

			const bracketList = document.getElementById('bracketList');
			bracket.matches.forEach(match => {
				const listItem = document.createElement('li');
				listItem.className = 'list-group-item';
				listItem.textContent = `${match.player1} vs ${match.player2}`;
				bracketList.appendChild(listItem);
			});
		} else {
			console.error('Failed to perform matchmaking:', response.status);
		}
	} catch (error) {
		console.error('Error performing matchmaking:', error);
	}
};

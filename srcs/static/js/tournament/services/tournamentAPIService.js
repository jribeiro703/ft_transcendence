// Create a new tournament dynamically via the API
export const createTournament = async () => {
	try {
		const payload = {
			start_date: new Date().toISOString(),
			max_score: 100,
			status: 'UPCOMING',
		};

		const response = await fetch('https://localhost:8081/tournament/', {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify(payload),
		});

		if (response.ok) {
			const tournament = await response.json();
			console.log('Tournament created:', tournament);
			return tournament.tournament_id; // Return the tournament ID
		} else {
			console.error('Failed to create tournament:', response.status);
		}
	} catch (error) {
		console.error('Error creating tournament:', error);
	}
};

export const fetchParticipants = async () => {
	try {
		const response = await fetch('https://localhost:8081/tournament/players/', {
			method: 'GET',
			headers: { 'Content-Type': 'application/json' },
		});

		if (response.ok) {
			const data = await response.json();
			console.log('Eligible players:', data);
			return data.eligible_players; // Return the list of eligible players
		} else {
			console.error('Failed to fetch participants:', response.status);
		}
	} catch (error) {
		console.error('Error fetching participants:', error);
	}
};

// Perform random matchmaking and display the bracket
export const performMatchmaking = async (tournamentId) => {
	try {
		const response = await fetch('https://localhost:8081/tournament/matchmaking/', {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({ tournament_id: tournamentId }),
		});

		if (response.ok) {
			const data = await response.json();
			console.log('Matchmaking successful:', data);
		} else {
			console.error('Failed to perform matchmaking:', response.status);
		}
	} catch (error) {
		console.error('Error performing matchmaking:', error);
	}
};

export const preRegisterPlayers = async (tournamentId, playerIds) => {
	try {
		const response = await fetch('https://localhost:8081/tournament/preregister/', {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({
				tournament_id: tournamentId,
				player_ids: playerIds,
			}),
		});

		if (response.ok) {
			const data = await response.json();
			console.log('Players pre-registered:', data);
			return data;
		} else {
			const errorData = await response.json();
			console.error('Failed to pre-register players:', errorData);
		}
	} catch (error) {
		console.error('Error pre-registering players:', error);
	}
};



export const setupTournamentFlow = async () => {
	try {
		// Step 1: Create the tournament
		const tournamentId = await createTournament();
		if (!tournamentId) return;

		// Step 2: Fetch eligible players
		const eligiblePlayers = await fetchParticipants();
		if (!eligiblePlayers || eligiblePlayers.length < 2) {
			console.error('Not enough players to proceed.');
			return;
		}

		// Step 3: Pre-register players
		const playerIds = eligiblePlayers.map(player => player.id);
		await preRegisterPlayers(tournamentId, playerIds);

		// Step 4: Perform matchmaking
		await performMatchmaking(tournamentId);

		console.log('Tournament setup completed successfully.');
	} catch (error) {
		console.error('Error during tournament setup flow:', error);
	}
};

export const generateTournamentName = async () => {
	try {
		const response = await fetch('http://localhost:8081/generate_name/');
		if (response.ok) {
			const data = await response.json();
			return data.name;
		} else {
			console.error('Failed to generate tournament name:', response.status);
			return '';
		}
	} catch (error) {
		console.error('Error generating tournament name:', error);
		return '';
	}
};

export const validateTournamentName = async (name) => {
	try {
		const response = await fetch('http://localhost:8081/validate_name/', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({ name })
		});
		if (response.ok) {
			const data = await response.json();
			return data.isValid;
		} else {
			console.error('Failed to validate tournament name:', response.status);
			return false;
		}
	} catch (error) {
		console.error('Error validating tournament name:', error);
		return false;
	}
};

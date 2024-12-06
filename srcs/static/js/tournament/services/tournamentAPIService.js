import { getFriendsList } from "../handlers/tournamentWebSocketHandler.js";
// services/tournamentAPIService.js

// Function to sanitize the tournament name
function sanitizeTournamentName(name) {
    return name.replace(/[^a-zA-Z0-9]/g, '');
}

// Create a new tournament dynamically via the API
export const createTournament = async (name) => {
    try {
        const sanitizedName = sanitizeTournamentName(name);
        const payload = {
            name: sanitizedName,
            start_date: new Date().toISOString(),
            max_score: 100,
            status: 'UPCOMING',
        };
        console.log('Payload:', payload);

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
            const errorData = await response.json();
            console.error('Error details:', errorData);
        }
    } catch (error) {
        console.error('Error creating tournament:', error);
    }
};

export const fetchEligiblePlayers = async () => {
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

export const generateTournamentName = async () => {
    try {
        const response = await fetch('https://localhost:8081/tournament/generate-name/');
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
        const response = await fetch('https://localhost:8081/tournament/validate-name/', {
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

export const fetchTournamentBracket = async (tournamentId) => {
    try {
        const response = await fetch(`https://localhost:8081/tournament/${tournamentId}/bracket/`, {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' },
        });

        if (response.ok) {
            const data = await response.json();
            return data.bracket;
        } else {
            console.error('Failed to fetch tournament bracket:', response.status);
        }
    } catch (error) {
        console.error('Error fetching tournament bracket:', error);
    }
};

export const fetchCurrentPlayers = async (tournamentId) => {
    try {
        const response = await fetch(`https://localhost:8081/tournament/${tournamentId}/players/`, {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' },
        });

        if (response.ok) {
            const data = await response.json();
            return data.players;
        } else {
            console.error('Failed to fetch current players:', response.status);
        }
    } catch (error) {
        console.error('Error fetching current players:', error);
    }
};

// Function to set up the tournament flow
export const setupTournamentFlow = async (name) => {
    try {
        // Step 1: Create the tournament
        const tournamentId = await createTournament(name);
        if (!tournamentId) return;

        // Step 2: Fetch eligible players
        const eligiblePlayers = await fetchEligiblePlayers();
        if (!eligiblePlayers || eligiblePlayers.length < 2) {
            console.error('Not enough players to proceed.');
            return;
        }

        // Step 3: Pre-register players
        const playerIds = eligiblePlayers.map(player => player.id);
        await preRegisterPlayers(tournamentId, playerIds);

        // Step 4: Perform matchmaking
        await performMatchmaking(tournamentId);

        // Step 5: Fetch and render the tournament bracket
        const bracket = await fetchTournamentBracket(tournamentId);
        renderBracket(bracket, tournamentId);

        // Step 6: Fetch and render the friends list
        console.log("just before the friends list call");
        getFriendsList(tournamentId);
        console.log("just after the friends list call");
        console.log('Tournament setup completed successfully.');

        // Start periodic fetching of the tournament bracket
        setupTournamentBracketRefresh(tournamentId);

        return tournamentId; // Return the tournament ID
    } catch (error) {
        console.error('Error during tournament setup flow:', error);
    }
};

// Function to periodically fetch and update the tournament bracket
export const setupTournamentBracketRefresh = (tournamentId) => {
    fetchTournamentBracketPeriodically(tournamentId); // Initial fetch
    if (bracketInterval) clearInterval(bracketInterval); // Clear any existing interval
    bracketInterval = setInterval(() => fetchTournamentBracketPeriodically(tournamentId), 10000); // Fetch every 10 seconds
};

// Function to fetch and update the tournament bracket periodically
export const fetchTournamentBracketPeriodically = async (tournamentId) => {
    try {
        const bracket = await fetchTournamentBracket(tournamentId);
        renderBracket(bracket, tournamentId);
    } catch (error) {
        console.error('Error fetching tournament bracket:', error);
    }
};

// Function to render the bracket
function renderBracket(bracket, tournamentId) {
    const bracketContainer = document.getElementById('tournament-bracket');
    if (bracketContainer) {
        bracketContainer.innerHTML = ''; // Clear existing content

        bracket.forEach((match, index) => {
            // Create the match div
            const matchDiv = document.createElement('div');
            matchDiv.className = 'match d-flex justify-content-between align-items-center px-3 py-2 bg-light rounded border mb-2';
            const player1Class = match.player1 === tournamentId ? 'highlighted-user' : '';
            const player2Class = match.player2 === tournamentId ? 'highlighted-user' : '';

            matchDiv.innerHTML = `
                <div class="player text-success d-flex align-items-center gap-2 ${player1Class}">
                    🎉 <span class="fw-bold">${match.player1}</span>
                </div>
                <div class="vs text-muted fw-bold text-center">vs</div>
                <div class="player text-danger d-flex align-items-center gap-2 ${player2Class}">
                    <span class="fw-bold">${match.player2}</span> 🔥
                </div>
            `;
            bracketContainer.appendChild(matchDiv);

            // Add a connector line if it's not the last match
            if (index < bracket.length - 1) {
                const connector = document.createElement('div');
                connector.className = 'connector d-flex justify-content-center align-items-center';
                connector.innerHTML = `
                    <span class="line"></span>
                `;
                bracketContainer.appendChild(connector);
            }
        });
    } else {
        console.error("Bracket container is null");
    }
}

// Call this function to start the periodic fetching
setupEligiblePlayersRefresh();
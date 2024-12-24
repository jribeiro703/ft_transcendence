// tournament/services/apiService.js

import { fetchAuthData } from "../../user/fetchData.js";

export const createTournament = async (name) => {
	try {
		console.debug('[createTournament] Payload:', { name });
		const payload = {
			name: name,
			start_date: new Date().toISOString(),
			max_score: 100,
			status: 'UPCOMING',
		};
		const response = await fetchAuthData('/tournament/', "POST", payload);
		console.debug('[createTournament] Response:', response);

		if (response.status === 201) {
			console.info('[createTournament] Tournament created successfully:', response.data.tournament_id);
			return response.data.tournament_id;
		} else {
			console.warn('[createTournament] Failed to create tournament. Status:', response.status);
			console.warn('[createTournament] Error details:', response.data);
		}
	} catch (error) {
		console.error('[createTournament] Error creating tournament:', error);
	}
};

export const fetchPlayers = async () => {
	try {
		console.debug('[fetchPlayers] Fetching eligible players...');
		const response = await fetchAuthData('/tournament/players/', "GET");
		console.debug('[fetchPlayers] Response:', response);

		if (response.status === 200) {
			console.info('[fetchPlayers] Eligible players fetched successfully:', response.data.eligible_players);
			return response.data.eligible_players;
		} else {
			console.warn('[fetchPlayers] Failed to fetch players. Status:', response.status);
		}
	} catch (error) {
		console.error('[fetchPlayers] Error fetching players:', error);
	}
};

export const performMatchmaking = async (tournamentId) => {
	try {
		console.debug('[performMatchmaking] Payload:', { tournament_id: tournamentId });
		const payload = { tournament_id: tournamentId };
		const response = await fetchAuthData('/tournament/matchmaking/', "POST", payload);
		console.debug('[performMatchmaking] Response:', response);

		if (response.status === 200) {
			console.info('[performMatchmaking] Matchmaking successful:', response.data);
		} else {
			console.warn('[performMatchmaking] Failed to perform matchmaking. Status:', response.status);
		}
	} catch (error) {
		console.error('[performMatchmaking] Error performing matchmaking:', error);
	}
};

export const preRegisterPlayers = async (tournamentId, playerIds) => {
	try {
		console.debug('[preRegisterPlayers] Payload:', { tournamentId, playerIds });
		const payload = { 
			tournament_id: tournamentId,
			player_ids: playerIds,
		};
		const response = await fetchAuthData('/tournament/preregister/', "POST", payload);
		console.debug('[preRegisterPlayers] Response:', response);

		if (response.status === 200) {
			console.info('[preRegisterPlayers] Players pre-registered successfully:', response.data);
			return response.data;
		} else {
			console.warn('[preRegisterPlayers] Failed to pre-register players. Status:', response.status);
			console.warn('[preRegisterPlayers] Error details:', response.data);
		}
	} catch (error) {
		console.error('[preRegisterPlayers] Error pre-registering players:', error);
	}
};

export const generateTournamentName = async () => {
	try {
		console.debug('[generateTournamentName] Generating tournament name...');
		const response = await fetchAuthData('/tournament/generate-name/', "GET");
		console.debug('[generateTournamentName] Response:', response);

		if (response.status === 200) {
			console.info('[generateTournamentName] Tournament name generated:', response.data.name);
			return response.data.name;
		} else {
			console.warn('[generateTournamentName] Failed to generate tournament name. Status:', response.status);
			return '';
		}
	} catch (error) {
		console.error('[generateTournamentName] Error generating tournament name:', error);
		return '';
	}
};

export const validateTournamentName = async (name) => {
	try {
		console.debug('[validateTournamentName] Payload:', { name });
		const payload = { name: name };
		const response = await fetchAuthData('/tournament/validate-name/', "POST", payload);
		console.debug('[validateTournamentName] Response:', response);

		if (response.status === 200) {
			console.info('[validateTournamentName] Tournament name validation result:', response.data.isValid);
			return response.data.isValid;
		} else {
			console.warn('[validateTournamentName] Failed to validate tournament name. Status:', response.status);
			return false;
		}
	} catch (error) {
		console.error('[validateTournamentName] Error validating tournament name:', error);
		return false;
	}
};

export const fetchTournamentBracket = async (tournamentId) => {
	try {
		console.debug('[fetchTournamentBracket] Tournament ID:', tournamentId);
		const response = await fetchAuthData(`/tournament/${tournamentId}/bracket/`, "GET");
		console.debug('[fetchTournamentBracket] Response:', response);

		if (response.status === 200) {
			console.info('[fetchTournamentBracket] Tournament bracket fetched successfully:', response.data.bracket);
			return response.data.bracket;
		} else {
			console.warn('[fetchTournamentBracket] Failed to fetch tournament bracket. Status:', response.status);
		}
	} catch (error) {
		console.error('[fetchTournamentBracket] Error fetching tournament bracket:', error);
	}
};

export const fetchCurrentPlayers = async (tournamentId) => {
	try {
		console.debug('[fetchCurrentPlayers] Tournament ID:', tournamentId);
		const response = await fetchAuthData(`/tournament/${tournamentId}/players/`, "GET");
		console.debug('[fetchCurrentPlayers] Response:', response);

		if (response.status === 200) {
			console.info('[fetchCurrentPlayers] Current players fetched successfully:', response.data.players);
			return response.data.players;
		} else {
			console.warn('[fetchCurrentPlayers] Failed to fetch current players. Status:', response.status);
			console.warn('[fetchCurrentPlayers] Error details:', response.data);
		}
	} catch (error) {
		console.error('[fetchCurrentPlayers] Error fetching current players:', error.message);
		throw error;
	}
};

export const fetchUserTournaments = async () => {
	try {
		console.debug('[fetchUserTournaments] Fetching user tournaments...');
		const response = await fetchAuthData('/tournament/user-tournaments/', "GET");
		console.debug('[fetchUserTournaments] Response:', response);

		if (response.status === 200) {
			console.info('[fetchUserTournaments] User tournaments fetched successfully:', response.data.tournaments);
			return response.data.tournaments;
		} else {
			console.warn('[fetchUserTournaments] Failed to fetch user tournaments. Status:', response.status);
		}	
	} catch (error) {
		console.error('[fetchUserTournaments] Error fetching user tournaments:', error);
	}
};

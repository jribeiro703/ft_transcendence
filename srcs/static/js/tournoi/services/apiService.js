// tournoi/services/apiService.js

import { fetchAuthData } from "../../user/fetchData.js";

export const createTournament = async (players) => {
	try {
		console.log('Access Token:', localStorage.getItem('access_token'));

        console.debug('[createTournament] Payload:', { players });
        const payload = {
            players: players.map(player => ({
                user_id: player.user_id || null,
                guest_name: player.guest_name || null
            })),
        };
		console.debug('[createTournament] Payload:', payload);
        const response = await fetchAuthData('/tournament/create/', "POST", payload);
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
        throw error;
    }
};

export const validateGameToken = async (playerId, gameToken) => {
    try {
        const payload = { player_id: playerId, game_token: gameToken };
        console.debug('[validateGameToken] Payload:', payload);

        const response = await fetchAuthData('/tournament/tokenvalidate', "POST", payload);
        console.debug('[validateGameToken] Response:', response);

        if (response.status === 200 && response.data.valid) {
            console.info('[validateGameToken] Token validated successfully');
            return true;
        } else {
            console.warn('[validateGameToken] Invalid token. Response:', response.data);
            return false;
        }
    } catch (error) {
        console.error('[validateGameToken] Error validating token:', error);
        throw error;
    }
};

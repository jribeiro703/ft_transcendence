import { fetchData } from "./fetchData.js";

const TokenType = {
	ACCESS: 'access',
	REFRESH: 'refresh'
};

function decodeToken(token, tokenType) {

	if (!token)
		return null;
	
	const tokenParts = token.split('.');
	if (tokenParts.length !== 3) {
		console.error(`decodeToken: invalid ${tokenType} token format`);
		return null;
	}

	try {
		const payload = JSON.parse(atob(tokenParts[1]));
		if (!payload || payload.token_type !== tokenType) {
			console.error(`decodeToken: invalid ${tokenType} payload or type mismatch`);
			return null;
		}

		return payload;
	} catch (error) {
		console.error(`decodeToken: failed to decode ${tokenType} token:`, error);
		return null;
	}
}

function getIdFromJWT(token) {
	const payload = decodeToken(token, TokenType.ACCESS);
	if (!payload) {
		console.warn("getIdFromJWT: access token is invalid");
		return null;
	}
	return payload.user_id;
}

function isTokenExpired(payload) {
	return payload.exp && Date.now() >= payload.exp * 1000;
}

async function refreshAccessToken() {
	const responseObject = await fetchData("/user/login/token-refresh/");
	if (responseObject.status === 200) {
		localStorage.setItem('access_token', responseObject.data.access_token);
		console.log("refreshAccessToken: new access token obtained");
		return true;
	}
	console.error("refreshAccessToken: failed to get new access token");
	return false;
}

async function isAuthenticated() {
	const accessToken = localStorage.getItem('access_token');
	if (!accessToken) {
		console.warn("isAuthenticated: access token not found");
		return false;
	}
	const payload = decodeToken(accessToken, TokenType.ACCESS);
	if (!payload) {
		console.warn("isAuthenticated: access token is invalid");
		return false;
	}

	if (isTokenExpired(payload)) {
		const refreshed = await refreshAccessToken();
		if (!refreshed) {
			console.log("isAuthenticated: refresh failed");
			alert("Session expired. Please sign in again.");
			return false;
		}
	}
	return true;
}

export { refreshAccessToken, decodeToken, TokenType, isTokenExpired, getIdFromJWT, isAuthenticated };
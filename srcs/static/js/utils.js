// function for calling API's endpoint
export const API_BASE_URL = "https://localhost:8081";

export async function fetchData(endpoint, method = 'GET', body = null) {
	const url = `${API_BASE_URL}${endpoint}`;
	const options = {
	    method: method,
	    headers: {'Content-Type': 'application/json'},
		credentials: 'include'
	};
	if (body) {options.body = JSON.stringify(body);}
	const response = await fetch(url, options);
	const data = await response.json()
	return { data: data, status: response.status };
}

function isTokenExpired(token) {
	const arrayToken = token.split('.');
	const tokenPayload = JSON.parse(atob(arrayToken[1])); // atob() decode payload part, JSON.parse() change JSON string to JS object
	const currentTime = Math.floor(Date.now() / 1000); // actual time in seconds
	return currentTime >= tokenPayload?.exp; // Vérifie si le token est expiré
}

async function isAccessTokenRefreshed() {
	const { data, status } = await fetchData("/user/login/token-refresh/")
	if (data.access_token) {
		console.log('get new access token successfully');
		localStorage.setItem('access_token', data.access_token);
		return true
	}
	else {
		console.error(data.message);
		return false
	}
}

export function isAuthenticated() {
	const accessToken = localStorage.getItem('access_token');
	if (!accessToken) {
		console.error('No access token found.');
		return false;
	}
	if (isTokenExpired(accessToken) && !isAccessTokenRefreshed()) {
		console.error("refresh access token failed");
		alert("Your session is expired .");
		return false;
	}
	return true;
}

export function alertUserToLogin() {
	alert('You must be logged in to use this feature.');
    return;
}

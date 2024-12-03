import { fetchData, getCookie } from "./fetchData.js";

async function refreshAccessToken() {
	const responseObject = await fetchData("/user/check-auth/token-refresh/", "GET", null, false, "simple");
	if (responseObject.status === 200) {
		sessionStorage.setItem('access_token', responseObject.data.access_token);
		return true;
	}
	// console.warn("refreshAccessToken: failed to get new access token");
	return false;
}

async function isAuthenticated() {
	const options = {
		method: "GET", 
		headers: {
			'X-CSRFToken': getCookie('csrftoken'),
			'Authorization': `Bearer ${sessionStorage.getItem('access_token')}`
		},
		credentials: 'include'
	}
	const responseObject = await fetch("/user/check-auth/", options);
	if (responseObject.status === 200) {
		return true;
	} else if (responseObject.status === 401) {
		// console.warn("isAuthenticated: access token expired, refreshing...");
		const refreshed = await refreshAccessToken();
		if (refreshed) {
			return true;
		}
	}
	// console.warn("isAuthenticated: user is not authenticated");
	return false;
}

export { isAuthenticated, refreshAccessToken };
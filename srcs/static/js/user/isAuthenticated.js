import { fetchData, getCookie } from "./fetchData.js";

async function refreshAccessToken() {
	const responseObject = await fetchData("/user/check-auth/token-refresh/", "GET", null, false);
	if (responseObject.status === 200) {
		// sessionStorage.setItem('access_token', responseObject.data.access_token);
		localStorage.setItem('access_token', responseObject.data.access_token);
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
		},
		credentials: 'include'
	}
	// const access_token = sessionStorage.getItem('access_token');
	const access_token = localStorage.getItem('access_token');
	if (access_token || access_token == '') {
		
		options['headers']['Authorization'] = `Bearer ${access_token}`
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
	return false;
}

export { isAuthenticated, refreshAccessToken };
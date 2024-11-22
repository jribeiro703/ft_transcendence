// function for calling API's endpoint
export const API_BASE_URL = "https://localhost:8081";
export const DEBUG = true

function getCSRFToken() {
	const cookies = document.cookie.split(';');
    const csrftoken = cookies.find(cookie => cookie.trim().startsWith("csrftoken="));
    return csrftoken ? csrftoken.split('=')[1] : '';
}

// export async function fetchData(endpoint, method = 'GET', body = null) {
// 	const url = `${API_BASE_URL}${endpoint}`;
// 	const options = {
// 	    method: method,
// 	    headers: {
// 			'Content-Type': 'application/json',
// 			'X-CSRFToken': getCSRFToken(),
// 		},
// 		credentials: 'include'
// 	};
// 	if (body) {options.body = JSON.stringify(body);}
// 	const response = await fetch(url, options);
// 	const data = await response.json()
// 	return { data: data, status: response.status };
// }

export async function fetchData(endpoint, method = 'GET', body = null, isFormData = false) {
    const url = `${API_BASE_URL}${endpoint}`;
    const options = {
        method: method,
        headers: {
            'X-CSRFToken': getCSRFToken(),
        },
        credentials: 'include'
    };

    if (body) {
        if (isFormData) {
            options.body = body;
        } else {
            options.headers['Content-Type'] = 'application/json';
            options.body = JSON.stringify(body);
        }
    }

    const response = await fetch(url, options);
    const data = await response.json();
    return { data, status: response.status };
}

export function getIdFromJWT() {
	const token = localStorage.getItem('access_token');
	if (token) {
		const payload = JSON.parse(atob(token.split('.')[1]));
		console.log(payload);
		return payload.user_id;
	}
	console.log("getIdFromJWT : null");
	return null;
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
		return true;
	}
	console.log(data.message);
	return false;
}

export async function isAuthenticated() {
	const accessToken = localStorage.getItem('access_token');
	if (!accessToken) {
		console.log('No access token found.');
		return false;
	}
	else if (isTokenExpired(accessToken)) {
		const refreshed = await isAccessTokenRefreshed()
		if (!refreshed) {
			console.log("Refresh access token failed");
			alert("Session expired. Please sign in again.");
			return false;
		}
	}
	return true;
}

export function alertUserToLogin() {
	alert('You must be logged in to use this feature.');
    return;
}

export function escapeHTML(unsafe) {
	if (typeof unsafe !== 'string') {
        return '';
    }
    const map = {
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#039;'
    };
    return unsafe.replace(/[&<>"']/g, match => map[match]);
}
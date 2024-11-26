export const API_BASE_URL = "https://localhost:8081";

function getCSRFToken() {
	const cookies = document.cookie.split(';');
    const csrftoken = cookies.find(cookie => cookie.trim().startsWith("csrftoken="));
	if (!csrftoken)
		console.log("getCSRFToken(): token = null");
    return csrftoken ? csrftoken.split('=')[1] : '';
}

async function fetchData(endpoint, method = 'GET', body = null, isFormData = false) {
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

	const responseObject = {
		data: { message: "An unknown error occurred" },
		status: 500,
	};
	try {
		const response = await fetch(url, options);
		console.log("fetch->resposne =  ", response);
		
		responseObject.status = response.status;
		responseObject.data = await response.json();

		if (Array.isArray(responseObject.data[Object.keys(responseObject.data)[0]])) {
			const firstKey = Object.keys(responseObject.data)[0];
			const firstArray = responseObject.data[firstKey];
			if (Array.isArray(firstArray)) {
				responseObject.data.message = firstArray[0];
			}
		}

		console.log("response.json->responseObject = ", responseObject);
		return responseObject;
	}
	catch (error) {
		console.log(`fetchData(): response of fetch: ${error}`);
		return responseObject;	
	}
}


function isTokenExpired(token) {
	const arrayToken = token.split('.');
	const tokenPayload = JSON.parse(atob(arrayToken[1])); // atob() decode payload part, JSON.parse() change JSON string to JS object
	const currentTime = Math.floor(Date.now() / 1000); // actual time in seconds
	return currentTime >= tokenPayload?.exp; // Vérifie si le token est expiré
}

async function isAccessTokenRefreshed() {
	const responseObject = await fetchData("/user/login/token-refresh/")
	if (responseObject.status === 200) {
		console.log("isAccessTokenRefreshed(): get new access token successfully");
		localStorage.setItem('access_token', responseObject.data.access_token);
		return true;
	}
	return false;
}

async function isAuthenticated() {
	const accessToken = localStorage.getItem('access_token');
	if (!accessToken) {
		console.log("isAuthenticated(): No access token found.");
		return false;
	}
	else if (isTokenExpired(accessToken)) {
		const refreshed = await isAccessTokenRefreshed()
		if (!refreshed) {
			console.log("isAuthenticated(): Refresh access token failed");
			alert("Session expired. Please sign in again.");
			return false;
		}
	}
	return true;
}

function getIdFromJWT() {
	const token = localStorage.getItem('access_token');
	if (token) {
		const payload = JSON.parse(atob(token.split('.')[1]));
		// console.log(`getTdFromJWT(): JWT payload.user_id = ${payload.user_id}`);
		return payload.user_id;
	}
	console.log("getIdFromJWT() : access token = null");
	return null;
}

function escapeHTML(unsafe) {
	if (typeof unsafe !== 'string') {
		console.log("escapeHTML(): unsafe !== 'string'");
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

export { fetchData, isAuthenticated, getIdFromJWT, escapeHTML };
// function for calling API's endpoint
const API_BASE_URL = "https://localhost:8081";

export async function fetchData(endpoint, method = 'GET', body = null) {
    try {
		const url = `${API_BASE_URL}${endpoint}`;
        const options = {
            method: method,
            headers: {
                'Content-Type': 'application/json'
            }
        };
        if (body) {
            options.body = JSON.stringify(body);
        }
        const response = await fetch(url, options);
		if (!response.ok) {
			throw new Error(`HTTP error ! Message: ${response.message} and Status: ${response.status}`);
		}

		const contentType = response.headers.get('Content-Type');
		let data;

		if (contentType && contentType.includes('application/json')) {
			data = await response.json();
		} else {
			data = await response.text();
		}
        return data;
    } catch (error) {
        console.error('Error fetching data:', error);
    }
}

function isAuthenticated() {
    return document.cookie.split(';').some(cookie => cookie.trim().startsWith('refreshToken='));
}

export function ensureAuthentication() {
	if (isAuthenticated()) {
		const accessToken = sessionStorage.getItem('accessToken');
		if (!accessToken) {
			return fetchData(API_BASE_URL + '/user/token/refresh/', {
				method: 'POST',
				credentials: 'include', // include cookies
			})
			.then(response => {
				if (!response.ok) {
				    throw new Error('Token refresh failed');
				}
				return response.json();
			})
			.then(data => {
				sessionStorage.setItem('accessToken', data.accessToken);
				return true;
			})
			.catch(() => {
				alert('Session expired. Please log in again.');
				// window.location.href = '/login';
				return false;
			});
		}
		return Promise.resolve(true);
	} else {
	    alert('You must log in to access this feature.');
	    // window.location.href = '/login';
	    return Promise.resolve(false);
	}
}

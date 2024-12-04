import { isAuthenticated } from "./isAuthenticated.js";

const API_BASE_URL = "https://localhost:8081";

function getCookie(name) {
	const cookies = document.cookie.split(';');
	const cookie = cookies.find(cookie => cookie.trim().startsWith(`${name}=`));
	if (!cookie)
		// console.log(`getCookie(): cookie ${name} = null`);
	return cookie ? cookie.split('=')[1] : '';
}

async function makeOptions(method, body, isFormData, mode) {
	const options = {
		method: method,
		headers: {
			'X-CSRFToken': getCookie('csrftoken'),
		},
		credentials: 'include'
	};
	if (mode == "authenticated" && await isAuthenticated()) {
		options.headers['Authorization'] = `Bearer ${sessionStorage.getItem('access_token')}`
	}
    if (body && isFormData) {
        options.body = body;
    } else if (body) {
		options.headers['Content-Type'] = 'application/json';
		options.body = JSON.stringify(body);
	}
	return options;
}

async function fetchData(endpoint, method = 'GET', body = null, isFormData = false, mode = 'simple') {
    const url = `${API_BASE_URL}${endpoint}`;
	const options = await makeOptions(method, body, isFormData, mode);

	console.log("fetchData(): options = ", options);

	const responseObject = {
		data: { message: "An unknown error occurred while fetching data" },
		status: 400,
	};
	try {
		const response = await fetch(url, options);
		console.log("fetchData(): RESPONSE OF FETCH =  ", response);
		
		responseObject.status = response.status;
		responseObject.data = await response.json();

		console.log("fetchData(): RESPONSE OBJECT = ", responseObject);
		return responseObject;
	}
	catch (error) {
		console.error(`fetchData(): response of fetch: ${error}`);
		return responseObject;	
	}
}

export { fetchData, API_BASE_URL, getCookie };
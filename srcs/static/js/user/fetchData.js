const API_BASE_URL = "https://localhost:8081";

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

export { fetchData, API_BASE_URL };
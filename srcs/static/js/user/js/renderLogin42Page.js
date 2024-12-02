import { fetchData } from "../fetchData.js";

async function handleAuth42Callback() {
	const urlParams = new URLSearchParams(window.location.search);
	const code = urlParams.get('code');

	if (code) {
		const responseObject = await fetchData(`/user/login42/`, "POST", {
			code: code
		});
		if (responseObject.access_token) {
			localStorage.setItem("access_token", responseObject.access_token);
			window.location.href = "/";
		}
		else {
			alert("Failed to authenticate with 42");
		}
	}
}

function renderLogin42Page() {
	const clientId = "u-s4t2ud-3add379a531eec316a1b4bc2b449eb553a9b9885006b2f6fee5291b2b171ad64";
	const redirectUri = 'https://localhost:8081/user/login42/';
	const authUrl = `https://api.intra.42.fr/oauth/authorize?client_id=${clientId}&redirect_uri=${redirectUri}&response_type=code`;
		
	window.location.href = authUrl;
	handleAuth42Callback();
}

export { renderLogin42Page, handleAuth42Callback };
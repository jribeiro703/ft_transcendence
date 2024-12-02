import { renderPage } from "./historyManager.js"

function createAuthContent() {
	const box = document.getElementById('mainContent')
	
	box.innerHTML = `
	<div id="auth-container">	
		<div class="container py-2 d-flex flex-column align-items-center py-2">
			<button id="btn-Login" class="btn custom-btn mb-4">Login</button>
			<button id="btn-Register" class="btn custom-btn mb-4">Register</button>
			<button id="btn-Login42" class="btn custom-btn mb-4">42 Login</button>
		</div>
	</div>
	`;
}

export function renderAuthPage() {
	createAuthContent();

	document.getElementById('btn-Login').addEventListener('click', () => {
		renderPage("login");
	});

	document.getElementById('btn-Register').addEventListener('click', () => {
		renderPage("register");
	});

	document.getElementById('btn-Login42').addEventListener('click', () => {
		renderPage("login42");
		
		// const clientId = "u-s4t2ud-3add379a531eec316a1b4bc2b449eb553a9b9885006b2f6fee5291b2b171ad64";
		// // const redirectUri = "https://localhost:8081/user/api/auth/42/";
		// const redirectUri = 'http://localhost:8081/auth/callback';
		// const authUrl = `https://api.intra.42.fr/oauth/authorize?client_id=${clientId}&redirect_uri=${redirectUri}&response_type=code`;
		
		// // const authUrl = "https://api.intra.42.fr/oauth/authorize?client_id=u-s4t2ud-3add379a531eec316a1b4bc2b449eb553a9b9885006b2f6fee5291b2b171ad64&redirect_uri=https%3A%2F%2Flocalhost%3A8081%2Fuser%2Fapi%2Fauth%2F42%2F&response_type=code";

		// window.location.href = authUrl;
	});
}
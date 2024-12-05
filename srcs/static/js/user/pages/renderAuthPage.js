import { renderPage } from "../historyManager.js"
import { PONG_CARD } from "../tools.js"

function createAuthContent() {
	const box = document.getElementById('mainContent')
	
	box.innerHTML = `
	<div id="defaultView">
		<div class="container">
			<div class="mx-auto">
				<img class="img-fluid" src="${PONG_CARD}" alt="Pong Game">
				<br><br><br>
			</div>
		</div>
	</div>
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
	});
}
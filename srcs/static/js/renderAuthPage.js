import { renderPage } from "./historyManager.js"

function createAuthContent() {
	const box = document.getElementById('mainContent')
	
	box.innerHTML = `	
		<div class="container py-2 d-flex flex-column align-items-center py-2">
		<button id="btn-Login" class="btn custom-btn mb-4">Login</button>
        <button id="btn-Register" class="btn custom-btn mb-4">Register</button>
        <button id="btn-Login42" class="btn custom-btn mb-4">42 Login</button>
		</div>
		`;
	history.pushState({ page: "auth" }, "Auth", "#auth");
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
		history.pushState({page:'login42'}, 'Login42', '#login42');
		console.log("Login 42 page");
	});
}
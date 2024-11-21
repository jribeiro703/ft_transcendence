import { renderLoginForm } from "./user/js/renderLoginForm.js";
import { renderRegisterForm } from "./user/js/renderRegisterForm.js";

function createAuthContent() {
	const box = document.getElementById('mainContent')
	
	box.innerHTML = `	
		<div class="container py-2 d-flex flex-column align-items-center py-2">
		<button id="btn-Login" class="btn custom-btn mb-4">Login</button>
        <button id="btn-Register" class="btn custom-btn mb-4">Register</button>
        <button id="btn-Login42" class="btn custom-btn mb-4">42 Login</button>
		</div>`
}

export function renderAuthPage() {
	createAuthContent();

	document.getElementById('btn-Login').addEventListener('click', () => {
		history.pushState({page:'login'}, 'Login', '#login');
		console.log("Login page");
		renderLoginForm();
	});

	document.getElementById('btn-Register').addEventListener('click', () => {
		history.pushState({page:'register'}, 'Register', '#register');
		console.log("register page");
		renderRegisterForm();
	});

	document.getElementById('btn-Login42').addEventListener('click', () => {
		history.pushState({page:'login42'}, 'Login42', '#login42');
		console.log("Login 42 page");
	});
}
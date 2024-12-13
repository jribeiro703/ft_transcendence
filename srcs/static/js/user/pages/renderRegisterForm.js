import { renderPage } from "../historyManager.js";
import { fetchData } from "../fetchData.js";
import { showToast, showErrorMessages } from "../tools.js";

export function renderRegisterForm() {
	const mainContent = document.getElementById('mainContent');
	mainContent.innerHTML = `
	<div id="defaultView" class="d-flex flex-column justify-content-center align-items-center gap-5 h-100">
		<form id="registerForm" class="custom-form">
		<div class="custom-form-group">
			<label class="custom-label" for="username">Username:</label>
			<input class="custom-input" type="text" id="username" name="username" required>
		</div>
		<div class="custom-form-group">
			<label class="custom-label" for="password">Password:</label>
			<input class="custom-input" type="password" id="password" name="password" required>
		</div>
		<div class="custom-form-group">
			<label class="custom-label" for="email">Email:</label>
			<input class="custom-input" type="email" id="email" name="email" required>
		</div>
			<button type="submit" class="submit-btn">Submit</button>
		</form>
	</div>
	`;

	document.getElementById('registerForm').addEventListener('submit', async (e) => {
		e.preventDefault();

		const username = document.getElementById('username').value;
		const email = document.getElementById('email').value;
		const password = document.getElementById('password').value;
		const responseObject = await fetchData('/user/register/', 'POST', { username, email, password }, false);
		
		if (responseObject.status === 201) {
			showToast(responseObject.data.message, "success");	
			renderPage("auth");
		} else {
			showErrorMessages(responseObject);
		}
    });
}
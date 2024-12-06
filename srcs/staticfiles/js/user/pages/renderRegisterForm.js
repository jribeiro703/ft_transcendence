import { renderPage } from "../historyManager.js";
import { fetchData } from "../fetchData.js";
import { showToast, showErrorMessages } from "../tools.js";

export function renderRegisterForm() {
	const mainContent = document.getElementById('mainContent');
	mainContent.innerHTML = `
	<div class="custom-form">
		<form id="registerForm">
			<label for="username">Username:</label>
			<input type="text" id="username" name="username" required>
			<label for="email">Email:</label>
			<input type="email" id="email" name="email" required>
			<label for="password">Password:</label>
			<input type="password" id="password" name="password" required>
			<button type="submit">Submit</button>
		</form>
	</div>
	`;

	document.getElementById('registerForm').addEventListener('submit', async (e) => {
		e.preventDefault();

		const username = document.getElementById('username').value;
		const email = document.getElementById('email').value;
		const password = document.getElementById('password').value;
		const responseObject = await fetchData('/user/register/', 'POST', { username, email, password }, false, "simple");
		
		if (responseObject.status === 201) {
			showToast(responseObject.data.message, "success");	
			renderPage("auth");
		} else {
			showErrorMessages(responseObject);
		}
    });
}
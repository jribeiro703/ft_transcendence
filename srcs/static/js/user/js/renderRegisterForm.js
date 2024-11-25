import { renderPage } from "../../historyManager.js";
import { fetchData } from "../../utils.js";

export function renderRegisterForm() {
	const box = document.getElementById('mainContent');
	box.innerHTML = `
		<form id="registerForm">
			<label for="username">Username:</label>
			<input type="text" id="username" name="username" required>
			<label for="email">Email:</label>
			<input type="email" id="email" name="email" required>
			<label for="password">Password:</label>
			<input type="password" id="password" name="password" required>
			<button type="submit">Submit</button>
		</form>
	`;
	history.pushState({page:'register'}, 'Register', '#register');

	document.getElementById('registerForm').addEventListener('submit', async (e) => {
		e.preventDefault();

		const username = document.getElementById('username').value;
		const email = document.getElementById('email').value;
		const password = document.getElementById('password').value;
		const responseObject = await fetchData('/user/register/', 'POST', { username, email, password });
		if (responseObject.status === 201) {
			alert(responseObject.data.message);
			renderPage("auth");
		} else {
			alert(responseObject.data.message);
		}
		// box.innerHTML = `<p>${responseObject.data.message}</p>`;
		// window.history.pushState({ page: "registerResponse" }, 'RegisterResponse', '#registerResponse');
    });
}
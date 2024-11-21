import { fetchData, DEBUG, escapeHTML } from "../../utils.js";
import { renderOtpForm } from "./renderOtpForm.js"

export function renderLoginForm() {
    const box = document.getElementById('mainContent');
    box.innerHTML = `
        <form id="loginForm">
            <label for="username">Username:</label>
            <input type="text" id="username" name="username" required>
            <label for="password">Password:</label>
            <input type="password" id="password" name="password" required>
            <button type="submit">Submit</button>
        </form>
    `;

    document.getElementById('loginForm').addEventListener('submit', async (e) => {
        e.preventDefault();
        const username = document.getElementById('username').value;
        const password = document.getElementById('password').value;
        const { data, status } = await fetchData('/user/login/', 'POST', { username, password });
        const msg = escapeHTML(data.message);
        
        
            console.log(data, status)

        if (data.otp_verification_url)
            renderOtpForm(escapeHTML(data.otp_verification_url), msg);
		else {
			box.innerHTML = `<p>${msg}</p>`;
        	window.history.pushState({ page: "loginResponse" }, "LoginResponse", '#loginResponse');
		}
    });
}
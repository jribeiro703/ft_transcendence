import { escapeHTML, showToast } from "../tools.js";
import { renderOtpForm } from "./renderOtpForm.js"
import { fetchData } from "../fetchData.js";

export function renderLoginForm() {
    const box = document.getElementById('mainContent');
    box.innerHTML = `
	<div class="custom-form">
        <form id="loginForm">
            <label for="username">Username:</label>
            <input type="text" id="username" name="username" required>
            <label for="password">Password:</label>
            <input type="password" id="password" name="password" required>
            <button type="submit">Submit</button>
        </form>
    </div>
    `;
	// history.pushState({page:'login'}, 'Login', '#login');

    document.getElementById('loginForm').addEventListener('submit', async (e) => {
        e.preventDefault();
        const username = document.getElementById('username').value;
        const password = document.getElementById('password').value;
        const responseObject = await fetchData('/user/login/', 'POST', { username, password });

        if (responseObject.data.otp_verification_url)
            renderOtpForm(escapeHTML(responseObject.data.otp_verification_url), responseObject.data.message);
        else
            showToast(responseObject.data.message, "error")
    });
}
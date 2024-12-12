import { escapeHTML, showErrorMessages } from "../tools.js";
import { renderOtpForm } from "./renderOtpForm.js"
import { fetchData } from "../fetchData.js";

export function renderLoginForm() {
    const box = document.getElementById('mainContent');
    box.innerHTML = `
	<div id="defaultView" class="d-flex flex-column justify-content-center align-items-center gap-5 h-100">
        <form id="loginForm" class="custom-form">
			<div class="custom-form-group">
				<label class="custom-label" for="username">Username:</label>
				<input class="custom-input" type="text" id="username" name="username" required>
			</div>
			<div class="custom-form-group">
				<label class="custom-label" for="password">Password:</label>
            	<input class="custom-input" type="password" id="password" name="password" required>
			</div>
			<button class="main-btn submit-btn height-btn" type="submit">Submit</button>
        </form>
    </div>
    `;

    document.getElementById('loginForm').addEventListener('submit', async (e) => {
        e.preventDefault();
        const username = document.getElementById('username').value;
        const password = document.getElementById('password').value;
        const responseObject = await fetchData('/user/login/', 'POST', { username, password }, false);

        if (responseObject.data.otp_verification_url)
            renderOtpForm(escapeHTML(responseObject.data.otp_verification_url), responseObject.data.message);
        else
            showErrorMessages(responseObject);
    });
}
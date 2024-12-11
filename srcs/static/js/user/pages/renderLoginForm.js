import { escapeHTML, showErrorMessages } from "../tools.js";
import { renderOtpForm } from "./renderOtpForm.js"
import { fetchData } from "../fetchData.js";

export function renderLoginForm() {
    const box = document.getElementById('mainContent');
    box.innerHTML = `
	<div class="custom-form">
        <form id="loginForm">
			<div class="form-group">
            	<div class="custom-label">
					<label for="username">Username:</label>
				</div>
            	<div class="custom-input">
					<input type="text" id="username" name="username" required>
				</div>
			</div>
			<div class="form-group">
            	<div class="custom-label">
					<label class="custom-label" for="password">Password:</label>
				</div>
            	<div class="custom-input">
            		<input class="custom-input" type="password" id="password" name="password" required>
				</div>
            </div>
			<button class="custom-submit-btn" type="submit">Submit</button>
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
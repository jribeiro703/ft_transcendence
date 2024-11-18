import { fetchData } from "./utils.js";
import { renderOtpForm } from "./otp-form.js"

export function renderLoginResponse(otpVerificationUrl, message) {
    const box = document.getElementById('mainContent');
    box.innerHTML = `
        <p>${message}<br><br>Enter your code</p>
    `;
    renderOtpForm(otpVerificationUrl);
}

function handleLoginResponse(data) {
    const box = document.getElementById('mainContent');

    if (data.otp_verification_url) {
        renderLoginResponse(data.otp_verification_url, data.message);
    } else {
        box.innerHTML = `<p>${data.message}</p>`;
    }
}

// view and eventlistener for login form
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
        const data = await fetchData('https://localhost:8081/user/login/', 'POST', { username, password });
        console.log('Login response:', data);

        handleLoginResponse(data);
        window.history.pushState({}, '', '#loginResponse');
    });
}
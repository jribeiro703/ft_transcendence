import { fetchData, escapeHTML } from "../../utils.js";
import { renderOtpForm } from "./renderOtpForm.js"

export function renderLoginResponse(responseObject, box) {
    if (responseObject.data.otp_verification_url)
        renderOtpForm(escapeHTML(responseObject.data.otp_verification_url), responseObject.data.message);
    else {
        box.innerHTML = `<p>${responseObject.data.message}</p>`;
        window.history.pushState({ page: "loginResponse" }, "LoginResponse", '#loginResponse');
    }
}

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
        const responseObject = await fetchData('/user/login/', 'POST', { username, password });

        renderLoginResponse(responseObject, box);
    });
}
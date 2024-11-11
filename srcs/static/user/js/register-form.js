import { fetchData } from "./utils.js";

function displayResponse(data) {
    const box = document.getElementById('authBox');
    box.innerHTML = `<pre>${JSON.stringify(data, null, 2)}</pre>`;
}

// view and eventlistener for register form
export function renderRegisterForm() {
    const box = document.getElementById('authBox');
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

    document.getElementById('registerForm').addEventListener('submit', async (e) => {
        e.preventDefault();
        const username = document.getElementById('username').value;
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;
        const data = await fetchData('https://localhost:8081/user/register/', 'POST', { username, email, password });
        console.log('Register response:', data);
        displayResponse(data);
        window.history.pushState({}, '', '#registerResponse');
    });
}
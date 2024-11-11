import { renderLoginForm, renderLoginResponse } from "./login-form.js"
import { renderRegisterForm } from "./register-form.js"
import { renderOtpForm } from "./otp-form.js";

// router for user authentication and its different views 
function router() {
    const box = document.getElementById('authBox');
    const hash = window.location.hash || '#auth';

    // clean the box before placing thw new view
    box.innerHTML = '';

    switch (hash) {
        case '#auth':
            box.innerHTML = `
                <button id="loginButton">Login</button>
                <button id="registerButton">Register</button>
                <button id="42loginButton">42 Login</button>
            `;
            document.getElementById('loginButton').addEventListener('click', () => {
                window.location.hash = '#login';
            });
            document.getElementById('registerButton').addEventListener('click', () => {
                window.location.hash = '#register';
        });
            document.getElementById('42loginButton').addEventListener('click', () => {
                window.location.hash = '#42login';
            });
            break;
        case '#login':
            renderLoginForm();
            break;
        case '#register':
            renderRegisterForm();
            break;
        case '#42login':
            box.innerHTML = '<h1>42 login not implemented yet</h1>';
            break;
        case '#otp':
            renderOtpForm();
            break;
        default:
            box.innerHTML = '<h1>Page not found</h1>';
            break;
    }
}

// event for profile button
document.getElementById('profileButton').addEventListener('click', () => {
    alert('Tu dois te connecter pour consulter ton profil.');
});

// call the router each time the hash changes
window.addEventListener('hashchange', router);

// Gérer les modifications de l'historique pour les réponses
window.addEventListener('popstate', () => {
    const hash = window.location.hash;
    if (hash === '#loginResponse') {
        renderLoginResponse();
    } else if (hash === '#registerResponse') {
        renderRegisterForm();
    } else {
        router();
    }
});

// Execute as soon as the structure of the page is ready for interaction
document.addEventListener('DOMContentLoaded', router);


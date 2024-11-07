// Fonction pour gérer la route actuelle et le contenu
function router() {
    const app = document.getElementById('dynamicBox');
    const hash = window.location.hash || '#home';

    // Vider le conteneur avant de charger la nouvelle vue
    app.innerHTML = '';

    switch (hash) {
        case '#home':
            app.innerHTML = `
                <button id="loginButton">Login</button>
                <button id="registerButton">Register</button>
                <button id="login42Button">42 Login</button>
            `;
            document.getElementById('loginButton').addEventListener('click', () => {
                window.location.hash = '#login';
            });
            document.getElementById('registerButton').addEventListener('click', () => {
                window.location.hash = '#register';
            });
            document.getElementById('login42Button').addEventListener('click', () => {
                window.location.hash = '#login42';
            });
            break;
        case '#login':
            renderLoginForm();
            break;
        case '#register':
            renderRegisterForm();
            break;
        case '#login42':
            app.innerHTML = '<h1>login 42 not implemented yet</h1>';
            break;
        case '#otp':
            renderOtpForm();
            break;
        default:
            app.innerHTML = '<h1>Page not found</h1>';
            break;
    }
}

// Fonction pour afficher le formulaire de connexion
function renderLoginForm() {
    const app = document.getElementById('dynamicBox');
    app.innerHTML = `
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
        // Afficher les données de connexion de manière dynamique
        handleLoginResponse(data);
        // Mise à jour de l'historique pour permettre de revenir à la page du formulaire
        window.history.pushState({}, '', '#loginResponse');
    });
}

// Fonction pour gérer la réponse de connexion
function handleLoginResponse(data) {
    const app = document.getElementById('dynamicBox');

    if (data.otp_verification_url) {
        // Afficher le message de succès et le formulaire OTP
        renderLoginResponse(data.otp_verification_url, data.message);
    } else {
        // Afficher le message d'erreur
        app.innerHTML = `<p>Erreur : ${data.message}</p>`;
    }
}

// Fonction pour afficher le formulaire OTP
function renderOtpForm(url) {
    const app = document.getElementById('dynamicBox');
    app.innerHTML += `
        <form id="otpForm">
            <label for="otpCode">OTP Code:</label>
            <input type="text" id="otpCode" name="otpCode" required>
            <button type="submit">Submit</button>
        </form>
    `;

    document.getElementById('otpForm').addEventListener('submit', async (e) => {
        e.preventDefault();
        const otpCode = document.getElementById('otpCode').value;
        const data = await fetchData(url, 'POST', { otpCode });
        console.log('OTP verification response:', data);
        // Afficher la réponse de la vérification OTP
        app.innerHTML = `<pre>${JSON.stringify(data, null, 2)}</pre>`;
    });
}

// Fonction pour afficher le formulaire de souscription
function renderRegisterForm() {
    const app = document.getElementById('dynamicBox');
    app.innerHTML = `
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
        // Afficher les données de souscription de manière dynamique
        displayResponse(data);
        // Mise à jour de l'historique pour permettre de revenir à la page du formulaire
        window.history.pushState({}, '', '#registerResponse');
    });
}

// Fonction pour afficher la réponse de la connexion
function renderLoginResponse(otpVerificationUrl, message = "Veuillez entrer votre code OTP:") {
    const app = document.getElementById('dynamicBox');
    app.innerHTML = `<p>${message}</p>`;
    renderOtpForm(otpVerificationUrl);
}

// Fonction pour afficher la réponse dans le dynamicBox (utilisée pour l'inscription)
function displayResponse(data) {
    const app = document.getElementById('dynamicBox');
    app.innerHTML = `<pre>${JSON.stringify(data, null, 2)}</pre>`;
}

// Fonction pour effectuer les appels API
async function fetchData(endpoint, method = 'GET', body = null) {
    try {
        const options = {
            method: method,
            headers: {
                'Content-Type': 'application/json'
            }
        };
        if (body) {
            options.body = JSON.stringify(body);
        }
        const response = await fetch(endpoint, options);
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error fetching data:', error);
    }
}

// Ajouter la fonctionnalité de message pour le bouton "P"
document.getElementById('profileButton').addEventListener('click', () => {
    alert('Tu dois te connecter pour consulter ton profil.');
});

// Écouter les changements dans l'URL
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

// Exécuter la fonction router au démarrage
document.addEventListener('DOMContentLoaded', router);


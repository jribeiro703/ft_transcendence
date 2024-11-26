import { getIdFromJWT, isAuthenticated } from "./utils.js";
import { renderPage } from "./historyManager.js";

document.getElementById('user-avatar').addEventListener('click', async () => {
	const authenticated = await isAuthenticated();
	
	if (authenticated) {
		renderPage("user");
	} else {
		renderPage("auth");
	}
});

document.getElementById('btn-Home').addEventListener('click', async () => {
	renderPage("home")
});

// Execute as soon as the structure of the page is ready for interaction
document.addEventListener('DOMContentLoaded', renderPage("home"));
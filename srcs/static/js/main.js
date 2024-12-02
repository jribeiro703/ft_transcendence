import { isAuthenticated } from "./user/token.js";
import { renderPage } from "./historyManager.js";
import { initGameVar, initEventListener } from './game/init.js';


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


// Execute as soon as the structure of the initial page is ready for interaction
document.addEventListener('DOMContentLoaded', () => {

	// listen for hash change to call right page render and push the state in history
	const hash = window.location.hash
	if (hash === "" || hash === "#home")
		renderPage("home");
	else
		renderPage(hash.substring(1));

	// initGameVar();
	// initEventListener();
});
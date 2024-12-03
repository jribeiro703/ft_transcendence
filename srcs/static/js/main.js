import { isAuthenticated } from "./user/isAuthenticated.js";
import { renderPage } from "./historyManager.js";
import { checkForAuthCode } from "./user/js/renderLogin42Page.js";

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
	checkForAuthCode();

	// listen for hash change to call right page render and push the state in history
	const hash = window.location.hash
	if (hash === "" || hash === "#home")
		renderPage("home");
	else
		renderPage(hash.substring(1));
});
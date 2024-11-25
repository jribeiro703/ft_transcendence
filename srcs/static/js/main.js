import { isAuthenticated } from "./utils.js";
import { renderPage } from "./historyManager.js";

document.getElementById('user-avatar').addEventListener('click', async () => {
	const authenticated = await isAuthenticated();
	
	if (authenticated) {
		// history.pushState({ page: "user" }, "User", "#user");
		renderPage("user");
	} else {
		// history.pushState({ page: "auth" }, "Auth", "#auth");
		renderPage("auth");
	}
});

document.getElementById('btn-Home').addEventListener('click', async () => {
	// history.pushState({ page: "home" }, "Home", "#home");
	renderPage("home")
});

// Execute as soon as the structure of the page is ready for interaction
document.addEventListener('DOMContentLoaded', renderPage("home"));
import { isAuthenticated } from "./user/isAuthenticated.js";
import { renderPage } from "./user/historyManager.js";
import { isGamePage } from "./game/HistoryManager.js";
import { renderPageGame } from "./game/HistoryManager.js";

document
  .querySelector("[data-profile-icon]")
  .addEventListener("click", async () => {
    const authenticated = await isAuthenticated();
    if (authenticated) {
      renderPage("user");
    } else {
      renderPage("auth");
    }
  });

document
  .querySelector("[data-home-icon]")
  .addEventListener("click", async () => {
    renderPage("home");
  });


// Execute as soon as the structure of the initial page is ready for interaction
document.addEventListener('DOMContentLoaded', () => {


	// listen for hash change to call right page render and push the state in history
	const hash = window.location.hash
	if (isGamePage(hash))
		renderPageGame(hash.substring(1));
	else if (hash === "" || hash === "#home")
		renderPage("home");
	else
		renderPage(hash.substring(1));
});


import { PONG_CARD, showToast } from "./user/tools.js";
import { isAuthenticated } from "./user/isAuthenticated.js";
import { renderPageGame } from "./game/HistoryManager.js";
import { showCreateTournamentForm } from "./tournament/tournamentPage.js";
import { showCreateTournamentForm2 } from "./tournament/tournamentPage.js";
import { renderPage } from "./user/historyManager.js";

function createHomeContent() {
  const box = document.getElementById("mainContent");
  box.innerHTML = `
            <div id="defaultView"
                 class="d-flex flex-column justify-content-center align-items-center gap-4 h-100">
              <img class="img-fluid neon-main-image main-img" src="${PONG_CARD}" alt="Pong Game">
              <button id="playsoloGameBtn" class="primaryBtn"><span class="homespan">Singleplayer</span></button>
              <button id="playmultiGameBtn" class="primaryBtn"><span class="homespan">Multiplayer</span></button>
              <button id="btn-Tournament" class="primaryBtn"><span class="homespan">Tournament</span></button>
              <button id="btn-Leaderboard" class="primaryBtn"><span class="homespan">LeaderBoard</span></button>
            </div>
            `;
}

async function renderHomePage() {
  createHomeContent();

  document.getElementById("playsoloGameBtn").addEventListener("click", () => {
    renderPageGame("gameSelectionSolo");
  });

  const authButtons = [
    {
      id: "playmultiGameBtn",
      handler: () => renderPageGame("gameSelectionMulti"),
    },
    {
      id: "btn-Leaderboard",
      handler: () => renderPage("leaderboard"),
    },
    {
      id: "btn-Tournament",
      handler: () => showCreateTournamentForm2(),
    },
  ];

  authButtons.forEach(({ id, handler }) => {
    document.getElementById(id).addEventListener("click", async () => {
      const authenticated = await isAuthenticated();
      if (!authenticated) {
        showToast("You must be logged in to use this feature.", "warning");
        return;
      }
      handler();
    });
  });
}

export { renderHomePage };

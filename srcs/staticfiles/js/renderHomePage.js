import { PONG_CARD, showToast } from "./user/tools.js";
import { isAuthenticated } from "./user/isAuthenticated.js";
import { renderPageGame } from "./game/pong/myHistory.js";
import { showCreateTournamentForm } from "./tournament/tournamentPage.js";

function createHomeContent() {
  const box = document.getElementById("mainContent");
  box.innerHTML = `
            <div id="defaultView"
                 class="d-flex flex-column justify-content-center align-items-center gap-5 h-100">
              <img class="img-fluid neon-white main-img" src="${PONG_CARD}" alt="Pong Game">
              <button id="playsoloGameBtn" class="main-btn btn custom-btn height-btn ">Single Player</button>
              <button id="playmultiGameBtn" class="main-btn btn custom-btn height-btn ">Multiplayer</button>
              <button id="btn-Tournament" class="main-btn btn custom-btn height-btn">Tournament</button>
              <button id="btn-Leaderboard" class="main-btn btn custom-btn height-btn">Leaderboard</button>
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
      handler: () => console.log("Leaderboard handler"),
    },
    {
      id: "btn-Tournament",
      handler: () => showCreateTournamentForm(),
    },
  ];

  authButtons.forEach(({ id, handler }) => {
    document.getElementById(id).addEventListener("click", async () => {
      const authenticated = await isAuthenticated();
      // if (!authenticated) {
      //   showToast("You must be logged in to use this feature.", "warning");
      //   return;
      // }
      handler();
    });
  });
}

export { renderHomePage };

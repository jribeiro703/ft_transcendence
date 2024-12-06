import { renderHomePage } from "./home.js";
import { renderAuthPage } from "./auth.js";
import { displayUserChoice } from "./user.js";
import { isAuthenticated, alertUserToLogin } from "./utils.js";

import { showTournamentView } from "./tournament/tournamentPage.js";
// import { showRegistration } from "./tournament/stages/registration.js";
// import { showBracketSetup } from "./tournament/stages/bracketSetup.js";
// import { showRound1 } from "./tournament/stages/round1.js";
// import { showRound2 } from "./tournament/stages/round2.js";
// import { showFinals } from "./tournament/stages/finals.js";

function router() {
  const box = document.getElementById("mainContent");
  const hash = window.location.hash;

  box.innerHTML = "";

  switch (hash) {
    case "#home":
    case "":
      renderHomePage();
      break;
    case "#user":
      if (isAuthenticated()) {
        displayUserChoice();
      } else {
        alertUserToLogin();
        renderAuthPage();
      }
      break;
    case "#tournament":
      showTournamentView();
      break;
    case "#tournament/registration":
      showRegistration();
      break;
    case "#tournament/bracketSetup":
      showBracketSetup();
      break;
    case "#tournament/round1":
      showRound1();
      break;
    case "#tournament/round2":
      showRound2();
      break;
    case "#tournament/finals":
      showFinals();
      break;
    default:
      renderHomePage();
      break;
  }
}

document.getElementById("btn-User").addEventListener("click", () => {
  window.location.hash = "#user";
});

document.querySelector("[data-home-icon]").addEventListener("click", () => {
  window.location.hash = "#home";
});

window.addEventListener("popstate", (event) => {
  if (event.state) {
    switch (event.state.page) {
      case "home":
        renderHomePage();
        break;
      case "user":
        renderUserPage();
        break;
      case "tournament":
        showTournamentView();
        break;
      case "tournament/registration":
        showRegistration();
        break;
      case "tournament/bracketSetup":
        showBracketSetup();
        break;
      case "tournament/round1":
        showRound1();
        break;
      case "tournament/round2":
        showRound2();
        break;
      case "tournament/finals":
        showFinals();
        break;
      default:
        renderHomePage();
        break;
    }
  } else {
    renderHomePage();
  }
});

// call the router each time the hash changes
window.addEventListener("hashchange", router);

// Execute as soon as the structure of the page is ready for interaction
document.addEventListener("DOMContentLoaded", router);


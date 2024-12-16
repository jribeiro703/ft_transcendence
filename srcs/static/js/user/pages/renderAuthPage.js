import { renderPage } from "../historyManager.js";
import { PONG_CARD } from "../tools.js";

function createAuthContent() {
  const box = document.getElementById("mainContent");

  box.innerHTML = `
            <div id="defaultView"
                 class="d-flex flex-column justify-content-center align-items-center gap-5 h-100">
              <img class="img-fluid neon-white main-img" src="${PONG_CARD}" alt="Pong Game">
			<button id="btn-Login" class="main-btn btn custom-btn height-btn">Login</button>
			<button id="btn-Register" class="main-btn btn custom-btn height-btn">Register</button>
			<button id="btn-Login42" class="main-btn btn custom-btn height-btn">42 Login</button>
            </div>
	`;
}

export function renderAuthPage() {
  createAuthContent();

  document.getElementById("btn-Login").addEventListener("click", () => {
    renderPage("login");
  });

  document.getElementById("btn-Register").addEventListener("click", () => {
    renderPage("register");
  });

  document.getElementById("btn-Login42").addEventListener("click", () => {
    renderPage("login42");
  });
}

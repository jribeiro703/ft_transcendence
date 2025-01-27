import { renderPage } from "../historyManager.js";
import { PONG_CARD } from "../tools.js";

function createAuthContent() {
  const box = document.getElementById("mainContent");

  box.innerHTML = `
			<div id="defaultView"
				 class="d-flex flex-column justify-content-center align-items-center gap-4 h-100 w-100">
			  <img class="img-fluid neon-main-image main-img" src="${PONG_CARD}" alt="Pong Game">
			<button id="btn-Login" class="primaryBtn w-380"><span>Login</span></button>
			<button id="btn-Register" class="primaryBtn w-380"><span>Register</span></button>
			<button id="btn-Login42" class="primaryBtn w-380"><span>42 Login</span></button>
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

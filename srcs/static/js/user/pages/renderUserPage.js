import { fetchData, fetchAuthData } from "../fetchData.js";
import { showToast, PONG_CARD, showErrorMessages } from "../tools.js";
import { renderPage } from "../historyManager.js";

function createUserContent() {
  const box = document.getElementById("mainContent");
  box.innerHTML = `
		<div id="defaultView"
			class="d-flex flex-column justify-content-center align-items-center gap-4 h-100">
			<img class="img-fluid neon-white main-img" src="${PONG_CARD}" alt="Pong Game">
			<button id= btn-Profile class="primaryBtn"><span>Profile</span></button>
			<button id= btn-Settings class="primaryBtn"><span>Settings</span></button>
			<button id= btn-Inbox class="primaryBtn"><span>Inbox</span></button>
			<button id= btn-Logout class="primaryBtn"><span>Logout</span></button>
		</div>
	`;
}

export function renderUserPage() {
  createUserContent();

  document.getElementById("btn-Profile").addEventListener("click", () => {
    renderPage("selfProfile");
  });

  document.getElementById("btn-Settings").addEventListener("click", () => {
    renderPage("settings");
  });

  document.getElementById("btn-Inbox").addEventListener("click", () => {
    console.log("Inbox button clicked");
  });

  document.getElementById("btn-Logout").addEventListener("click", async (e) => {
    e.preventDefault();

    const confirmation = confirm("Are you sure to logout ?");
    if (!confirmation) return;

    const responseObject = await fetchAuthData(
      "/user/logout/",
      "POST",
      null,
      false,
    );

    if (responseObject.status == 200) {
      console.log(responseObject);
      showToast(responseObject.data.message, "success");
      // sessionStorage.clear();
      localStorage.clear();
      renderPage("home");
    } else {
      console.log(responseObject);
      showErrorMessages(responseObject);
    }
  });
}

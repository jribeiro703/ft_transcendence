import { fetchData } from "../fetchData.js";
import { showToast, PONG_CARD } from "../tools.js";
import { renderPage } from "../historyManager.js";

function createUserContent() {
  const box = document.getElementById("mainContent");
  box.innerHTML = `

            <div id="defaultView"
                 class="d-flex flex-column justify-content-center align-items-center gap-5 h-100">
              <img class="img-fluid neon-white main-img" src="${PONG_CARD}" alt="Pong Game">
            <button id= btn-Profile class="main-btn btn custom-btn height-btn">Profile</button>
            <button id= btn-Settings class="main-btn btn custom-btn height-btn">Settings</button>
            <button id= btn-Inbox class="main-btn btn custom-btn height-btn">Inbox</button>
            <button id= btn-Logout class="main-btn btn custom-btn height-btn">Logout</button>
            </div>
    `;
}

export function renderUserPage() {
  createUserContent();

  document.getElementById("btn-Profile").addEventListener("click", () => {
    renderPage("profile");
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

    const responseObject = await fetchData(
      "/user/logout/",
      "POST",
      null,
      false,
      "simple",
    );

    if (responseObject.status == 205) {
      showToast(responseObject.data.message, "success");
      sessionStorage.clear();
      renderPage("home");
    } else showToast(responseObject.data.message, "error");
  });
}

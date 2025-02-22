import { fetchData, fetchAuthData } from "../fetchData.js";
import { showToast, PONG_CARD, showErrorMessages } from "../tools.js";
import { renderPage } from "../historyManager.js";

function createUserContent() {
  const box = document.getElementById("mainContent");
  box.innerHTML = `
		<div id="defaultView"
			class="d-flex flex-column justify-content-center align-items-center gap-4 h-100 w-100">
			<img class="img-fluid neon-main-image main-img" src="${PONG_CARD}" alt="Pong Game">
			<button id= btn-Profile class="primaryBtn w-380"><span>Profile</span></button>
			<button id= btn-Settings class="primaryBtn w-380"><span>Settings</span></button>
			<button id= btn-Logout class="primaryBtn w-380"><span>Logout</span></button>
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
      renderPage("home", true, "", true);
      document.dispatchEvent(
        new CustomEvent("Logout", {
          detail: {
            reload_chat: true,
          },
        }),
      );
    } else {
      console.log(responseObject);
      showErrorMessages(responseObject);
    }
  });
}

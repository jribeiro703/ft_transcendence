import { fetchData } from "../fetchData.js";
import { showToast } from "../tools.js";
import { renderPage } from "../historyManager.js";

async function renderLogin42Page() {

    let responseObject = await fetchData(`/user/login42/auth_url/`, "GET", null, false);
    if (responseObject.status === 200 && responseObject.data.auth_url) {
		// sessionStorage.setItem("access_token", "");
		localStorage.setItem("access_token", "");
		window.location.href = responseObject.data.auth_url;
    } else {
		console.error("renderLogin42Page: failed to get 42 auth url");
		showToast("Failed to get 42 auth url", "error");
		renderPage("auth");
    }
}

export { renderLogin42Page };
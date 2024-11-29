import { isAuthenticated, getIdFromJWT } from "./user/token.js";
import { renderPage } from "./historyManager.js";
import { fetchData } from "./user/fetchData.js";
import { DEFAULT_AVATAR } from "./user/tools.js";

document.getElementById('user-avatar').addEventListener('click', async () => {
	
	const authenticated = await isAuthenticated();
	if (authenticated) {
		renderPage("user");
	} else {
		renderPage("auth");
	}
});

document.getElementById('btn-Home').addEventListener('click', async () => {
	renderPage("home")
});

async function updateUserAvatar() {
    const avatar = document.getElementById("user-avatar");
	const pk = getIdFromJWT(localStorage.getItem('access_token'));
	if (!avatar || !pk) {
		console.warn("updateUserAvatar(): avatar element or pk not found");
		return;
	}
    try {
		const userData = await fetchData(`/user/settings/${pk}/`);
		if (!userData) {
			console.warn("updateUserAvatar(): get user data failed");
			avatar.src = DEFAULT_AVATAR;
			return;
		}
		const userAvatar = userData.data.avatar;
		const src = userAvatar.substring(userAvatar.indexOf('/media'));
		avatar.src = src;
    } catch (error) {
		console.error(`updateUserAvatar(): ${error}`);
		avatar.src = DEFAULT_AVATAR;
    }
}

// Execute as soon as the structure of the page is ready for interaction
document.addEventListener('DOMContentLoaded', async () => {
	
	const authenticated = await isAuthenticated();
	if (authenticated) {
		await updateUserAvatar();
	}

	const hash = window.location.hash.substring(1);
	if (hash)
		renderPage(hash)
	else
		renderPage("home");
});
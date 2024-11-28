import { renderProfilePage } from "./user/js/renderProfilePage.js";
import { renderSettingsPage } from "./user/js/renderSettingPage.js";
import { PONG_CARD, escapeHTML } from "./user/tools.js"
import { fetchData } from "./user/fetchData.js";

function createUserContent() {
    const box = document.getElementById('mainContent');
    box.innerHTML = `
		<div id="defaultView">
			<div class="container">
				<div class="mx-auto">
					<img class="img-fluid" src="${PONG_CARD}" alt="Pong Game">
					<br><br><br>
				</div>
			</div>
		</div>
        <div class="container py-2 d-flex flex-column align-items-center py-2">
            <button id= btn-Profile class="btn custom-btn mb-4">Profile</button>
			<button id= btn-Settings class="btn custom-btn mb-4">Settings</button>
            <button id= btn-Inbox class="btn custom-btn mb-4">Inbox</button>
            <button id= btn-Logout class="btn custom-btn mb-4">Logout</button>
        </div>
    `;
	history.pushState({ page: "user" }, "User", "#user");
}

export function renderUserPage() {

	createUserContent();

	document.getElementById('btn-Profile').addEventListener('click', () => {
		history.pushState({ page: 'profile' }, 'Profile', '#profile');
		renderProfilePage();
	})

	document.getElementById('btn-Settings').addEventListener('click', () => {
		history.pushState({ page: 'settings' }, 'Settings', '#settings');
		renderSettingsPage();
	})

	document.getElementById('btn-Inbox').addEventListener('click', () => {
		history.pushState({ page: 'inbox' }, 'Inbox', '#inbox');
		console.log('Inbox button clicked');
	})

	document.getElementById('btn-Logout').addEventListener('click', async(e) => {
		e.preventDefault();

		const confirmation = confirm("Are you sure to logout ?");
		if (!confirmation)
			return;
		
		const box = document.getElementById('mainContent');
		const responseObject = await fetchData('/user/logout/', 'POST');

		if (responseObject.status == 205)
			localStorage.setItem('access_token', responseObject.access_token);
		showToast(responseObject.message, "success");
		history.pushState({ page: 'logout' }, 'Logout', '#logout');
	});

}

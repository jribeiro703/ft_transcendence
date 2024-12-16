import { fetchData, fetchAuthData } from "../fetchData.js";
import { showToast, PONG_CARD, showErrorMessages } from "../tools.js";
import { renderPage } from "../historyManager.js";

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
}

export function renderUserPage() {

	createUserContent();

	document.getElementById('btn-Profile').addEventListener('click', () => {
		renderPage("profile");
	})

	document.getElementById('btn-Settings').addEventListener('click', () => {
		renderPage("settings")
	})

	document.getElementById('btn-Inbox').addEventListener('click', async () => {
		console.log('Inbox button clicked');
		const responseObject = await fetchAuthData("/user/online/", "GET", null, false);
		console.log(responseObject);
	})

	document.getElementById('btn-Logout').addEventListener('click', async(e) => {
		e.preventDefault();

		const confirmation = confirm("Are you sure to logout ?");
		if (!confirmation)
			return;

		const responseObject = await fetchAuthData('/user/logout/', 'POST', null, false);

		if (responseObject.status == 205) {
			console.log(responseObject);
			showToast(responseObject.data.message, "success");
			// sessionStorage.clear();
			localStorage.clear();
			renderPage("home");
		} else
		{
			console.log(responseObject);
			showErrorMessages(responseObject);
		}
	});

}

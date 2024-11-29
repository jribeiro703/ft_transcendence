import { escapeHTML } from "../tools.js";
import { getIdFromJWT } from "../token.js";
import { fetchData } from "../fetchData.js";
import { createDialog, listenForDialog, deleteAccount, addNewFriend, uploadAvatar } from "./settingsPageTools.js";

async function createSettingsPage(mainContent, pk) {
	mainContent.innerHTML = `
		<div id="settings-container">
			<div id="user-info">
				<div id="avatar-container">
			    	<img id="avatar" src="" alt="Avatar" class="avatar">
					<button id="upload-avatar-btn" class="upload-btn">Upload</button>
				</div>
			    <p>Username: <span id="username"></span></p>
			    <p>
					Alias: <span id="alias"></span>
					<button id="change-alias-btn" class="change-btn">Change</button>
				</p>
			    <p>
					Email: <span id="email"></span>
					<button id="change-email-btn" class="change-btn">Change</button>
				</p>
				<p>
					Password: <span id="password"></span>
					<button id="change-password-btn" class="change-btn">Change</button>
				</p>
			</div>

			<div id="friend-request">
				<label for="new-friend-username">Add new friend:</label>
				<input type="text" id="new-friend-username" placeholder="Friend's username" required>
				<span id="error-message" style="color: red; display: none;">Please enter a valid username!</span>
				<button type="submit" id="send-friend-request-btn">Send</button>
			</div>

			<button id="delete-account-btn">Delete Account</button>
    	</div>
	`
	const responseObject = await fetchData(`/user/settings/${pk}`);

	if (responseObject.status === 200) {
		const data = responseObject.data;
		const avatarPath = data.avatar.substring(data.avatar.indexOf('/media'));
		document.getElementById("avatar").src = avatarPath;
		document.getElementById("username").textContent = data.username;
		document.getElementById("alias").textContent = data.alias;
		document.getElementById("email").textContent = data.email;
	} else {
		console.warn("createSettingsPage: Retrieve user informations failed: ", responseObject.data);
		mainContent.innerHTML = `
		<div>	
			<p>Error: Can not open settings page</p>
		</div>
		`
	}
}

export async function renderSettingsPage() {
	const mainContent = document.getElementById("mainContent");
	const pk = getIdFromJWT(localStorage.getItem("access_token"));

	await createSettingsPage(mainContent, pk);

	let dialogConfig;
	document.getElementById("change-alias-btn").addEventListener("click", async (e) => {
		dialogConfig = {
			id: "alias-dialog",
			currentLabel: "Current Alias: ",
			currentInputId: "current-alias",
			currentInputValue: escapeHTML(document.getElementById("alias").textContent),
			newLabel: "New Alias: ",
			newInputId: "new-alias",
		}
		const dialogElement = await createDialog(mainContent, dialogConfig);
		listenForDialog(mainContent, dialogElement, pk, "new-alias", "alias");
	});

	document.getElementById("change-email-btn").addEventListener("click", async (e) => {
		dialogConfig = {
			id: "email-dialog",
			currentLabel: "Current Email: ",
			currentInputId: "current-email",
			currentInputValue: escapeHTML(document.getElementById("email").textContent),
			newLabel: "New Email: ",
			newInputId: "new-email",
		}
		const dialogElement = await createDialog(mainContent, dialogConfig);
		listenForDialog(mainContent, dialogElement, pk, "new-email", "new_email");
	});

	document.getElementById("change-password-btn").addEventListener("click", async (e) => {
		dialogConfig = {
			id: "password-dialog",
			currentLabel: "Current Password: ",
			currentInputId: "current-password",
			currentInputValue: null,
			newLabel: "New Password: ",
			newInputId: "new-password",
		}
		const dialogElement = await createDialog(mainContent, dialogConfig);
		listenForDialog(mainContent, dialogElement, pk, "new-password", "password");
	});

	document.getElementById("upload-avatar-btn").addEventListener("click", async (e) => {
		await uploadAvatar(pk);
	});

	document.getElementById("delete-account-btn").addEventListener("click", async (e) => {
		await deleteAccount(pk);
	});

	document.getElementById("send-friend-request-btn").addEventListener("click", async (e) => {
		await addNewFriend(pk);
	});
}

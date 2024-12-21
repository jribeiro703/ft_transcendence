import { escapeHTML } from "../tools.js";
import { fetchData, fetchAuthData } from "../fetchData.js";
import { createDialog, listenForDialog, deleteAccount, addNewFriend, uploadAvatar } from "./settingsPageTools.js";

async function createSettingsPage(mainContent, pk) {
	const responseObject = await fetchAuthData(`/user/settings/${pk}`, "GET", null, false);

	if (responseObject.status === 200) {
		const data = responseObject.data;
		const avatarPath = data.avatar.substring(data.avatar.indexOf('/media'));

		mainContent.innerHTML = `
			<div id="settings-container">
				<div id="user-info">
					<div id="avatar-container">
						<img id="avatar" src="${avatarPath}" alt="Avatar" class="avatar">
						<button id="upload-avatar-btn" class="upload-arrow-btn">▲</button>
						<p id="username-container"><span id="username">${data.username}</span></p>
					</div>
					<p>
						Alias: <span id="alias">${data.alias ? data.alias : "none"}</span>
						<input type="text" id="alias-input" value="${data.alias ? data.alias : "none"}" style="display:none">
						<button id="change-alias-btn" class="change-btn">Change</button>
						<button id="save-alias-btn" class="save-btn" style="display:none;">Save</button>
					</p>
					<p>Email: <span id="email">${data.email}</span>
					<input type="text" id="email-input" value="${data.email ? data.email : "none"}" style="display:none;">
					${!data.is_42_user ? '<button id="change-email-btn" class="change-btn">Change</button>' : ''}
					</p>
					${!data.is_42_user ? '<p>Password: <span id="password"></span>' : ''}
					${!data.is_42_user ? '<button id="change-password-btn" class="change-btn">Change</button>' : ''}
				</div>

				<div id="friend-request" display="none">
					<label for="new-friend-username">Add new friend:</label>
					<input type="text" id="new-friend-username" placeholder="Friend's username" required>
					<span id="error-message" style="color: red; display: none;">Please enter a valid username!</span>
					<button type="submit" id="send-friend-request-btn">Send</button>
				</div>

				<button id="delete-account-btn">Delete Account</button>
			</div>
		`;
	} else {
		console.warn("createSettingsPage: Retrieve user informations failed: ", responseObject.data);
		mainContent.innerHTML = `
		<div>	
			<p>Error: Can not open settings page</p>
		</div>
		`;
	}
}

export async function oldRenderSettingsPage() {
	const mainContent = document.getElementById("mainContent");
	let responseObject = await fetchAuthData("/user/private/pk/", "GET", null, false);
	if (responseObject.status !== 200) {
		showToast("An error occurred while getting your settings data.", "error");
		return;
	}
	const pk = responseObject.data.pk;

	await createSettingsPage(mainContent, pk);

	const userResponse = await fetchAuthData(`/user/settings/${pk}`, "GET", null, false);
	if (userResponse.status === 200 && !userResponse.data.is_42_user) {
		document.getElementById("change-email-btn")?.addEventListener("click", async (e) => {
			const dialogConfig = {
				id: "email-dialog",
				currentLabel: "Current Email: ",
				currentInputId: "current-email",
				currentInputValue: escapeHTML(document.getElementById("email").textContent),
				newLabel: "New Email: ",
				newInputId: "new-email",
			};
			const dialogElement = await createDialog(mainContent, dialogConfig);
			listenForDialog(mainContent, dialogElement, pk, "new-email", "new_email");
		});

		document.getElementById("change-password-btn")?.addEventListener("click", async (e) => {
			const dialogConfig = {
				id: "password-dialog",
				currentLabel: "Current Password: ",
				currentInputId: "current-password",
				currentInputValue: null,
				newLabel: "New Password: ",
				newInputId: "new-password",
			};
			const dialogElement = await createDialog(mainContent, dialogConfig);
			listenForDialog(mainContent, dialogElement, pk, "new-password", "password");
		});
	}

	document.getElementById("change-alias-btn").addEventListener("click", async (e) => {
		const dialogConfig = {
			id: "alias-dialog",
			currentLabel: "Current Alias: ",
			currentInputId: "current-alias",
			currentInputValue: escapeHTML(document.getElementById("alias").textContent),
			newLabel: "New Alias: ",
			newInputId: "new-alias",
		};
		const dialogElement = await createDialog(mainContent, dialogConfig);
		listenForDialog(mainContent, dialogElement, pk, "new-alias", "alias");
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

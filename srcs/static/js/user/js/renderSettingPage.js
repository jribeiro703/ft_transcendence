import { fetchData, getIdFromJWT  } from "../../utils.js";

async function createSettingsPage(pk) {
	const box = document.getElementById("mainContent");
	box.innerHTML = `
		<div id="settings-container">
			<div id="user-info">
			    <img id="avatar" src="" alt="Avatar" class="avatar">
				<button id="change-avatar-btn" class="change-btn">Change</button>
			    <p>
					Username: <span id="username"></span>
				</p>
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
		const avatarPAth = data.avatar.substring(data.avatar.indexOf('/media'));
		document.getElementById("avatar").src = avatarPAth;
		document.getElementById("username").textContent = data.username;
		document.getElementById("alias").textContent = data.alias;
		document.getElementById("email").textContent = data.email;
	}
	else {
		console.log("Retrieve failed: ", responseObject.data);
		box.innerHTML = `<p>Error: Can not open settings page</p>`
	}
}

async function deleteAccount(pk) {
	const confirmation = confirm("Are you sure you want to delete your account? This action is irreversible.");
	if (!confirmation) {
		return;
	}
	const { responseObject } = await fetchData(`/user/settings/${pk}/`, 'DELETE');
	alert(responseObject.data.message)
	if (responseObject.status === 205) {
		localStorage.setItem('access_token', "");
		renderPage("home")
	}
}

async function addNewFriend(pk) {
    const newFriendUsername = document.getElementById("new-friend-username").value;

    if (!newFriendUsername) {
        alert("Please enter a username to add as a friend.");
        return;
    }
    const { responseObject } = await fetchData(`/user/settings/${pk}/`, 'PATCH', {new_friend: `${newFriendUsername}`});
	alert(responseObject.data.message);
}

function DialogObj(id, currentLabel, currentLabelId, newLabel, newLabelId) {
	this.id = id;
	this.currentLabel = currentLabel;
	this.currentLabelId = currentLabelId;
	this.newLabel = newLabel;
	this.newLabelId = newLabelId;
}

function createADialog(dialog) {
	const mainContent = document.getElementById("mainContent");
	
	const dialogElement = document.createElement('dialog');
	dialogElement.id = dialog.id;
	dialogElement.innerHTML = `
		<form method="dialog">
			<p>
				<label>${dialog.currentLabel}</label>
				<input type="text" id=${dialog.currentLabelId} readonly>
			</p>
			<p>
				<label>${dialog.newLabel}</label>
				<input type="url" id="${dialog.newLabelId}">
			</p>
			<menu>
				<button id="cancel-btn">Cancel</button>
				<button id="save-btn">Save</button>
			</menu>
		</form>
	`
	mainContent.appendChild(dialogElement);
}

export async function renderSettingsPage() {

	const pk = getIdFromJWT();
	await createSettingsPage(pk);
	let dialog;

	// document.getElementById("change-avatar-btn").addEventListener("click", async (e) => {
	// 	dialog = new DialogObj("avatar-dialog", "Current Avatar: ", "current-avatar", "New Avatar: ", "new-avatar");
	// 	createADialog(dialog);
	// 	document.getElementById("save-btn").addEventListener("click", async (e) => {
	// 		const responseObject = await fetchData(`/user/settings/${pk}`, PATCH);
	// 		console.log(responseObject.status);
	// 	})
	// 	document.getElementById("cancel-btn").addEventListener("click", (e) => {
	// 		return ;
	// 	})
	// });

	// document.getElementById("change-email-btn").addEventListener("click", async (e) => {
	// });
	document.getElementById("change-alias-btn").addEventListener("click", async (e) => {

		dialog = new DialogObj("alias-dialog", "Current Alias: ", "current-alias", "New Alias: ", "new-alias");
		createADialog(dialog);
		document.getElementById(dialog.id).showModal();
		const currentAliasValue = getElementById(dialog.currentLabelId).value;
		const newAlias = document.getElementById(dialog.newLabelId).value;

		document.getElementById("save-btn").addEventListener("click", async (e) => {
			const responseObject = await fetchData(`/user/settings/${pk}`, PATCH, { alias: newAlias });
			console.log(responseObject.status);
		})
		document.getElementById("cancel-btn").addEventListener("click", (e) => {
			return ;
		})
	});
	// document.getElementById("change-password-btn").addEventListener("click", async (e) => {
	// });


	document.getElementById("send-friend-request-btn").addEventListener("click", async (e) => {
		addNewFriend(pk);
	});

	document.getElementById("delete-account-btn").addEventListener("click", async (e) => {
		deleteAccount(pk);
	});


}
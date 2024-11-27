import { fetchData, getIdFromJWT  } from "../../utils.js";

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
	// for retrieve user informations
	const responseObject = await fetchData(`/user/settings/${pk}`);

	if (responseObject.status === 200) {
		const data = responseObject.data;
		const avatarPath = data.avatar.substring(data.avatar.indexOf('/media'));
		console.log("avatar path: ",avatarPath);
		document.getElementById("avatar").src = avatarPath;
		document.getElementById("username").textContent = data.username;
		document.getElementById("alias").textContent = data.alias;
		document.getElementById("email").textContent = data.email;
	}
	else {
		console.log("Retrieve failed: ", responseObject.data);
		box.innerHTML = `<p>Error: Can not open settings page</p>`
	}
	history.pushState({page:'settings'}, 'Settings', '#settings');
}

function DialogConfig(id, currentLabel, currentInputId,currentInputValue, newLabel, newInputId, inputType) {
	this.id = id;
	this.currentLabel = currentLabel;
	this.currentInputId = currentInputId;
	this.currentInputValue = currentInputValue;
	this.newLabel = newLabel;
	this.newInputId = newInputId;
	this.inputType = inputType;
}

function createADialog(dialogConfig, pk, key) {
	const mainContent = document.getElementById("mainContent");
	
	const dialogElement = document.createElement('dialog');
	dialogElement.id = dialogConfig.id;
	dialogElement.innerHTML = `
		<form method="dialog">
			<p>
				<label>${dialogConfig.currentLabel}</label>
				<input type=${dialogConfig.inputType} id=${dialogConfig.currentInputId} readonly>
			</p>
			<p>
				<label>${dialogConfig.newLabel}</label>
				<input type=${dialogConfig.inputType} id="${dialogConfig.newInputId}">
			</p>
			<menu>
				<button id="cancel-btn">Cancel</button>
				<button id="save-btn">Save</button>
			</menu>
		</form>
	`
	mainContent.appendChild(dialogElement);
	if (dialogConfig.currentInputValue)
		document.getElementById(dialogConfig.currentInputId).value = dialogConfig.currentInputValue;
	dialogElement.showModal();

	document.getElementById("save-btn").addEventListener("click", async (e) => {
		const newValue = document.getElementById(dialogConfig.newInputId).value;
		const responseObject = await fetchData(`/user/settings/${pk}/`, "PATCH", { [key]: newValue });
		if (responseObject.status === 200)
			alert(responseObject.data[key]);
		else
			alert(responseObject.data.message);
		dialogElement.close();
		mainContent.removeChild(dialogElement);
	})
	document.getElementById("cancel-btn").addEventListener("click", (e) => {
		dialogElement.close();
		mainContent.removeChild(dialogElement);
	})
}

export async function renderSettingsPage() {

	const pk = getIdFromJWT();
	await createSettingsPage(pk);
	let currentInputValue;
	let dialogConfig;

	document.getElementById("change-alias-btn").addEventListener("click", async (e) => {
		currentInputValue = document.getElementById("alias").textContent;
		dialogConfig = new DialogConfig("alias-dialog", "Current Alias: ", "current-alias", currentInputValue, "New Alias: ", "new-alias", "text");
		createADialog(dialogConfig, pk, "alias");
	});

	document.getElementById("change-email-btn").addEventListener("click", async (e) => {
		currentInputValue = document.getElementById("email").textContent;
		dialogConfig = new DialogConfig("email-dialog", "Current Email: ", "current-email", currentInputValue, "New Email: ", "new-email", "text");
		createADialog(dialogConfig, pk, "new_email");
	});

	document.getElementById("change-password-btn").addEventListener("click", async (e) => {
		currentInputValue = document.getElementById("password").textContent;
		dialogConfig = new DialogConfig("password-dialog", "Current Password: ", "current-password", currentInputValue, "New Password: ", "new-password", "password");
		createADialog(dialogConfig, pk, "new_password");
	});
	
	document.getElementById("send-friend-request-btn").addEventListener("click", async (e) => {
		addNewFriend(pk);
	});

	document.getElementById("delete-account-btn").addEventListener("click", async (e) => {
		deleteAccount(pk);
	});


}
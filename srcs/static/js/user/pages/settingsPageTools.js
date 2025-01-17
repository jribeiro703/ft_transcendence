import { fetchData, fetchAuthData } from "../fetchData.js";
import { showToast, showErrorMessages } from "../tools.js";
import { renderPage } from "../historyManager.js";
import { escapeHTML } from "../tools.js";

async function createDialog(mainContent, dialogConfig) {
	const dialogElement = document.createElement('dialog');
	dialogElement.id = dialogConfig.id;

	const isPasswordDialog = dialogConfig.id === "password-dialog";
	const inputType = isPasswordDialog ? "password" : "text";
	const readonlyAttr = isPasswordDialog ? "" : "readonly";

	dialogElement.innerHTML = `
		<form method="dialog">
			<p>
				<label>${dialogConfig.currentLabel}</label>
				<input type=${inputType} id="${dialogConfig.currentInputId}" ${readonlyAttr}>
			</p>
			<p>
				<label>${dialogConfig.newLabel}</label>
				<input type=${inputType} id="${dialogConfig.newInputId}">
			</p>
			<menu>
				<button type="button" id="cancel-btn">Cancel</button>
				<button type="submit" id="save-btn">Save</button>
			</menu>
		</form>
	`
	mainContent.appendChild(dialogElement);
	if (dialogConfig.currentInputValue)
		document.getElementById(dialogConfig.currentInputId).value = dialogConfig.currentInputValue;
	dialogElement.showModal();
	return dialogElement;
}

async function listenForDialog(mainContent, dialogElement, pk, newInputId, key) {
	document.getElementById("save-btn").addEventListener("click", async (e) => {
		e.preventDefault();
		const isPasswordDialog = dialogElement.id === "password-dialog";
		let body;

		if (isPasswordDialog) {
			const oldPassword = document.getElementById("current-password").value;
			const newPassword = document.getElementById("new-password").value;
			body = { 
				password: oldPassword,
				new_password: newPassword 
			};
        } else {
            const newValue = document.getElementById(newInputId).value;
			body = { [key]: newValue };
		}

		const responseObject = await fetchAuthData(`/user/settings/${pk}/`, "PATCH", body, false);
		if (responseObject.status === 200) {
			if (!isPasswordDialog)
				renderPage("settings", false);
			showToast(responseObject.data.message, "success");
		} else
			showErrorMessages(responseObject);
		dialogElement.close();
		mainContent.removeChild(dialogElement);
	})
	document.getElementById("cancel-btn").addEventListener("click", (e) => {
		dialogElement.close();
		mainContent.removeChild(dialogElement);
	})
}

async function updateUserData(pk, body = {}) {
	const responseObject = await fetchAuthData(`/user/settings/${pk}/`, "PATCH", body, false);
	if (responseObject.status !== 200) {
		showErrorMessages(responseObject);
		return;
	}
	showToast(responseObject.data.message, "success");
	renderPage("settings", false);
}

async function listenChangeAlias(pk) {
	document.getElementById("save-alias-btn").addEventListener("click", async(e) => {
		const newAlias = document.getElementById('alias-input').value;
		if (newAlias)
			updateUserData(pk, { alias: escapeHTML(newAlias) });
		else
			showToast("Please enter a new alias.", "error");
	});
}

async function listenChangeEmail(pk) {
	document.getElementById("save-email-btn").addEventListener("click", async(e) => {
		const newEmail = document.getElementById('email-input').value;
		if (newEmail)
			updateUserData(pk, { new_email: escapeHTML(newEmail) });
		else
			showToast("Please enter a new email.", "error");
	});
}

async function listenChangePassword(pk) {
	document.getElementById("save-password-btn").addEventListener("click", async(e) => {
		const currentPassword = document.getElementById('current-password-input').value
		const newPassword = document.getElementById('new-password-input').value;
		if (currentPassword && newPassword)
			updateUserData(pk, { password: escapeHTML(currentPassword), new_password: escapeHTML(newPassword) });
		else	
			showToast("Please enter your current and new password.", "error");
	});
}

async function listenAddNewFriend(pk) {
	document.getElementById("send-friend-request-btn").addEventListener("click", async (e) => {
    	const newFriendUsername = document.getElementById("new-friend-username").value;
    	if (!newFriendUsername) {
    	    showToast("Please enter a username to add as a friend.", "error");
    	    return;
    	}
		updateUserData(pk, { new_friend: newFriendUsername });
	});
}

async function uploadAvatar(pk) {
	const fileInput = document.createElement('input');
	fileInput.type = 'file';
	fileInput.accept = 'image/jpeg, image/png, image/gif';
	
	fileInput.addEventListener('change', async (e) => {
		const file = e.target.files[0];
		if (!file) {
			alert('No file selected');
			return;
		}
		
		const validTypes = ['image/jpeg', 'image/png', 'image/gif'];
		if (!validTypes.includes(file.type)) {
			alert('Unsupported file format. Use JPG, PNG or GIF.');
			return;
		}
		
		const maxSize = 1 * 1024 * 1024;
		if (file.size > maxSize) {
			alert(`The file is too large. Maximum size: ${maxSize / 1024 / 1024}MB`);
			return;
		}
		
		const formData = new FormData();
		formData.append('avatar', file);
		
		const responseObject = await fetchAuthData(`/user/settings/${pk}/`, 'PATCH', formData, true);
		if (responseObject.status === 200) {
			showToast(responseObject.data.message, "success");
			renderPage("settings", false);
		} else {
			showErrorMessages(responseObject);
		}
	});
	
	fileInput.click();
}

async function deleteAccount(pk) {
	const confirmation = confirm("Are you sure you want to delete your account? This action is irreversible.");
	if (!confirmation) {
		return;
	}
	const responseObject = await fetchAuthData(`/user/settings/${pk}/`, 'DELETE', null, false);
	if (responseObject.status === 205) {
		showToast(responseObject.data.message, "success");
		// sessionStorage.clear();
		localStorage.clear();
		renderPage("home")
	} else
		showErrorMessages(responseObject);
}

export { 
	createDialog, listenForDialog,
	deleteAccount, listenAddNewFriend, uploadAvatar,
	listenChangeAlias, listenChangeEmail, listenChangePassword };

	

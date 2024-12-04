import { fetchData } from "../fetchData.js";
import { showToast } from "../tools.js";
import { renderPage } from "../historyManager.js";

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

		console.log("isPasswordDialog", isPasswordDialog);

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

		console.log("body", body);

		const responseObject = await fetchData(`/user/settings/${pk}/`, "PATCH", body, false, "authenticated");
		if (responseObject.status === 200)
			showToast(responseObject.data.message, "success");
		else
			showToast(responseObject.data.message, "error");
		dialogElement.close();
		mainContent.removeChild(dialogElement);
	})
	document.getElementById("cancel-btn").addEventListener("click", (e) => {
		dialogElement.close();
		mainContent.removeChild(dialogElement);
	})
}

async function uploadAvatar(pk) {
	const fileInput = document.createElement('input');
	fileInput.type = 'file';
	fileInput.accept = 'image/jpeg, image/png, image/gif';
	
	fileInput.addEventListener('change', async (e) => {
		const file = e.target.files[0];
		if (!file) return;
		
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
		
		const responseObject = await fetchData(`/user/settings/${pk}/`, 'PATCH', formData, true, "authenticated");

		if (responseObject.status === 200) {
			const avatarPath = responseObject.data.avatar.substring(
				responseObject.data.avatar.indexOf('/media')
			);
			document.getElementById('avatar').src = avatarPath;
			showToast(responseObject.data.message, "success");
		} else {
			showToast(responseObject.data.message, "error");
		}
	});
	
	fileInput.click();
}

async function deleteAccount(pk) {
	const confirmation = confirm("Are you sure you want to delete your account? This action is irreversible.");
	if (!confirmation) {
		return;
	}
	const responseObject = await fetchData(`/user/settings/${pk}/`, 'DELETE', null, false, "authenticated");
	if (responseObject.status === 205) {
		showToast(responseObject.data.message, "success");
		localStorage.setItem('access_token', "");
		renderPage("home")
	} else
		showToast(responseObject.data.message, "error");
}

async function addNewFriend(pk) {
    const newFriendUsername = document.getElementById("new-friend-username").value;

    if (!newFriendUsername) {
        showToast("Please enter a username to add as a friend.", "error");
        return;
    }
    const responseObject = await fetchData(
		`/user/settings/${pk}/`, 
		'PATCH', 
		{new_friend: `${newFriendUsername}`}, 
		false, 
		"authenticated"
	);
	if (responseObject.status === 200)
		showToast(responseObject.data.message, "success");
	else
		showToast(responseObject.data.message, "error");
}

export { createDialog, listenForDialog, deleteAccount, addNewFriend, uploadAvatar };

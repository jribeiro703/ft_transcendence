import { fetchData, escapeHTML, DEBUG, getIdFromJWT  } from "../../utils.js";

function createSettingsPage() {
	const box = document.getElementById("mainContent");
	box.innerHTML = `
		<div id="settings-page">
        <h1>User Settings</h1>
        <div id="user-info">
            <img id="avatar" src="" alt="Avatar" class="avatar">
            <p>Username: <span id="username"></span></p>
            <p>Alias: <span id="alias"></span></p>
            <p>Email: <span id="email"></span></p>
            <button id="edit-btn">Edit</button>
        </div>
        
        <div id="edit-form" style="display: none;">
            <label for="new-avatar">New Avatar:</label>
            <input type="file" id="new-avatar">
            
            <label for="new-alias">Alias:</label>
            <input type="text" id="new-alias">
            
            <label for="new-email">Email:</label>
            <input type="email" id="new-email">
            
            <label for="current-password">Current Password:</label>
            <input type="password" id="current-password">
            
            <label for="new-password">New Password:</label>
            <input type="password" id="new-password">
            
            <button id="save-btn">Save</button>
        </div>
        
        <button id="delete-account-btn">Delete Account</button>
    </div>
	`
}

async function editSettings() {
    const editForm = document.getElementById("edit-form");
    const userInfo = document.getElementById("user-info");
    const deleteAccountBtn = document.getElementById("delete-account-btn");

    editForm.style.display = "block";
    userInfo.style.display = "none";
    deleteAccountBtn.style.display = "none";

    document.getElementById("new-alias").value = document.getElementById("alias").textContent || "";
    document.getElementById("new-email").value = document.getElementById("email").textContent || "";

    document.getElementById("save-btn").addEventListener("click", async (e) => {
        e.preventDefault();
        const newAvatar = document.getElementById("new-avatar").files[0];
        const newAlias = document.getElementById("new-alias").value;
        const newEmail = document.getElementById("new-email").value;
        const currentPassword = document.getElementById("current-password").value;
        const newPassword = document.getElementById("new-password").value;

        const formData = new FormData();
        if (newAvatar) formData.append("avatar", newAvatar);
        if (newAlias) formData.append("alias", newAlias);
        if (newEmail) formData.append("email", newEmail);
        if (currentPassword) formData.append("current_password", currentPassword);
        if (newPassword) formData.append("new_password", newPassword);

        const pk = getIdFromJWT();
        const { data, status } = await fetchData(`/user/settings/${pk}/`, 'PATCH', formData, true);

        if (status === 200) {
			const avatarPath = data.avatar.replace(/^https?:\/\/[^/]+/, '');
            document.getElementById("avatar").src = avatarPath;
            document.getElementById("alias").textContent = data.alias || "No alias";
            document.getElementById("email").textContent = data.email;

            editForm.style.display = "none";
            userInfo.style.display = "block";
        } else {
            alert("Erreur lors de la mise à jour des informations !");
        }
    });
}


export async function renderSettingsPage() {

	const box = document.getElementById("mainContent");
	
	createSettingsPage();
	
	const pk = getIdFromJWT();
	const { data,status } = await fetchData(`/user/settings/${pk}`);

	console.log(data, status);

	if (status === 200) {
		const avatarPath = data.avatar.replace(/^https?:\/\/[^/]+/, '');
		console.log(avatarPath);

		document.getElementById("avatar").src = avatarPath;
		document.getElementById("username").textContent = data.username;
		document.getElementById("alias").textContent = data.alias || "No alias";
		document.getElementById("email").textContent = data.email;
	}
	else
		console.log("Failed to get data");

	document.getElementById("edit-btn").addEventListener("click", async (e) => {
		editSettings();
	});

}
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

		<div id="friend-request">
			<label for="new-friend-username">Add new friend:</label>
			<input type="text" id="new-friend-username" placeholder="Friend's username" required>
			<span id="error-message" style="color: red; display: none;">Please enter a valid username!</span>
			<button id="send-friend-request-btn">Send</button>
		</div>
        
        <button id="delete-account-btn">Delete Account</button>
    </div>
	`
}

async function editSettings() {
    const editForm = document.getElementById("edit-form");
    const userInfo = document.getElementById("user-info");
    const deleteAccountBtn = document.getElementById("delete-account-btn");
	const friendRequest = document.getElementById("friend-request");

    editForm.style.display = "block";
    userInfo.style.display = "none";
    deleteAccountBtn.style.display = "none";
	friendRequest.style.display = "none";


    // document.getElementById("new-alias").value = document.getElementById("alias").textContent || "";
    // document.getElementById("new-email").value = document.getElementById("email").textContent || "";

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
        if (newEmail) formData.append("new_email", newEmail);
        if (currentPassword) formData.append("password", currentPassword);
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
			deleteAccountBtn.style.display = "block";

        } else {
            alert("Erreur lors de la mise à jour des informations !");
        }
    });
}

async function deleteAccount() {
    const confirmation = confirm("Are you sure you want to delete your account? This action is irreversible.");
    if (!confirmation) {
        return;
    }

	const pk = getIdFromJWT();

    // Send the DELETE request to the API
    const { data, status } = await fetchData(`/user/settings/${pk}/`, 'DELETE');

    if (status === 205) {
        alert("Your account has been successfully deleted.");
		localStorage.setItem('access_token', "");
        window.location.href = "/";
    } else {
        alert("Error deleting the account. Please try again.");
        console.error("Error: ", data);
    }
}

async function addNewFriend(pk) {
    const newFriendUsername = document.getElementById("new-friend-username").value; // Prend le nom d'utilisateur du nouvel ami

    if (!newFriendUsername) {
        alert("Please enter a username to add as a friend.");
        return;
    }

    const { data, status } = await fetchData(`/user/settings/${pk}/`, 'PATCH', {new_friend: `${newFriendUsername}`});
    if (status === 200) {
        alert(data.message);
    } else {
        alert(`Error: ${data.message || "Failed to send friend request."}`);
    }
}


export async function renderSettingsPage() {

	const box = document.getElementById("mainContent");
	const pk = getIdFromJWT();
	
	createSettingsPage();
	
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

	document.getElementById("send-friend-request-btn").addEventListener("click", async (e) => {
		addNewFriend(pk);
	});

	document.getElementById("delete-account-btn").addEventListener("click", async (e) => {
		deleteAccount();
	});


}
import { fetchData, escapeHTML, DEBUG, getIdFomJWT  } from "../../utils.js";

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

export async function renderSettingsPage() {

	const box = document.getElementById("mainContent");
	createSettingsPage()
	
	const pk = getIdFomJWT();
	const { data,status } = await fetchData(`/user/settings/${pk}`);

	
	console.log(data, status);



}
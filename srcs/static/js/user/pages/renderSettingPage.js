import { escapeHTML, showErrorMessages, UPLOAD_ICON } from "../tools.js";
import { fetchAuthData } from "../fetchData.js";
import { listenChangeAlias, listenChangeEmail, listenChangePassword} from "./settingsPageTools.js";

async function createSettingsPageContent(mainContent, data) {
	const avatarPath = data.avatar.substring(data.avatar.indexOf('/media'));

	mainContent.innerHTML = `
		<div class="settings-container">
			<div class="header-container">
				<div class="avatar-container">
					<img id="avatar-img" src="${avatarPath}" alt="Avatar" class="avatar">
					<button id="upload-avatar-btn" class="upload-btn">
						<img src="${UPLOAD_ICON}" style="width: 20px; height: 20px;">
					</button>
				</div>
				<div class="username-container">
					<span id="username">${data.username}</span>
				</div>
			</div>
				<div class="alias-container">
					Alias: <span id="alias">${data.alias ? data.alias : "none"}</span>
					<input type="text" id="alias-input" value="${data.alias ? data.alias : "none"}" style="display:none;">
					<button id="save-alias-btn" class="save-btn" style="display:none;">Save</button>
				</div>
				<div class="email-container">
					Email: <span id="email">${data.email}</span>
					<input type="text" id="email-input" placeholder="${data.email}" style="display:none">
					<button id="save-email-btn" class="save-btn" style="display:none;">Save</button>
				</div>
				<div class="password-container">
					Password: <span id="password" > change your password</span>
					<input type="text" id="current-password-input" placeholder="Enter your current password" style="display:none">
					<input type="text" id="new-password-input" placeholder="Enter your new password " style="display:none">
					<button id="save-password-btn" class="save-btn" style="display:none;">Save</button>
				</div>
				<div class="friend-request">
					<label for="new-friend-username">Add new friend:</label>
					<input type="text" id="new-friend-username" placeholder="Friend's username" required>
					<span id="error-message" style="color: red; display: none;">Please enter a valid username!</span>
					<button type="submit" id="send-friend-request-btn">Send</button>
				</div>
				<div>
					<button id="delete-account-btn">Delete Account</button>
				</div>
		</div>
	`;
}

export async function renderSettingsPage() {
	const mainContent = document.getElementById("mainContent");
	let responseObject = await fetchAuthData("/user/private/pk/", "GET", null, false);
	if (responseObject.status !== 200) {
		showToast("An error occurred while getting your settings data.", "error");
		return;
	}
	const pk = responseObject.data.pk;

	responseObject = await fetchAuthData(`/user/settings/${pk}`, "GET", null, false);
	if (responseObject.status != 200) {
		showErrorMessages(responseObject);
		return;
	}
	const data = responseObject.data;
	await createSettingsPageContent(mainContent, data);

	// alias
	const aliasSpan = document.getElementById('alias');
	const aliasInput = document.getElementById('alias-input');
	const saveAliasButton = document.getElementById('save-alias-btn');

	aliasSpan.addEventListener("click", function() {
		
		aliasInput.style.display = 'inline';
		saveAliasButton.style.display = 'inline';
		aliasInput.value = this.innerText;
		this.style.display = 'none';

		const handleClickOutside = function(event) {
			const isClickInside = aliasInput.contains(event.target) || saveAliasButton.contains(event.target) || document.getElementById('alias').contains(event.target);
			
			if (!isClickInside) {
				aliasSpan.style.display = 'inline';
				aliasInput.style.display = 'none';
				saveAliasButton.style.display = 'none';
				document.removeEventListener("click", handleClickOutside);
			}
		}

		document.addEventListener("click", handleClickOutside)
		listenChangeAlias(pk);
	});

	if (!data.is_42_user) {
		// email
		const emailSpan = document.getElementById('email');
		const emailInput = document.getElementById('email-input');
		const saveEmailButton = document.getElementById('save-email-btn');

		emailSpan.addEventListener("click", function() {

			emailInput.style.display = 'inline';
			saveEmailButton.style.display = 'inline';
			emailInput.value = this.innerText;
			this.style.display = 'none';

			const handleClickOutside = function(event) {
				const isClickInside = emailInput.contains(event.target) || saveEmailButton.contains(event.target) || document.getElementById('email').contains(event.target);

				if (!isClickInside) {
					emailSpan.style.display = 'inline';
					emailInput.style.display = 'none';
					saveEmailButton.style.display = 'none';
					document.removeEventListener("click", handleClickOutside);
				}
			}

			document.addEventListener("click", handleClickOutside)
			listenChangeEmail(pk);
		});

		// password
		const passwordSpan = document.getElementById('password');
		const currentPasswordInput = document.getElementById('current-password-input');
		const newPasswordInput = document.getElementById('new-password-input');
		const savePasswordButton = document.getElementById('save-password-btn');

		passwordSpan.addEventListener("click", function() {

			currentPasswordInput.style.display = 'inline';
			newPasswordInput.style.display = 'inline';
			savePasswordButton.style.display = 'inline';
			this.style.display = 'none';

			const handleClickOutside = function(event) {
				const isClickInside = currentPasswordInput.contains(event.target) || newPasswordInput.contains(event.target) || savePasswordButton.contains(event.target) || document.getElementById('password').contains(event.target);

				if (!isClickInside) {
					passwordSpan.style.display = 'inline';
					currentPasswordInput.style.display = 'none';
					newPasswordInput.style.display = 'none';
					savePasswordButton.style.display = 'none';
					document.removeEventListener("click", handleClickOutside);
				}
			}

			document.addEventListener("click", handleClickOutside)
			listenChangePassword(pk);
		});
	}
}

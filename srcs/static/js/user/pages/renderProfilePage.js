import { showToast, DEFAULT_AVATAR} from "../tools.js";
import { fetchData, fetchAuthData } from "../fetchData.js";

function createProfileContent() {
	const mainContent = document.getElementById('mainContent');
	mainContent.innerHTML = `
		<div class="profile-container">
			<div class="profile-header">
				<img id="avatar" class="profile-avatar" src="${DEFAULT_AVATAR}" alt="User Avatar" class="avatar" />
				<h4 id="username" class="profile-username">Username</h4>
				<p id="alias" class="profile-alias"></p>
				<div id="isOnline" class="status-container">
                    <span class="status-indicator"></span>
                    <span class="status-text"></span>
            	</div>
				<div class="profile-stats">
					<strong>Total: </strong> <span id="totalMatches">0</span>
				</div>
				<div class="profile-stats">
					<strong>Won: </strong> <span id="wonMatches">0</span>
				</div>
			</div>
			<div class="profile-match-history">
				<h2>Match History</h2>
				<ul id="matchHistory"></ul>
			</div>
		</div>
	`;
}

export async function renderProfilePage() {
	let responseObject = await fetchAuthData("/user/private/pk/", "GET", null, false);
	if (responseObject.status !== 200) {
		showToast("An error occurred while getting your profile data.", "error");
		return;
	}

	responseObject = await fetchAuthData(`/user/profile/${responseObject.data.pk}`, "GET", null, false);
	if (responseObject.status === 200) {
		createProfileContent();
		const data = responseObject.data;

		const statusIndicator = document.querySelector('#isOnline .status-indicator');
        const statusText = document.querySelector('#isOnline .status-text');
        
        if (data.is_online) {
            statusIndicator.classList.add('status-online');
            statusText.textContent = 'Online';
        } else {
            statusIndicator.classList.add('status-offline');
            statusText.textContent = 'Offline';
        }

		document.getElementById('username').textContent = data.username;
		document.getElementById('avatar').src = data.avatar;
		if (data.alias)
			document.getElementById('alias').textContent = `(${data.alias})`;
		document.getElementById('totalMatches').textContent = data.total_matches;
		document.getElementById('wonMatches').textContent = data.won_matches;
		
		const matchHistoryList = document.getElementById('matchHistory');
		if (data.match_history.length > 0) {
			data.match_history.forEach(match => {
				const listItem = document.createElement('li');
				listItem.textContent = `Date: ${match.date}, Score: ${match.score}, Winner: ${match.winner}`;
				matchHistoryList.appendChild(listItem);
			});
		} else {
			matchHistoryList.innerHTML = '<li>No match history available.</li>';
		}
	} else {
		showToast("An error occurred while fetching profile data.", "error");
	}
}
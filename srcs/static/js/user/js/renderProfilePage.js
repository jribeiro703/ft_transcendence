import { showToast, DEFAULT_AVATAR} from "../tools.js";
import { getIdFromJWT } from "../token.js";
import { fetchData } from "../fetchData.js";

function createProfileContent() {
	const mainContent = document.getElementById('mainContent');
	mainContent.innerHTML = `
		<div class="profile-container">
			<div class="profile-header">
				<div class="avatar-container">
					<img id="avatar" src="${DEFAULT_AVATAR}" alt="User Avatar" class="avatar" />
					<h4 id="username">Username</h4>
					<p id="alias" class="alias"></p>
				</div>
				<div class="stats">
					<strong>Total: </strong> <span id="totalMatches">0</span>
				</div>
				<div class="stats">
					<strong>Won: </strong> <span id="wonMatches">0</span>
				</div>
			</div>
			<div class="match-history">
				<h2>Match History</h2>
				<ul id="matchHistory"></ul>
			</div>
		</div>
	`;
}

export async function renderProfilePage() {
	try {
		const pk = getIdFromJWT(localStorage.getItem("access_token"));
		const responseObject = await fetchData(`/user/profile/${pk}`);
		createProfileContent();
		
		if (responseObject.status === 200) {
			const data = responseObject.data;
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
		}
		// history.pushState({ page: "profile" }, "Profile", "#profile");
	} catch (error) {
		console.error(`renderProfilePage(): ${error}`);
		showToast("An error occurred while fetching profile data.", "error");
	}
}
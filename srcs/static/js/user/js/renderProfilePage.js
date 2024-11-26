import { fetchData, escapeHTML, getIdFromJWT  } from "../../utils.js";

function createProfileContent() {
	const box = document.getElementById('mainContent');
	box.innerHTML = `
		<div class="profile-container">
			<div class="profile-header">
				<div class="avatar-container">
					<img id="avatar" src="${defaultAvatar}" alt="User Avatar" class="avatar" />
					<h4 id="username">Username</h4>
					<p id="alias" class="alias"></p>
				</div>
				<div class="stats">
					<strong>Total: </strong> <span id="totalMatches">0</span>
				</div>
				<div class="stat">
					<strong>Won: </strong> <span id="wonMatches">0</span>
				</div>
			</div>
			<div class="match-history">
				<h2>Match History</h2>
				<ul id="matchHistory"></ul>
			</div>
		</div>
	`
}

export async function renderProfilePage() {
	const pk = getIdFromJWT();
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
}
import { fetchData, escapeHTML, DEBUG, getIdFromJWT  } from "../../utils.js";

function createProfileContent() {
	const box = document.getElementById('mainContent');
	box.innerHTML = `
		<div class="profile-container">
			<div class="profile-header">
				<div class="avatar-container">
					<img id="avatar" src="${defaultAvatar}" alt="User Avatar" class="avatar" />
					<h1 id="username">Username</h1>
				</div>
				<p id="alias" class="alias">Alias: Not Set</p>
			</div>
			<div class="stats">
				<div class="stat">
					<strong>Total Matches:</strong> <span id="totalMatches">0</span>
				</div>
				<div class="stat">
					<strong>Won Matches:</strong> <span id="wonMatches">0</span>
				</div>
			</div>
			<div class="match-history">
				<h2>Match History</h2>
				<ul id="matchHistory">
				</ul>
			</div>
		</div>
	`
}

export async function renderProfilePage() {
	const userId = getIdFromJWT();
		console.log(userId);
	const { data, status } = await fetchData(`/user/profile/${userId}`);
		console.log(data, status)
	createProfileContent();

	document.getElementById('username').textContent = data.username;
	document.getElementById('avatar').src = data.avatar;
	document.getElementById('alias').textContent = data.alias || "Alias: Not Set";
	document.getElementById('totalMatches').textContent = data.total_matches;
	document.getElementById('wonMatches').textContent = data.won_matches;

	const matchHistoryList = document.getElementById('matchHistory');
	if (data.match_history.length > 0) {
		data.match_history.forEach(match => {
			const listItem = document.createElement('li');
			listItem.textContent = `Date: ${match.date}, Score: ${match.score}, Winner: ${match.winner}`;
			matchHistoryList.appendChild(listItem);
		});
	}
	else
	    matchHistoryList.innerHTML = '<li>No match history available.</li>';
}
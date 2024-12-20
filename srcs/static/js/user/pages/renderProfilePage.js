import { showToast, DEFAULT_AVATAR} from "../tools.js";
import { fetchData, fetchAuthData } from "../fetchData.js";
import { renderPage } from "../historyManager.js";

let currentPage = 1;
let matchesPerPage = 5;
let matchData;
let userData;

function createProfileContent() {
	const mainContent = document.getElementById('mainContent');
	mainContent.innerHTML = `
		<div class="profile-container" >
			<div class="profile-header">
				<img id="avatar" class="profile-avatar" src="${DEFAULT_AVATAR}" alt="User Avatar" class="avatar" />
				<div class="profile-info">
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
			</div>
			<div class="profile-match-history">
				<h2 class="match-history-title">Match History</h2>
				<div id="matchHistory" class="match-history-content"></div>
				<div class="pagination" id="pagination">
					<button id="prevButton" disabled>Précédent</button>
					<button id="nextButton">Suivant</button>
				</div>
			</div>
		</div>
	`;
}

function updateNavigationButtons(totalPages) {
	const prevButton = document.getElementById('prevButton');
	const nextButton = document.getElementById('nextButton');

	prevButton.disabled = currentPage === 1;
	nextButton.disabled = currentPage === totalPages;

	prevButton.onclick = () => {
		if (currentPage > 1) {
			currentPage--;
			createMatchHistory(document.getElementById('matchHistory'), { match_history: matchData, ...userData });
		}
	};

	nextButton.onclick = () => {
		if (currentPage < totalPages) {
			currentPage++;
			createMatchHistory(document.getElementById('matchHistory'), { match_history: matchData, ...userData });
		}
	};
}

function createMatchHistory(container, data) {
	matchData = data.match_history;

// console.log(matchData);

	userData = data;

// console.log(userData);

	const totalMatches = matchData.length;
	const totalPages = Math.ceil(totalMatches / matchesPerPage);
	const startIndex = (currentPage - 1) * matchesPerPage;
	const endIndex = startIndex + matchesPerPage;
	const paginatedMatches = matchData.slice(startIndex, endIndex);

	if (paginatedMatches.length > 0) {
		const table = document.createElement('table');
		table.classList.add('match-history-table');
		paginatedMatches.forEach(match => {

			console.log(match);

			const row = document.createElement('tr');
			row.classList.add('match-row');
			row.innerHTML = `
				<td class="match-result">${match.winner === userData.username ? 'WIN' : 'LOSS'}</td>
				<td class="user-info">
					<div class="user-name" >${userData.username}</div>
					<img id="user-avatar" class="user-avatar" src="${userData.avatar}" alt="${userData.username}'s avatar"/>
				</td>
				<td class="score">${match.me.score}</td>
				<td class="score-separator">-</td>
				<td class="score">${match.enemy.score}</td>
				<td class="enemy-info">
					<img id="enemy-avatar" class="enemy-avatar" src="${match.enemy.avatar}" alt="${match.enemy.username}'s avatar"/>
					<div class="enemy-name" >${match.enemy.username}</div>
				</td>
				<td class="match-date">${match.date}</td>
			`;
			table.appendChild(row);
		});
		
		container.innerHTML = '';
		container.appendChild(table);
		updateNavigationButtons(totalPages);
	

		const userAvatars = document.querySelectorAll('.user-avatar');
		userAvatars.forEach(avatar => {
			avatar.style.cursor = 'pointer';
			avatar.addEventListener('click', () => {
				console.log("userData username: ", userData.username);
				renderPage("profile", false, userData.username);
			});
		});

		const enemyAvatars = document.querySelectorAll('.enemy-avatar');
		enemyAvatars.forEach(avatar => {
			avatar.style.cursor = 'pointer';
			avatar.addEventListener('click', () => {
				const enemyUsername = avatar.alt.replace("'s avatar", '');
				console.log("enemy username: ", enemyUsername);
				renderPage("profile", true, enemyUsername);
			});
		});

	} else {
		container.innerHTML = '<p>No match history available.</p>';
	}
}

export async function renderProfilePage(username) {

	console.log("renderProfilePage: ", username);

	const responseObject = await fetchAuthData(`/user/profile/${username}/`, "GET", null, false);
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
		
		const matchHistory = document.getElementById('matchHistory');
		createMatchHistory(matchHistory, data);

	} else {
		showToast("An error occurred while fetching profile data.", "error");
	}
}

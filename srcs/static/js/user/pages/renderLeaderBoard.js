import { fetchAuthData } from "../fetchData.js"
import { showErrorMessages } from "../tools.js";

function createLeaderBoardContent(data) {
	const mainContent = document.getElementById("mainContent");
	mainContent.innerHTML = `
		<div id="leaderboard-container">
			<div>
				<ul id="leaderboard-list">
				</ul>
			</div>
		</div>
	`;

	const leaderboardList = document.getElementById("leaderboard-list");

	data.forEach((user, index) => {
		const listItem = document.createElement("li");
		listItem.classList.add("leaderboard-item");
		listItem.innerHTML = `
			<div class="leaderboard-rank">#${index + 1}</div>
			<img class="leaderboard-avatar" src="${user.avatar}" alt="${user.username}'s avatar" />
			<div class="leaderboard-info">
				<p class="leaderboard-username">${user.username}</p>
				<p class="leaderboard-stats">
					<span>Total: ${user.matchs.total_matches}</span>
					<span>Wins: ${user.matchs.won_matches}</span>
					<span>Losses: ${user.matchs.lost_matches}</span>
					<span>Win Ratio: ${(user.matchs.win_ratio * 100).toFixed(2)}%</span>
				</p>
			</div>
		`;
		leaderboardList.appendChild(listItem);
	});
}

function sortLeaderBoardData(leaderBoardArray) {
	leaderBoardArray.sort((a, b) => b.matchs.won_matches - a.matchs.won_matches);
	return leaderBoardArray;
}

export async function renderLeaderBoardPage() {

	const responseObject = await fetchAuthData("/user/leaderboard/", "GET", null, false);
	if (responseObject.status != 200) {
		showErrorMessages(responseObject);
		return;
	}
	const leaderBoardArray = Object.values(responseObject.data);
	const sortedDataArray = sortLeaderBoardData(leaderBoardArray);

	createLeaderBoardContent(sortedDataArray);
}
import { fetchAuthData } from "../fetchData.js";
import { showErrorMessages } from "../tools.js";

function createLeaderBoardContent(data) {
  const mainContent = document.getElementById("mainContent");
  mainContent.innerHTML = `
		<div id="leaderboard-container" class="leaderboard-container">
	  		<div>
				<div id="leaderboard-list" class="leaderboard-list">
				</div>
			</div>
		</div>
	`;

  const leaderboardList = document.getElementById("leaderboard-list");

  data.forEach((user, index) => {
    const listItem = document.createElement("div");
    listItem.classList.add("leaderboard-item");
    listItem.innerHTML = `
			<div class="leaderboard-rank">#${index + 1}</div>
			<img class="leaderboard-avatar" src="${user.avatar}" alt="${user.username}'s avatar" />
			<div class="leaderboard-username">${user.username}</div>
			<div class="leaderboard-stats">Total: ${user.matchs.total_matches}</div>
			<div class="leaderboard-stats">Win: ${user.matchs.won_matches}</div>
			<div class="leaderboard-stats">Losse: ${user.matchs.lost_matches}</div>
			<div class="leaderboard-stats"> ${(user.matchs.win_ratio * 100).toFixed(2)}%</div>
		`;
    leaderboardList.appendChild(listItem);
  });
}

function sortLeaderBoardData(leaderBoardArray) {
  leaderBoardArray.sort((a, b) => b.matchs.won_matches - a.matchs.won_matches);
  return leaderBoardArray;
}

export async function renderLeaderBoardPage() {
  const responseObject = await fetchAuthData(
    "/user/leaderboard/",
    "GET",
    null,
    false,
  );
  if (responseObject.status != 200) {
    showErrorMessages(responseObject);
    return;
  }
  const leaderBoardArray = Object.values(responseObject.data);
  const sortedDataArray = sortLeaderBoardData(leaderBoardArray);

  createLeaderBoardContent(sortedDataArray);
}


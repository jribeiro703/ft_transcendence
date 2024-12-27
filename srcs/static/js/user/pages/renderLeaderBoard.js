import { fetchAuthData } from "../fetchData.js";
import { showErrorMessages } from "../tools.js";

function createBasicLayout() {
  const mainContent = document.getElementById("mainContent");
  mainContent.innerHTML = `
    <div id="leaderboard-container" class="leaderboard-container">
      <div id="top3-container" class="top3-container"></div>
      <div><hr></div>
      <table id="leaderboard-table" class="leaderboard-table">
        <thead>
          <tr>
            <th>Rank</th>
            <th>Avatar</th>
            <th>Username</th>
            <th>Total Matches</th>
            <th>Won Matches</th>
            <th>Lost Matches</th>
            <th>Win Ratio</th>
          </tr>
        </thead>
        <tbody id="leaderboard-list"></tbody>
      </table>
    </div>
  `;
}

function createTheRest(data) {
  const leaderboardList = document.getElementById("leaderboard-list");

  data.forEach((user, index) => {
    const row = document.createElement("tr");
    row.classList.add("leaderboard-item");
    row.innerHTML = `
      <td>#${index + 4}</td>
      <td><img class="leaderboard-avatar" src="${user.avatar}" alt="${user.username}'s avatar" /></td>
      <td>${user.username}</td>
      <td>${user.matchs.total_matches}</td>
      <td>${user.matchs.won_matches}</td>
      <td>${user.matchs.lost_matches}</td>
      <td>${(user.matchs.win_ratio * 100).toFixed(2)}%</td>
    `;
    leaderboardList.appendChild(row);
  });
}

function createTop3(data) {
  const top3Container = document.getElementById("top3-container");

  data.forEach((user, index) => {
    const top3Item = document.createElement("div");
    top3Item.classList.add("top3-item");
    top3Item.innerHTML = `
      <div class="top3-header">
        <img class="top3-avatar" src="${user.avatar}" alt="${user.username}'s avatar" />
        <div class="top3-username">${user.username}</div>
      </div>
      <div class="top3-score">
      <div class="top3-stats">${user.matchs.total_matches}/${user.matchs.won_matches}/${user.matchs.lost_matches}</div>
      <div class="top3-stats"> ${(user.matchs.win_ratio * 100).toFixed(2)}%</div>
      <div class="top3-rank">#${index + 1}</div>
      </div>
    `;
    top3Container.appendChild(top3Item);
  });
}

function sortLeaderBoardData(dataArray) {
  dataArray.sort((a, b) => b.matchs.won_matches - a.matchs.won_matches);
  return dataArray;
}

async function getLeaderBoardData() {
  const responseObject = await fetchAuthData(
    "/user/leaderboard/",
    "GET",
    null,
    false,
  );
  if (responseObject.status != 200) {
    showErrorMessages(responseObject);
    return null;
  }
  return Object.values(responseObject.data); // get the data in an array
}

export async function renderLeaderBoardPage() {
  const dataArray = await getLeaderBoardData();
  if (dataArray === null)
    return;

  const sortedDataArray = sortLeaderBoardData(dataArray);

  createBasicLayout();
  createTop3(sortedDataArray.slice(0, 3));
  createTheRest(sortedDataArray.slice(3));
}


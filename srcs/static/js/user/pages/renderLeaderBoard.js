import { fetchAuthData } from "../fetchData.js"
import { showErrorMessages } from "../tools.js";

function createLeaderBoardContent() {
	const mainContent = document.getElementById("mainContent")
	mainContent.innerHTML = `
		<div>
			<h1>Leaderboard<h1>
			<div>
			</div>
		</div>
	` 
}

export async function renderLeaderBoardPage() {

	createLeaderBoardContent();

	const responseObject = await fetchAuthData("/user/leaderboard/", "GET", null, false);
	if (responseObject.status != 200) {
		showErrorMessages(responseObject);
		return;
	}
	console.log(responseObject);
}
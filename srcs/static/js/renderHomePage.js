import { isAuthenticated } from "./utils.js"

function createHomeContent() {
	const box = document.getElementById('mainContent');
	box.innerHTML = `
		<div id="defaultView">
			<div class="container">
				<div class="mx-auto">
					<img class="img-fluid" src="${pongCard}" alt="Pong Game">
					<br><br><br>
				</div>
			</div>
		</div>
		<div class="container py-2 d-flex flex-column align-items-center py-2">
			<button id="btn-QuickGame" class="btn custom-btn mb-4">QuickGame</button>
			<button id="btn-Match" class="btn custom-btn mb-4">Match</button>
			<button id="btn-Tournament" class="btn custom-btn mb-4">Tournament</button>
			<button id="btn-Leaderboard" class="btn custom-btn mb-4">Leaderboard</button>
		</div>
	`;
}

export async function renderHomePage() {
	createHomeContent();

	document.getElementById('btn-QuickGame').addEventListener('click', () => {
		history.pushState({ page: 'quickgame' }, 'QuickGame', '#quickgame')
	    console.log('QuickGame button clicked');
	});

	const authenticated = await isAuthenticated();

	document.getElementById('btn-Match').addEventListener('click', () => {
		if (!authenticated) {
			alert("You must be logged in to use this feature.");
			return ;
		}
		console.log('Match button clicked');
		history.pushState({ page: 'match' }, 'Match', '#match');
	});

	document.getElementById('btn-Tournament').addEventListener('click', () => {
		if (!authenticated) {
			alert("You must be logged in to use this feature.");
			return ;
		}
		console.log('Tournament button clicked');
		history.pushState({ page: 'tournament' }, 'Tournament', '#tournament');
	});

	document.getElementById('btn-Leaderboard').addEventListener('click', () => {
		if (!authenticated) {
			alert("You must be logged in to use this feature.");
			return ;
		}
		console.log('Leaderboard button clicked');
		history.pushState({ page: 'leaderboard' }, 'Leaderboard', '#leaderboard');
	});
}
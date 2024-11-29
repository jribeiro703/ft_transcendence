import { PONG_CARD, showToast } from "./user/tools.js"

function createHomeContent() {
	const box = document.getElementById('mainContent');
	box.innerHTML = `
		<div id="defaultView">
			<div class="container">
				<div class="mx-auto">
					<img class="img-fluid" src="${PONG_CARD}" alt="Pong Game">
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

async function renderHomePage() {
	createHomeContent();
	
	document.getElementById('btn-QuickGame').addEventListener('click', () => {
		console.log('QuickGame button clicked');
	});

	const authButtons = [
		{
			id: 'btn-Match',
			page: 'match',
			title: 'Match',
			handler: () => console.log('Match handler')
		},
		{
			id: 'btn-Tournament',
			page: 'tournament',
			title: 'Tournament',
			handler: () => console.log('Tournament handler')
		},
		{
			id: 'btn-Leaderboard',
			page: 'leaderboard',
			title: 'Leaderboard',
			handler: () => console.log('Leaderboard handler')
		}
	];

	authButtons.forEach(({ id, page, title }) => {
		document.getElementById(id).addEventListener('click', () => {
			if (!authenticated) {
				showToast("You must be logged in to use this feature.", "warning");
				return;
			}
			handler();
		});
	});
}

export { renderHomePage };
import { PONG_CARD, showToast } from "./user/tools.js"
// import { showGameSelectionView, showGameSelectionMultiView,  } from "./game/gameView.js"
import { isAuthenticated } from "./user/token.js"
import { renderPage } from "./historyManager.js";

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
		<div class="container py-2 d-flex flex-column align-items-centercontainer py-2">
				<button id="playsoloGameBtn" class="btn custom-btn mb-5">Single Player</button>
				<button id="playmultiGameBtn" class="btn custom-btn mb-4">Multiplayer</button>
				<button id="btn-Leaderboard" class="btn custom-btn mb-4">Leaderboard</button>
		</div>
		
			`;
		}
		// <div class="container py-2 d-flex flex-column align-items-center py-2">
		// 	<button id="btn-QuickGame" class="btn custom-btn mb-4">Single Player</button>
		// 	<button id="btn-Match" class="btn custom-btn mb-4"></button>
		// 	<button id="btn-Tournament" class="btn custom-btn mb-4">Tournament</button>
		// </div>

async function renderHomePage() {
	createHomeContent();
	
	document.getElementById('playsoloGameBtn').addEventListener('click', () => {
		renderPage('soloGame');
	});

	const authenticated = await isAuthenticated();

	const authButtons = [
		// {
		// 	id: 'playsoloGameBtn',
		// 	page: 'sologame',
		// 	title: 'SoloGame',
		// 	handler: () => renderPage('soloGame')
		// },
		{
			id: 'playmultiGameBtn',
			// page: 'multigame',
			// title: 'MuktiGame',
			handler: () => renderPage('multiGame')
		},
		{
			id: 'btn-Leaderboard',
			// page: 'leaderboard',
			// title: 'Leaderboard',
			handler: () => console.log('Leaderboard handler')
		}
	];

	authButtons.forEach(({ id, handler }) => {
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
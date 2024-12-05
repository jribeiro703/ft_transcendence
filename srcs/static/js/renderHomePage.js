import { PONG_CARD, showToast } from "./user/tools.js"
import { isAuthenticated } from "./user/isAuthenticated.js";
import { renderPage } from "./user/historyManager.js";
import { showGameSelectionMultiView, showGameView } from "./game/gameView.js";

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

async function renderHomePage() {
	createHomeContent();
	
	document.getElementById('playsoloGameBtn').addEventListener('click', () => {
		showGameView();
	});

	const authButtons = [
		{
			id: 'playmultiGameBtn',
			handler: () => showGameSelectionMultiView()
		},
		{
			id: 'btn-Leaderboard',
			handler: () => console.log('Leaderboard handler')
		}
	];
	
	authButtons.forEach(({ id, handler }) => {
		document.getElementById(id).addEventListener('click', async () => {
			const authenticated = await isAuthenticated();
			if (!authenticated) {
				showToast("You must be logged in to use this feature.", "warning");
				return;
			}
			handler();
		});
	});
}

export { renderHomePage };
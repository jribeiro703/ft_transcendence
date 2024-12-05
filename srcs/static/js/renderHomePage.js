import { PONG_CARD, showToast } from "./user/tools.js"
import { isAuthenticated } from "./user/isAuthenticated.js";
import { renderPageGame } from './game/pong/myHistory.js';

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
		renderPageGame("gameSelectionSolo");
	});

	const authButtons = [
		{
			id: 'playmultiGameBtn',
			handler: () => renderPageGame('gameSelectionMulti')
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
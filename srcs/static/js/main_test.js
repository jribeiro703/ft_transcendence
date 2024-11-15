import { renderHomePage } from "./home.js"
import { displayUserChoice } from "./user.js"

function router() {
	const box = document.getElementById('mainContent');
	const hash = window.location.hash;

	box.innerHTML = '';

	switch (hash) {
		case '#home':
		case '':
			renderHomePage();
			break;
		case '#user':
			displayUserChoice();
			break;
		default:
			renderHomePage();
			break;
	}
}

document.getElementById('btn-User').addEventListener('click', () => {
	window.location.hash = '#user';
});

document.getElementById('btn-Home').addEventListener('click', () => {
	window.location.hash = '#home'
});

window.addEventListener('popstate', (event) => {
	if (event.state) {
		switch (event.state.page) {
			case 'home':
				renderHomePage();
				break;
			case 'user':
				renderUserPage();
				break;
			default:
				renderHomePage();
				break;
		}
	} else {
		renderHomePage();
	}
});

// call the router each time the hash changes
window.addEventListener('hashchange', router);

// Execute as soon as the structure of the page is ready for interaction
document.addEventListener('DOMContentLoaded', router);
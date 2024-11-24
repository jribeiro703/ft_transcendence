import { renderAuthPage } from "./renderAuthPage.js";
import { renderHomePage } from "./renderHomePage.js";
import { renderUserPage } from "./renderUserPage.js";
import { renderLoginForm } from "./user/js/renderLoginForm.js";
import { renderRegisterForm } from "./user/js/renderRegisterForm.js";

const pageMap = {
	home: renderHomePage,
	auth: renderAuthPage,
	user: renderUserPage,
	login: renderLoginForm,
	register: renderRegisterForm,
}

function renderPage(page) {
	const renderFunction = pageMap[page] || renderHomePage;
	renderFunction();
}

window.addEventListener('popstate', (event) => {
	if (event.state) {
	  renderPage(event.state.page);
	}
});

export { renderPage };
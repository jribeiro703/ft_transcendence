import { renderAuthPage } from "./renderAuthPage.js";
import { renderHomePage } from "./renderHomePage.js";
import { renderUserPage } from "./renderUserPage.js";
import { renderLoginForm } from "./user/js/renderLoginForm.js";
import { renderOtpForm } from "./user/js/renderOtpForm.js";
import { renderProfilePage } from "./user/js/renderProfilePage.js";
import { renderRegisterForm } from "./user/js/renderRegisterForm.js";
import { renderSettingsPage } from "./user/js/renderSettingPage.js";

const pageMap = {
	home: renderHomePage,
	auth: renderAuthPage,
	user: renderUserPage,
	login: renderLoginForm,
	optForm: renderOtpForm,
	register: renderRegisterForm,
	settings: renderSettingsPage,
	profile: renderProfilePage,
}

function renderPage(page) {
	const renderFunction = pageMap[page] || renderHomePage;
	history.pushState({ page: page }, page, `#${page}`);
	renderFunction();
}

window.addEventListener('popstate', (event) => {
	if (event.state) {
	  renderPage(event.state.page);
	}
});

export { renderPage };
import { renderAuthPage } from "./pages/renderAuthPage.js";
import { renderHomePage } from "../renderHomePage.js";
import { renderUserPage } from "./pages/renderUserPage.js";
import { renderLogin42Page } from "./pages/renderLogin42Page.js";
import { renderLoginForm } from "./pages/renderLoginForm.js";
import { renderOtpForm } from "./pages/renderOtpForm.js";
import { renderProfilePage } from "./pages/renderProfilePage.js";
import { renderRegisterForm } from "./pages/renderRegisterForm.js";
import { renderSettingsPage } from "./pages/renderSettingPage.js";
import { isAuthenticated } from "./isAuthenticated.js";
import { updateUserAvatar } from "./tools.js";

const authPages = {
	auth: renderAuthPage,
	login: renderLoginForm,
	optForm: renderOtpForm,
	register: renderRegisterForm,
	login42: renderLogin42Page,
}

const userPages = {
	user: renderUserPage,
	settings: renderSettingsPage,
	profile: renderProfilePage,
}

async function renderPage(page, updateHistory = true) {
	
	let renderFunction;
	const authenticated = await isAuthenticated();
	await updateUserAvatar(authenticated);
	
	if (authenticated)
		renderFunction = userPages[page];
	else
		renderFunction = authPages[page];

	if (!renderFunction) {
		history.replaceState({ page: "home" }, "home", "#home");
		renderFunction = renderHomePage;
	} else {
		if (updateHistory)
			history.pushState({ page: page }, page, `#${page}`);
	}
	
	renderFunction();
}

// listen to precedent or next page event but don't push state to history
window.addEventListener('popstate', (event) => {
	
	if (event.state) {
	  renderPage(event.state.page, false);
	}
});

export { renderPage };
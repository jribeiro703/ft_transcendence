import { renderAuthPage } from "./renderAuthPage.js";
import { renderHomePage } from "./renderHomePage.js";
import { renderUserPage } from "./renderUserPage.js";
import { renderLoginForm } from "./user/js/renderLoginForm.js";
import { renderOtpForm } from "./user/js/renderOtpForm.js";
import { renderProfilePage } from "./user/js/renderProfilePage.js";
import { renderRegisterForm } from "./user/js/renderRegisterForm.js";
import { renderSettingsPage } from "./user/js/renderSettingPage.js";
import { isAuthenticated } from "./user/token.js";
import { updateUserAvatar } from "./user/tools.js";

const authPages = {
	// home: renderHomePage,
	auth: renderAuthPage,
	login: renderLoginForm,
	optForm: renderOtpForm,
	register: renderRegisterForm,
}

const userPages = {
	user: renderUserPage,
	settings: renderSettingsPage,
	profile: renderProfilePage,
	// inbox: renderInboxPage,
}


async function renderPage(page, updateHistory = true, params = null) {
	
	let renderFunction;
	const authenticated = await isAuthenticated();
	await updateUserAvatar();
	
	if (authenticated)
		renderFunction = userPages[page];
	else
		renderFunction = authPages[page];

	if (!renderFunction) {
		history.replaceState({ page: "home" }, "home", "#home");
		renderFunction = renderHomePage;
	} else {
		if (updateHistory)
			history.pushState({ page: page, params: params }, page, `#${page}`);
	}
	
	await renderFunction(params);
}
export { renderPage };
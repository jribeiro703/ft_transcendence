import { renderAuthPage } from "./renderAuthPage.js";
import { renderHomePage } from "./renderHomePage.js";
import { renderUserPage } from "./renderUserPage.js";
import { renderLogin42Page } from "./user/js/renderLogin42Page.js";
import { renderLoginForm } from "./user/js/renderLoginForm.js";
import { renderOtpForm } from "./user/js/renderOtpForm.js";
import { renderProfilePage } from "./user/js/renderProfilePage.js";
import { renderRegisterForm } from "./user/js/renderRegisterForm.js";
import { renderSettingsPage } from "./user/js/renderSettingPage.js";
import { isAuthenticated } from "./user/token.js";
import { updateUserAvatar } from "./user/tools.js";
import { showGameSelectionView, showGameSelectionMultiView, showGameView,  } from "./game/gameView.js"
import { showSettingMultiView, showSettingView } from "./game/setting.js";
import { showGameBrickView } from "./game/brickout/game.js";
import { showSettingMultiViewB } from "./game/brickout/settings.js";
import { roomMultiView } from "./game/init.js";
import { handleAuth42Callback } from "./user/js/renderLogin42Page.js";	
const authPages = {
	// home: renderHomePage,
	auth: renderAuthPage,
	login: renderLoginForm,
	optForm: renderOtpForm,
	register: renderRegisterForm,
	login42: renderLogin42Page,
	auth42: handleAuth42Callback,
}

const userPages = {
	user: renderUserPage,
	settings: renderSettingsPage,
	profile: renderProfilePage,
	// inbox: renderInboxPage,
}

const pongGamePages = {
	pongGameSolo: showGameSelectionView,
	pongGameMulti: showGameSelectionMultiView,
	pongSettingSolo: (params) => showSettingView(params),
	// pongSettingMulti:showSettingMultiView,
	// pongGameMultiLocal:showGameView,
	// pongLobbyMulti: roomMultiView,
	// pongGameMultiRemote: createRoomView

}

// const brickoutGamePages = {
// 	brickoutGameSolo: showGameBrickView,
// 	brickoutSettingMulti: showSettingMultiViewB,
// 	brickoutGameMultiLocal: showGameSelectionMultiView,
// 	brickoutLobbyMulti: roomMultiViewB,
// 	brickoutMultiRemote: createRoomView,

// }

async function renderPage(page, updateHistory = true, params = null) {
	
	let renderFunction;
	const authenticated = await isAuthenticated();
	await updateUserAvatar();
	
	if (authenticated)
		renderFunction = userPages[page] || pongGamePages[page];
	else
		renderFunction = authPages[page] || pongGamePages[page];

	if (!renderFunction) {
		history.replaceState({ page: "home" }, "home", "#home");
		renderFunction = renderHomePage;
	} else {
		if (updateHistory)
			history.pushState({ page: page, params: params }, page, `#${page}`);
	}
	
	renderFunction(params);
}

// listen to precedent or next page event but don't push state to history
window.addEventListener('popstate', (event) => {
	if (event.state) {
	  renderPage(event.state.page, false, event.state.params);
	}
});

export { renderPage };
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
import { showGameSelectionView } from "./game/pong/gameSelectionView.js";
import { showGameSelectionMultiView } from "./game/pong/gameViewMulti.js";
import { showGameView } from "./game/pong/gameView.js";
import { showSettingView } from "./game/pong/settingsView.js";
import { showGameBrickView } from "./game/brickout/game.js";
import { showSettingViewB } from "./game/brickout/settings.js";


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

const pongGamePages = {
	gameSelectionSoloPage: showGameSelectionView,
	gameSelectionMultiPage: showGameSelectionMultiView,

	pongSettingSolo: (params) => showSettingView(params),
	playPongSolo: showGameView,


	brickoutSettingSolo: (params) => showSettingViewB(params),
	playBrickoutSolo: showGameBrickView,


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
async function renderPage(page, updateHistory = true, params = null)
{
	let renderFunction;
	const authenticated = await isAuthenticated();
	await updateUserAvatar();
	
	if (authenticated)
		renderFunction = userPages[page] || pongGamePages[page];
	else
		renderFunction = authPages[page] || pongGamePages[page];

	const lastPage = sessionStorage.getItem('lastPage');
    const isRefresh = lastPage === page;

	 if (params !== null)
	{
        sessionStorage.setItem('pageParams', JSON.stringify(params));
    }
	if (!renderFunction)
	{
		history.replaceState({ page: "home", params: params }, "home", "#home");
		renderFunction = renderHomePage;
	} 
	else
	{
		if (updateHistory)
		{
			const historyMethod = isRefresh ? 'replaceState' : 'pushState';
            history[historyMethod](
			{ 
                page: page, 
                params: params || JSON.parse(sessionStorage.getItem('pageParams'))

            }, page, `#${page}`);
		}
	}
	sessionStorage.setItem('lastPage', page);
	if (params === null && history.state && history.state.params !== undefined) 
	{
        params = history.state.params;
    }
	
	await renderFunction(params);
}


window.addEventListener('popstate', async (event) =>
{
	if (event.state)
	{
		const storedParams = event.state.params || JSON.parse(sessionStorage.getItem('pageParams'));
		await renderPage(event.state.page, false, storedParams);
	}
});

window.addEventListener('load', () =>
{
    const currentHash = window.location.hash.slice(1) || 'home';
    const currentState = history.state || {};
	sessionStorage.setItem('lastPage', currentHash);

	if (currentHash === 'playPongSolo') 
		renderPage("home");
	else if (currentHash === 'playBrickoutSolo')
		renderPage('home');
	else
		renderPage(currentHash, false, currentState.params || false);
});

// async function renderPage(page, updateHistory = true, params = null) {
	
// 	let renderFunction;
// 	const authenticated = await isAuthenticated();
// 	await updateUserAvatar();
	
// 	if (authenticated)
// 		renderFunction = userPages[page] || pongGamePages[page];
// 	else
// 		renderFunction = authPages[page] || pongGamePages[page];

// 	if (!renderFunction) {
// 		history.replaceState({ page: "home" }, "home", "#home");
// 		renderFunction = renderHomePage;
// 	} else {
// 		if (updateHistory)
// 			history.pushState({ page: page, params: params }, page, `#${page}`);
// 	}
	
// 	console.log("renderpage : ", params);
// 	await renderFunction(params);
// }
export { renderPage };
import gameVar from "./var.js";
import brickVar from "../brickout/var.js";
import brickVar2 from "../brickout/secondBrickout/var.js";
import { showGameSelectionView } from "./gameSelectionView.js";
import { showGameSelectionMultiView } from "./gameViewMulti.js";
import { showSettingView } from "./settingsView.js";
import { showGameView } from "./gameView.js";
import { showGameBrickView } from "../brickout/gameView.js";
import { renderPage } from "../../historyManager.js";

const pongGamePages = {

	gameSelectionSoloPage: showGameSelectionView,
	gameSelectionMultiPage: showGameSelectionMultiView,

	pongSettingSolo: (params) => showSettingView(params),
	playPongSolo: showGameView,


	brickoutSettingSolo: (params) => showSettingViewB(params),
	playBrickoutSolo: showGameBrickView,


	// pongSettingMulti:showSettingMultiView,
	// pongGameMultiLocal:showGameView,
	pongLobbyMulti: showGameSelectionMultiView,
	// pongGameMultiRemote: createRoomView

}

// const brickoutGamePages = {
// 	brickoutGameSolo: showGameBrickView,
// 	brickoutSettingMulti: showSettingMultiViewB,
// 	brickoutGameMultiLocal: showGameSelectionMultiView,
// 	brickoutLobbyMulti: roomMultiViewB,
// 	brickoutMultiRemote: createRoomView,

// }

export async function renderPageGame(page, updateHistory = true, params = null)
{
	let renderFunction;
	// const authenticated = await isAuthenticated();
	// await updateUserAvatar();
	
	// if (authenticated)
	// 	renderFunction = userPages[page] || pongGamePages[page];
	// else
		renderFunction =  pongGamePages[page];

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

// juste before refresh page
window.addEventListener('beforeunload', () =>
{
	console.log("before save refresh: ", gameVar.saveSetting);
    sessionStorage.setItem('gameState', JSON.stringify(
	{
		save: gameVar.saveSetting,

        difficulty: gameVar.difficulty,
        level: gameVar.currentLevel,
        puEnable: gameVar.powerUpEnable,

        difficultyB: brickVar.difficulty,
        levelB: brickVar.currLevel,
        puEnableB: brickVar.powerUpEnable,

        puEnableB: brickVar.powerUpEnable,
        puEnableB: brickVar.powerUpEnable,
        puEnableB: brickVar.powerUpEnable,
		
        puEnableB: brickVar.powerUpEnable,
    }));
});

window.addEventListener('load', () =>
{
	const savedState = sessionStorage.getItem('gameState');
    if (savedState)
	{
        const gameState = JSON.parse(savedState);
		loadSetting(gameState);
    }
    const currentHash = window.location.hash.slice(1) || 'home';
    const currentState = history.state || {};
	sessionStorage.setItem('lastPage', currentHash);

	if (currentHash === 'gameSelectionSoloPage')
	{
		if (gameVar.saveSetting)
		{
			updateDifficultySelection(gameVar.difficulty);
			updateLevelSelection(gameVar.currentLevel);
			updatePowerUpSelection(gameVar.powerUpEnable);
			updateDifficultySelectionB(brickVar.difficulty);
			updateLevelSelectionB(brickVar.currLevel);
			updatePowerUpSelectionB(brickVar.powerUpEnable);
			updateSetting();
			updateSettingB();
		}
	}
	if (currentHash === 'playPongSolo') 
		renderPage("home");
	else if (currentHash === 'playBrickoutSolo')
		renderPage('home');
	else
		renderPage(currentHash, false, currentState.params || false);
});

function loadSetting(gameState)
{	
	gameVar.saveSetting = gameState.save,
	gameVar.difficulty = gameState.difficulty;
	gameVar.currentLevel = gameState.level;
	gameVar.powerUpEnable = gameState.puEnable;
	brickVar.difficulty = gameState.difficultyB;
	brickVar.currLevel = gameState.levelB;
	brickVar.powerUpEnable = gameState.puEnableB;
}
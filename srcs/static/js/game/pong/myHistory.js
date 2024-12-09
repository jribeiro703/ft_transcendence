import gameVar from "./var.js";
import brickVar from "../brickout/var.js";
import { showGameSelectionView } from "./gameSelectionView.js";
import { showGameSelectionMultiView } from "./gameSelectionView.js";
import { showSettingView } from "./settingsView.js";
import { showGameView } from "./gameView.js";
import { showGameBrickLocalView, showGameBrickView } from "../brickout/gameView.js";
import { renderHomePage } from "../../renderHomePage.js";
import { updateDifficultySelection, updateLevelSelection } from "./update.js";
import { updatePowerUpSelection } from "./powerUp.js";
import { updateDifficultySelectionB, updateLevelSelectionB, updateSettingB } from "../brickout/update.js";
import { updatePowerUpSelectionB } from "../brickout/powerUp.js";
import { updateSetting } from "./setting.js";
import { showSettingViewB } from "../brickout/settings.js";
import { initLobbyView } from "./init.js";
import { checkFrame, checkInterval } from "../brickout/score.js";
import { showPongRemote } from "./gameViewMulti.js";
import { updateUserAvatar } from "../../user/tools.js";
import { API_BASE_URL } from "../../user/fetchData.js";
import { isAuthenticated } from "../../user/isAuthenticated.js";

const pongGamePages = {

	gameSelectionSolo: showGameSelectionView,

	pongSetting: (params) => showSettingView(params),
	playPong: showGameView,

	brickoutSetting: (params) => showSettingViewB(params),
	playBrickout: showGameBrickView,

	gameSelectionMulti: showGameSelectionMultiView,


	playPongLocal: showGameView,
	playBrickoutLocal: showGameBrickLocalView,

	pongLobby: initLobbyView,
	brickoutLobby: initLobbyView,

	playPongRemote: showPongRemote,
	// playBrickoutRemote: showBrickoutRemote,
}

export async function renderPageGame(page, updateHistory = true, params = null)
{
	// checkInterval();
	// checkFrame();

    let renderFunction = pongGamePages[page];

    const lastPage = sessionStorage.getItem('lastPage');
    const isRefresh = lastPage === page;
    if (params !== null)
	{
        sessionStorage.setItem('pageParams', typeof params === 'string' ? 
            params : JSON.stringify(params));
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
            history[historyMethod]({ 
                page: page, 
                params: params || sessionStorage.getItem('pageParams')
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


window.addEventListener('beforeunload', () =>
{
    sessionStorage.setItem('gameState', JSON.stringify(
	{
		save: gameVar.saveSetting,

        difficulty: gameVar.difficulty,
        level: gameVar.currentLevel,
        puEnable: gameVar.powerUpEnable,

        difficultyB: brickVar.difficulty,
        levelB: brickVar.currLevel,
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

	if (currentHash === 'gameSelectionSolo' || currentHash === 'gameSelectionMulti')
	{
		if (gameVar.saveSetting)
		{
			updateDifficultySelection(gameVar.difficulty);
			updateLevelSelection(gameVar.currentLevel);
			updatePowerUpSelection(gameVar.powerUpEnable);
			updateDifficultySelectionB(brickVar.difficulty);
			updateLevelSelectionB(brickVar.currLevel);
			updatePowerUpSelectionB(brickVar.powerUpEnable);
			console.log("update setting in refresh");
			updateSetting();
			updateSettingB();
		}
	}
	if (currentHash === 'playPong' || currentHash === 'playBrickout'
		|| currentHash === 'playPongLocal' || currentHash === 'playBrickoutLocal') 
	{
		renderPageGame("home");
	}
	else
	{
		renderPageGame(currentHash, false, currentState.params || false);
	}
});
export function isGamePage(page) 
{
    return ['#gameSelectionSolo', '#pongSetting', '#brickoutSetting', '#playPong', '#playBrickout',
		'#gameSelectionMulti', '#pongLobby', '#brickoutLobby', '#playPongLocal', '#playBrickoutLocal'].includes(page);
}
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

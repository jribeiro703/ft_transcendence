import gameVar from "./var.js";
import { updateSetting, updateLiveSetting } from "./setting.js";
import { initControl, roomMultiView } from "./init.js";
import { updateLevelSelection } from "./update.js";
import { updatePowerUpSelection } from "./powerUp.js";
import { updateDifficultySelection } from "./update.js";
import { showGameSelectionView } from "./gameView.js";
import { showSettingView } from "./setting.js";
import { checkSetting } from "./setting.js";
import { showGameView } from "./gameView.js";
import { checkSettingB } from "./brickout/settings.js";
import { initListenerB } from "./brickout/game.js";
import { showSettingViewB } from "./brickout/settings.js";
import { showGameBrickView } from "./brickout/game.js";
import { showSettingMultiView } from "./setting.js";
import { showGameSelectionMultiView } from "./gameView.js";
import { showSettingMultiViewB } from "./brickout/settings.js";
import brickVar from "./brickout/var.js";
import { showGameBrickMultiView } from "./brickout/game.js";
import { initListenerMultiB } from "./brickout/game.js";
// import { renderPage } from "../historyManager.js";

export function listenSettingPU()
{
	gameVar.withPowerUp.addEventListener('click', () =>
	{
		gameVar.withPowerUp.classList.add('selected');
		gameVar.withoutPowerUp.classList.remove('selected');
		updatePowerUpSelection(true);

	});

	gameVar.withoutPowerUp.addEventListener('click', () => 
	{
		gameVar.withoutPowerUp.classList.add('selected');
		gameVar.withPowerUp.classList.remove('selected');
		updatePowerUpSelection(false); 
	});
}

export function listenSettingDifficulty()
{
	gameVar.easy.addEventListener('click', () => 
	{
		gameVar.easy.classList.add('selected');
		gameVar.medium.classList.remove('selected');
		gameVar.hard.classList.remove('selected');
		updateDifficultySelection('easy');
	});
	
	gameVar.medium.addEventListener('click', () => 
	{
		gameVar.easy.classList.remove('selected');
		gameVar.medium.classList.add('selected');
		gameVar.hard.classList.remove('selected');
		updateDifficultySelection('medium');
	});

	gameVar.hard.addEventListener('click', () => 
	{
		gameVar.easy.classList.remove('selected');
		gameVar.medium.classList.remove('selected');
		gameVar.hard.classList.add('selected');
		updateDifficultySelection('hard');
	});
}

export function listenSettingLevel()
{
	gameVar.tableTennis.addEventListener('click', () =>
	{
		gameVar.tableTennis.classList.add('selected');
		gameVar.footLevel.classList.remove('selected');
		gameVar.tennisLevel.classList.remove('selected');
		updateLevelSelection('tableTennis');
	});

	gameVar.footLevel.addEventListener('click', () =>
	{
		gameVar.tableTennis.classList.remove('selected');
		gameVar.footLevel.classList.add('selected');
		gameVar.tennisLevel.classList.remove('selected');
		updateLevelSelection('football');
	});

	gameVar.tennisLevel.addEventListener('click', () =>
	{
		gameVar.tableTennis.classList.remove('selected');
		gameVar.footLevel.classList.remove('selected');
		gameVar.tennisLevel.classList.add('selected');
		updateLevelSelection('tennis');
	});
}

export function listenSettingSave(live)
{
	
	gameVar.saveBtn.addEventListener('click', () =>
	{
		if (live === true)
		{
			roomMultiView();
			updateLiveSetting();
		}
		else
		{
			showGameSelectionView();
			// renderPage("pongGameSolo");
			updateSetting();
		}
	});
}


export function listenSettingMultiSave(live)
{
	
	gameVar.saveBtn.addEventListener('click', () =>
	{
		if (live === true)
		{
			roomMultiView();
			updateLiveSetting();
		}
		else
		{
			showGameSelectionMultiView();
			// renderPage("pongGameMulti");
			updateSetting();
		}
	});
}

export function listenSettingBtn()
{
	gameVar.settingBtn1.addEventListener('click', () =>
	{
		showSettingView(false);
		// renderPage("pongSettingSolo", true, false);
	});

	gameVar.settingBtn2.addEventListener('click', () =>
	{
		showSettingViewB(false);
		// renderPage("pongSettingMulti", false, false);
	});
}


export function listenSettingMultiBtn()
{
	gameVar.settingBtn1.addEventListener('click', () =>
	{
		showSettingMultiView(false);
	});

	gameVar.settingBtn2.addEventListener('click', () =>
	{
		showSettingMultiViewB();
	});
}

export function listenPlayBtn()
{

	gameVar.playBtn.addEventListener('click', () =>
	{
		gameVar.game = "pong";
		checkSetting();
		showGameView();
	});

	gameVar.playBtn2.addEventListener('click', () =>
	{
		gameVar.game = "brickout";
		checkSettingB();
		showGameBrickView();
		initListenerB();
	});
}

export function listenPlayMultiBtn()
{

	gameVar.playBtn.addEventListener('click', () =>
	{
		gameVar.game = "pong";
		gameVar.localGame = true;
		initControl(gameVar.localGame)
		checkSetting();
		showGameView();
	});

	gameVar.playBtn2.addEventListener('click', () =>
	{
		gameVar.game = "brickout2p";
		checkSettingB();
		showGameBrickMultiView();
		initListenerMultiB();
	});
}
import gameVar from "./var.js";
import { updateSetting, updateLiveSetting } from "./setting.js";
import { roomMultiView } from "./init.js";
import { updateLevelSelection } from "./update.js";
import { updatePowerUpSelection } from "./powerUp.js";
import { updateDifficultySelection } from "./update.js";
import { showGameSelectionView } from "./gameView.js";
import { showSettingView } from "./setting.js";
import { checkSetting } from "./setting.js";
import { showGameView } from "./gameView.js";
import { checkSettingB } from "./brickout/settings.js";
import { showGameBrickView } from "./gameView.js";
import { initListenerB } from "./brickout/game.js";
import { showSettingViewB } from "./brickout/settings.js";

import brickVar from "./brickout/var.js";

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
			updateSetting();
		}
	});
}

export function listenSettingBtn()
{
	gameVar.settingBtn1.addEventListener('click', () =>
	{
		showSettingView(false);
	});

	gameVar.settingBtn2.addEventListener('click', () =>
	{
		showSettingViewB(false);
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
		console.log("settingchane", brickVar.settingChanged);
		checkSettingB();
		showGameBrickView();
		initListenerB();
	});
}
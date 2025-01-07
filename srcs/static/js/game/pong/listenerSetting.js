import gameVar from "./var.js";
import { updateSetting, updateLiveSetting} from "./setting.js";
import { updateLevelSelection } from "./update.js";
import { updatePowerUpSelection } from "./powerUp.js";
import { updateDifficultySelection } from "./update.js";
import { checkSaveBtn } from "./settingsView.js";
import { renderPageGame } from "../HistoryManager.js";

export function listenSettingPU()
{
	gameVar.withPowerUp.addEventListener('click', () =>
	{
		gameVar.withPowerUp.classList.add('selected');
		gameVar.withoutPowerUp.classList.remove('selected');
		updatePowerUpSelection(true, false);
		checkSaveBtn();
	});

	gameVar.withoutPowerUp.addEventListener('click', () =>
	{
		gameVar.withoutPowerUp.classList.add('selected');
		gameVar.withPowerUp.classList.remove('selected');
		updatePowerUpSelection(false, false);
		checkSaveBtn();
	});
}

export function listenSettingDifficulty()
{
	gameVar.easy.addEventListener('click', () => 
	{
		gameVar.easy.classList.add('selected');
		gameVar.medium.classList.remove('selected');
		gameVar.hard.classList.remove('selected');
		updateDifficultySelection('easy', false);
		checkSaveBtn();
	});
	
	gameVar.medium.addEventListener('click', () => 
	{
		gameVar.easy.classList.remove('selected');
		gameVar.medium.classList.add('selected');
		gameVar.hard.classList.remove('selected');
		updateDifficultySelection('medium', false);
		checkSaveBtn();
	});

	gameVar.hard.addEventListener('click', () => 
	{
		gameVar.easy.classList.remove('selected');
		gameVar.medium.classList.remove('selected');
		gameVar.hard.classList.add('selected');
		updateDifficultySelection('hard', false);
		checkSaveBtn();
	});
}

export function listenSettingLevel()
{
	gameVar.classicPong.addEventListener('click', () =>
	{
		gameVar.classicPong.classList.add('selected');
		gameVar.tableTennis.classList.remove('selected');
		gameVar.footLevel.classList.remove('selected');
		gameVar.tennisLevel.classList.remove('selected');
		updateLevelSelection('classicPong', false);
		checkSaveBtn();
	});
	gameVar.tableTennis.addEventListener('click', () =>
	{
		gameVar.classicPong.classList.remove('selected');
		gameVar.tableTennis.classList.add('selected');
		gameVar.footLevel.classList.remove('selected');
		gameVar.tennisLevel.classList.remove('selected');
		updateLevelSelection('tableTennis', false);
		checkSaveBtn();
	});

	gameVar.footLevel.addEventListener('click', () =>
	{
		gameVar.classicPong.classList.remove('selected');
		gameVar.tableTennis.classList.remove('selected');
		gameVar.footLevel.classList.add('selected');
		gameVar.tennisLevel.classList.remove('selected');
		updateLevelSelection('football', false);
		checkSaveBtn();
	});

	gameVar.tennisLevel.addEventListener('click', () =>
	{
		gameVar.classicPong.classList.remove('selected');
		gameVar.tableTennis.classList.remove('selected');
		gameVar.footLevel.classList.remove('selected');
		gameVar.tennisLevel.classList.add('selected');
		updateLevelSelection('tennis', false);
		checkSaveBtn();
	});
}


export function listenSettingSave(info)
{
	gameVar.saveBtn.addEventListener('click', async () =>
	{
		if (info === 'live')
		{
			// await renderPageGame("pongLobby", true);
			renderPageGame("pongLobby", true);
			// updateLiveSetting();
		}
		else if (info === 'local')
		{
			gameVar.saveSetting = true;
			// await renderPageGame("gameSelectionMulti", true);
			renderPageGame("gameSelectionMulti", true);
			// updateSetting();
		}
		else
		{	
			// await renderPageGame("gameSelectionSolo", true);
			renderPageGame("gameSelectionSolo", true);
			// updateSetting();
		}
	});
}

export function listenSettingBtn()
{
	gameVar.settingBtn1.addEventListener('click', () =>
	{
		renderPageGame("pongSetting", true, 'onePlayer');
	});

	gameVar.settingBtn2.addEventListener('click', () =>
	{
		renderPageGame("brickoutSetting", true);
	});
}

export function listenSettingMultiBtn()
{
	gameVar.settingBtn1.addEventListener('click', () =>
	{
		gameVar.saveSetting = true;
		renderPageGame("pongSetting", true, 'local');
	});

	gameVar.settingBtn2.addEventListener('click', () =>
	{
		gameVar.saveSetting = true;
		renderPageGame("brickoutSetting", true, 'local');
	});
}

export function listenPlayBtn()
{
	gameVar.playBtn.addEventListener('click', () =>
	{
		gameVar.game = "pong";
		gameVar.localGame = false;
		renderPageGame("playPong", true);
	});

	gameVar.playBtn2.addEventListener('click', () =>
	{
		gameVar.game = "brickout";
		gameVar.localGame = false;
		renderPageGame("playBrickout", true); 
	});
}

export function listenPlayMultiBtn()
{

	gameVar.playBtn.addEventListener('click', () =>
	{
		gameVar.game = "pong2p";
		gameVar.localGame = true;
		renderPageGame("playPongLocal", true);
	});

	gameVar.playBtn2.addEventListener('click', () =>
	{
		gameVar.game = "brickout2p";
		gameVar.localGame = true;
		renderPageGame("playBrickoutLocal", true);
	});

	gameVar.playBtn3.addEventListener('click', () =>
	{
		gameVar.game = 'pong';
		gameVar.liveMatch = true;
		renderPageGame("pongLobby", true);
	});

	gameVar.playBtn4.addEventListener('click', () =>
	{
		gameVar.game = "brickout";
		gameVar.liveMatch = true;
		renderPageGame("brickoutLobby");
	});
}

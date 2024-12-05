import gameVar from "./var.js";
import { updateSetting, updateLiveSetting} from "./setting.js";
import { updateLevelSelection } from "./update.js";
import { updatePowerUpSelection } from "./powerUp.js";
import { updateDifficultySelection } from "./update.js";
import { checkSaveBtn } from "./settingsView.js";
import { renderPageGame } from "./myHistory.js";


export function listenSettingPU()
{
	gameVar.withPowerUp.addEventListener('click', () =>
	{
		gameVar.withPowerUp.classList.add('selected');
		gameVar.withoutPowerUp.classList.remove('selected');
		updatePowerUpSelection(true);
		checkSaveBtn();
	});

	gameVar.withoutPowerUp.addEventListener('click', () => 
	{
		gameVar.withoutPowerUp.classList.add('selected');
		gameVar.withPowerUp.classList.remove('selected');
		updatePowerUpSelection(false); 
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
		updateDifficultySelection('easy');
		checkSaveBtn();
	});
	
	gameVar.medium.addEventListener('click', () => 
	{
		gameVar.easy.classList.remove('selected');
		gameVar.medium.classList.add('selected');
		gameVar.hard.classList.remove('selected');
		updateDifficultySelection('medium');
		checkSaveBtn();
	});

	gameVar.hard.addEventListener('click', () => 
	{
		gameVar.easy.classList.remove('selected');
		gameVar.medium.classList.remove('selected');
		gameVar.hard.classList.add('selected');
		updateDifficultySelection('hard');
		checkSaveBtn();
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
		checkSaveBtn();
	});

	gameVar.footLevel.addEventListener('click', () =>
	{
		gameVar.tableTennis.classList.remove('selected');
		gameVar.footLevel.classList.add('selected');
		gameVar.tennisLevel.classList.remove('selected');
		updateLevelSelection('football');
		checkSaveBtn();
	});

	gameVar.tennisLevel.addEventListener('click', () =>
	{
		gameVar.tableTennis.classList.remove('selected');
		gameVar.footLevel.classList.remove('selected');
		gameVar.tennisLevel.classList.add('selected');
		updateLevelSelection('tennis');
		checkSaveBtn();
	});
}


export function listenSettingSave(info)
{
	gameVar.saveBtn.addEventListener('click', () =>
	{
		if (info === 'live')
		{
			renderPageGame("pongLobby", true);
			console.log("update 1");
			updateLiveSetting();
		}
		else if (info === 'local')
		{
			gameVar.saveSetting = true;
			renderPageGame("gameSelectionMulti", true);
			updateSetting();
		}
		else
		{	
			renderPageGame("gameSelectionSolo", true);
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
			renderPageGame("pongLobby", true)
			// initLobbyView();
			// updateLiveSetting();
		}
		else
		{
			console.log("to dooo");
			// showGameSelectionMultiView();
			updateSetting();
		}
	});
}

export function listenSettingBtn()
{
	gameVar.settingBtn1.addEventListener('click', () =>
	{
		renderPageGame("pongSetting", true);
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
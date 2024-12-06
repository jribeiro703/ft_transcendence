import gameVar from "./var.js";
import { updateDifficultySelection, updateImageUrl, updateLevelSelection } from "./update.js";
import { updatePowerUpSelection } from "./powerUp.js";
import { displaySetting } from "./display.js";
import { displayGameDataBrick, displayGameDataPong } from "./displayVar.js";

export function checkSetting()
{
	if (gameVar.settingsChanged === false)
	{
		updatePowerUpSelection(false, true); 
		updateDifficultySelection('medium', true);
		updateLevelSelection("calssicPong", true);
	}
}

export function checkSettingLive()
{
	if (gameVar.settingsChanged === false)
	{
		updateDifficultySelection('medium');
		updateLevelSelection('tableTennis');
	}
}

export function updateSetting()
{
	console.log("updateSetting");
	// displayGameDataPong();
	var difficulty = null;	
	var level = null;
	var powerUp = null;

	if (gameVar.difficulty)
		difficulty = gameVar.difficulty;
	else
	{
		difficulty = 'medium';
		updateDifficultySelection('medium', true);
	}

	if (gameVar.currentLevel === 'classicPong')
		level = 'Classic Pong';
	else if (gameVar.currentLevel === 'tableTennis')
		level = 'Table Tennis';
	else if (gameVar.currentLevel === 'football')
		level = 'Football';
	else if (gameVar.currentLevel === 'tennis')
		level = 'Tennis';
	else 
	{
		level = 'Classic Pong';
		updateLevelSelection('classicPong', true);
	}
	if (gameVar.powerUpEnable)
		powerUp = "✅";
	else
	{
		powerUp = "❌";
		updatePowerUpSelection(false, true);
	}

	updateImageUrl();
	displaySetting(difficulty, powerUp, level);
	console.log("end update setting dsiplay = ");
	displayGameDataPong();
}

export function updateLiveSetting()
{
	gameVar.settingsChanged = true;
	var difficulty = null;
	var level = null;

	if (gameVar.difficulty)
		difficulty = gameVar.difficulty;
	else
		difficulty = 'medium';

	if (gameVar.currentLevel)
		level = gameVar.currentLevel;

	const settingContain = document.getElementById('setting-container');
	settingContain.innerHTML = '';
	const settingItem = document.createElement('div');
	settingItem.innerHTML = `
	Difficulty: 
	<span id="difficultyChoice">${difficulty}</span><br>
	Level:
	<span id="levelSelected">${level}</span>
	`;
	settingContain.appendChild(settingItem);
}

export function addPuBtn(info)
{
	if(info === 'live')
	{
		gameVar.powerUpSelection.style.display = 'none';
		gameVar.btnPowerUp.style.display = 'none';
	}
	else
	{
		gameVar.powerUpSelection.style.display = 'block';
		gameVar.btnPowerUp.style.display = 'block';

	}		
}
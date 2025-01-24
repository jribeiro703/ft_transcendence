import gameVar from "./var.js";
import { updateDifficultySelection, updateLevelSelection } from "./update.js";
import { updatePowerUpSelection } from "./powerUp.js";
import { displayLiveSetting, displaySetting } from "./displaySettings.js";

export function checkSetting()
{
	if (gameVar.settingsChanged === false)
	{
		updatePowerUpSelection(false, true); 
		updateDifficultySelection('medium', true);
		updateLevelSelection("classicPong", true);
	}
}

export function checkSettingLive()
{
	if (gameVar.settingsChanged === false)
	{
		updateDifficultySelection('medium');
		updateLevelSelection('classicPong');
	}
}

export function updateSetting()
{
	var difficulty = null;	
	var level = null;
	var powerUp = null;

	if (gameVar.difficulty)
	{
		difficulty = gameVar.difficulty;
	}
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
	displaySetting(difficulty, powerUp, level);
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
	else
		level = 'Classic Pong'

	displayLiveSetting(difficulty, level);
}


export function addPuBtn(info)
{
	if(info === 'live')
	{
		gameVar.btnPowerUp.style.display = 'none';
		gameVar.withPowerUp.style.display = 'none';
		gameVar.withoutPowerUp.style.display = 'none';
	}
	else
	{
		gameVar.btnPowerUp.style.display = 'block';
		gameVar.withPowerUp.style.display = 'block';
		gameVar.withoutPowerUp.style.display = 'block';
	}
}
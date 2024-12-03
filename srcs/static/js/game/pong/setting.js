import gameVar from "./var.js";
import { updateDifficultySelection, updateLevelSelection } from "./update.js";
import { updatePowerUpSelection } from "./powerUp.js";

export function checkSetting()
{
	if (gameVar.settingsChanged === false)
	{
		updatePowerUpSelection(false); 
		updateDifficultySelection('medium');
		updateLevelSelection("tableTennis");
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
	// gameVar.settingsChanged = true;
	var difficulty = null;	
	var level = null;
	var powerUp = null;

	if (gameVar.difficulty)
		difficulty = gameVar.difficulty;
	else
	{
		difficulty = 'medium';
		updateDifficultySelection('medium');
	}

	if (gameVar.football)
		level = 'Football';
	else if (gameVar.tennisTable)
		level = 'Table Tennis';
	else if (gameVar.tennis)
		level = 'Tennis';
	else 
	{
		level = 'Table Tennis';
		updateLevelSelection('tableTennis');
	}
	if (gameVar.powerUpEnable)
		powerUp = "✅";
	else
	{
		powerUp = "❌";
		updatePowerUpSelection(false);
	}

	displaySetting(difficulty, powerUp, level);
}

export function displaySetting(difficulty, powerUp, level)
{
	console.log("displaySetting");
	const settingContain = document.getElementById('settings-column');
	if (!settingContain)
		console.log("error on settingContain");
	settingContain.innerHTML = '';

	const settingItem = document.createElement('div');

	settingItem.innerHTML = `
	<p>Difficulty: <span id="difficultyChoice">${difficulty}</span></p>
	<p>Power-Up: <span id="powerupChoice">${powerUp}</span></p>
	<p>Level: <span id="levelSelected">${level}</span></p>`;

	settingContain.appendChild(settingItem);
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

export function getBtnById()
{
	gameVar.powerUpSelection = document.getElementById('powerUpSelection');
	gameVar.btnPowerUp = document.getElementById('btnPowerUp');
	gameVar.withPowerUp = document.getElementById('withPowerUps');
	gameVar.withoutPowerUp = document.getElementById('withoutPowerUps');
	gameVar.easy = document.getElementById('easy');
	gameVar.medium = document.getElementById('medium');
	gameVar.hard = document.getElementById('hard');
	gameVar.tableTennis = document.getElementById('tableTennis');
	gameVar.footLevel = document.getElementById('footLevel');
	gameVar.tennisLevel = document.getElementById('tennisLevel');
	gameVar.saveBtn = document.getElementById('saveBtn');
}

export function addPuBtn(live)
{
	if(live === false)
	{
		gameVar.powerUpSelection.style.display = 'block';
		gameVar.btnPowerUp.style.display = 'block';
	}
	else
	{
		gameVar.powerUpSelection.style.display = 'none';
		gameVar.btnPowerUp.style.display = 'none';
	}		
}
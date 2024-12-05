import brickVar2 from "./var.js";
import { createPowerUpB } from "./powerUp.js";
import { displayUpdateSetting } from "./settings.js";

export function updateSettingB()
{
	brickVar2.settingChanged = true;
	var difficulty = null;	
	var level = null;
	var powerUp = null;

	if (brickVar2.difficulty)
		difficulty = brickVar2.difficulty;
	else
	{
		difficulty = 'medium';
		updateDifficultySelectionSB('medium');
	}

	if (brickVar2.castle)
		level = 'the Castle';
	else if (brickVar2.x)
		level = 'X Level';
	else if (brickVar2.invader)
		level = 'Space Invader';
	else 
	{
		level = 'Classic';
		updateLevelSelectionB('clasic');
	}

	if (brickVar2.powerUpEnable)
		powerUp = "✅";
	else
	{
		powerUp = "❌";
		updatePowerUpSelectionB(false);
	}

	displayUpdateSetting(difficulty, powerUp, level);
}

export function updateDifficultySelectionSB(level)
{
	if (level == 'easy')
	{
		console.log("easy mode");
		brickVar2.initDx = 2;
		brickVar2.initDy = 2;
		brickVar2.difficulty = 'easy';
	}
	if (level == 'medium')
	{
		console.log('medium mode');
		brickVar2.initDx = 5;
		brickVar2.initDy = 5;
		brickVar2.difficulty = 'medium';
	}
	if (level == 'hard')
	{
		brickVar2.initDx = 8;
		brickVar2.initDy = 8;
		console.log('hard mode');
		brickVar2.difficulty = 'hard';
	}
	// displayBallB();
}

export function updateLevelSelectionB(level)
{
	if (level === "classic")
	{
		brickVar2.classic = true;
		brickVar2.castle = false;
		brickVar2.x = false;
		brickVar2.invader = false;
	}
	else if (level === "castle")
	{
		brickVar2.classic = false;
		brickVar2.castle = true;
		brickVar2.x = false;
		brickVar2.invader = false;
	}
	else if (level === "x")
	{
		brickVar2.classic = false;
		brickVar2.castle = false;
		brickVar2.x = true;
		brickVar2.invader = false;
	}
	else if (level === "invader")
	{
		brickVar2.classic = false;
		brickVar2.castle = false;
		brickVar2.x = false;
		brickVar2.invader = true;
	}
}

export function updatePowerUpSelectionB(selected)
{
	brickVar2.powerUpEnable = selected;

	if (selected)
		console.log("Power-Ups activés B !");
	else 
		console.log("Power-Ups désactivés B !");
}

export function updatePowerUpB()
{
	if (brickVar2.powerUpEnable)
    {
		if (!brickVar2.powerUpActive)
		{
			brickVar2.powerUpY += brickVar2.powerUpSpeed;
			
			if (brickVar2.powerUpY > brickVar2.canvasH)
				createPowerUpB();
		}
	}
}
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
		brickVar2.initDx = 3;
		brickVar2.initDy = 3;
		brickVar2.difficulty = 'easy';
	}
	if (level == 'medium')
	{
		brickVar2.initDx = 5;
		brickVar2.initDy = 5;
		brickVar2.difficulty = 'medium';
	}
	if (level == 'hard')
	{
		brickVar2.initDx = 6;
		brickVar2.initDy = 6;
		brickVar2.difficulty = 'hard';
	}
}

export function updateLevelSelectionB(level)
{
	if (level === "classic")
		brickVar2.currLevel = 'classic'
	else if (level === "castle")
		brickVar2.currLevel = 'castle'
	else if (level === "x")
		brickVar2.currLevel = 'x'
	else if (level === "invader")
		brickVar2.currLevel = 'invader'
}

export function updatePowerUpSelectionB(selected)
{
	brickVar2.powerUpEnable = selected;
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
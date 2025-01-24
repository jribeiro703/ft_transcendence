import brickVar from "./var.js";
import brickVar2 from "./secondBrickout/var.js";
import { updatePowerUpSelectionB as updatePowerUpSelectionFirst} from "./powerUp.js";
import { updatePowerUpSelectionB as updatePowerUpSelectionSecond } from './secondBrickout/update.js'
import { updateLevelSelectionB as updateLevelSelectionFirst} from "./update.js";
import { updateLevelSelectionB as updateLevelSelectionSecond} from "./secondBrickout/update.js";
import { updateDifficultySelectionSB } from "./secondBrickout/update.js";
import { displaySettingB } from "./settings.js";

export function updateSettingB()
{
	var difficulty = null;	
	var level = null;
	var powerUp = null;

	if (brickVar.difficulty)
		difficulty = brickVar.difficulty;
	else
	{
		difficulty = 'medium';
		updateDifficultySelectionB('medium', true);
	}
	if (brickVar.currLevel === 'classic')
		level = 'Classic'
	else if (brickVar.currLevel === 'castle')
		level = 'The Castle';
	else if (brickVar.currLevel === 'x')
		level = 'X Level';
	else if (brickVar.currLevel === 'invader')
		level = 'Space Invader';
	else 
	{
		level = 'Classic';
		updateLevelSelectionFirst('classic', true);
	}

	if (brickVar.powerUpEnable)
		powerUp = "✅";
	else
	{
		powerUp = "❌";
		updatePowerUpSelectionFirst(false, true);
	}
	displaySettingB(difficulty, powerUp, level);
}

export function updateDifficultySelectionB(level, def)
{
	if (level == 'easy')
	{
		brickVar.initDx = 3;
		brickVar.initDy = 3;
		brickVar.difficulty = 'easy';
	}
	if (level == 'medium')
	{
		brickVar.initDx = 5;
		brickVar.initDy = 5;
		brickVar.difficulty = 'medium';
	}
	if (level == 'hard')
	{
		brickVar.initDx = 6;
		brickVar.initDy = 6;
		brickVar.difficulty = 'hard';
	}
	if (!def)
		brickVar.checkDiff = true;
}

export function updateSettingSelectionForSecond()
{
	brickVar2.initDx = brickVar.initDx;
	brickVar2.initDy = brickVar.initDy;
	brickVar2.currLevel = brickVar.currLevel;
	brickVar2.powerUpEnable = brickVar.powerUpEnable;
	brickVar2.difficulty = brickVar.difficulty;
	updateDifficultySelectionSB(brickVar2.difficulty);
	updatePowerUpSelectionSecond(brickVar2.powerUpEnable);
	updateLevelSelectionSecond(brickVar2.currLevel);
}
export function updateLevelSelectionB(level, def)
{
	if (!def)
		brickVar.checkLevel = true;
	if (level === "classic")
		brickVar.currLevel = "classic";
	else if (level === "castle")
		brickVar.currLevel = "castle";
	else if (level === "x")
		brickVar.currLevel = "x";
	else if (level === "invader")
		brickVar.currLevel = "invader";
}
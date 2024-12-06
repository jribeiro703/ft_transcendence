import brickVar from "./var.js";
import brickVar2 from "./secondBrickout/var.js";
import { updatePowerUpSelectionB as updatePowerUpSelectionFirst} from "./powerUp.js";
import { updatePowerUpSelectionB as updatePowerUpSelectionSecond } from './secondBrickout/update.js'
import { updateLevelSelectionB as updateLevelSelectionFirst} from "./secondBrickout/update.js";
import { updateLevelSelectionB as updateLevelSelectionSecond} from "./secondBrickout/update.js";
import { displayUpdateSetting } from "./settings.js";
import { updateDifficultySelectionSB } from "./secondBrickout/update.js";

export function updateSettingB()
{
	console.log("updateSettingB");
	brickVar.settingChanged = true;
	var difficulty = null;	
	var level = null;
	var powerUp = null;

	if (brickVar.difficulty)
		difficulty = brickVar.difficulty;
	else
	{
		difficulty = 'medium';
		updateDifficultySelectionB('medium');
	}

	if (brickVar.castle)
	{
		level = 'the Castle';
		brickVar.currLevel = 'castle';
	}
	else if (brickVar.x)
	{
		level = 'X Level';
		brickVar.currLevel = 'x';
	}
	else if (brickVar.invader)
	{
		level = 'Space Invader';
		brickVar.currLevel = 'invader';
	}
	else 
	{
		level = 'Classic';
		brickVar.currLevel = 'classic';
		updateLevelSelectionFirst('clasic');
	}

	if (brickVar.powerUpEnable)
		powerUp = "✅";
	else
	{
		powerUp = "❌";
		updatePowerUpSelectionFirst(false);
	}

	displayUpdateSetting(difficulty, powerUp, level);
}

export function updateDifficultySelectionB(level)
{
	if (level == 'easy')
	{
		console.log("easy mode");
		brickVar.initDx = 2;
		brickVar.initDy = 2;
		brickVar.difficulty = 'easy';
	}
	if (level == 'medium')
	{
		console.log('medium mode');
		brickVar.initDx = 5;
		brickVar.initDy = 5;
		brickVar.difficulty = 'medium';
	}
	if (level == 'hard')
	{
		brickVar.initDx = 8;
		brickVar.initDy = 8;
		console.log('hard mode');
		brickVar.difficulty = 'hard';
	}
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
export function updateLevelSelectionB(level)
{
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
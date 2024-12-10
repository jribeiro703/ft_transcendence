import brickVar from "./var.js";
import { updatePowerUpSelectionB as updatePowerUpSelectionFirst} from "./powerUp.js";
import { updateLevelSelectionB as updateLevelSelectionFirst} from "./update.js";
import { checkSaveBtn } from "./save.js";
import { updateDifficultySelectionB } from "./update.js";

export function listenSettingPUB()
{
	brickVar.withPowerUp.addEventListener('click', () =>
	{
		brickVar.withPowerUp.classList.add('selected');
		brickVar.withoutPowerUp.classList.remove('selected');
		updatePowerUpSelectionFirst(true, false);
		checkSaveBtn();
	});

	brickVar.withoutPowerUp.addEventListener('click', () => 
	{
		brickVar.withoutPowerUp.classList.add('selected');
		brickVar.withPowerUp.classList.remove('selected');
		updatePowerUpSelectionFirst(false, false); 
		checkSaveBtn();
	});
}

export function listenSettingDifficultyB()
{
	brickVar.easy.addEventListener('click', () => 
	{
		brickVar.easy.classList.add('selected');
		brickVar.medium.classList.remove('selected');
		brickVar.hard.classList.remove('selected');
		updateDifficultySelectionB('easy', false);
		checkSaveBtn();
	});
	
	brickVar.medium.addEventListener('click', () => 
	{
		brickVar.easy.classList.remove('selected');
		brickVar.medium.classList.add('selected');
		brickVar.hard.classList.remove('selected');
		updateDifficultySelectionB('medium', false);
		checkSaveBtn();
	});

	brickVar.hard.addEventListener('click', () => 
	{
		brickVar.easy.classList.remove('selected');
		brickVar.medium.classList.remove('selected');
		brickVar.hard.classList.add('selected');
		updateDifficultySelectionB('hard', false);
		checkSaveBtn();
	});
}

export function listenSettingLevelB()
{
	brickVar.classicLevel.addEventListener('click', () =>
	{
		brickVar.classicLevel.classList.add('selected');
		brickVar.castleLevel.classList.remove('selected');
		brickVar.xLevel.classList.remove('selected');
		brickVar.invaderLevel.classList.remove('selected');
		updateLevelSelectionFirst('classic', false);
		checkSaveBtn();
	});

	brickVar.castleLevel.addEventListener('click', () =>
	{
		brickVar.classicLevel.classList.remove('selected');
		brickVar.castleLevel.classList.add('selected');
		brickVar.xLevel.classList.remove('selected');
		brickVar.invaderLevel.classList.remove('selected');
		updateLevelSelectionFirst('castle', false);
		checkSaveBtn();
	});

	brickVar.xLevel.addEventListener('click', () =>
	{
		brickVar.classicLevel.classList.remove('selected');
		brickVar.castleLevel.classList.remove('selected');
		brickVar.xLevel.classList.add('selected');
		brickVar.invaderLevel.classList.remove('selected');
		updateLevelSelectionFirst('x', false);
		checkSaveBtn();
	});

	brickVar.invaderLevel.addEventListener('click', () =>
	{
		brickVar.classicLevel.classList.remove('selected');
		brickVar.castleLevel.classList.remove('selected');
		brickVar.xLevel.classList.remove('selected');
		brickVar.invaderLevel.classList.add('selected');
		updateLevelSelectionFirst('invader', false);
		checkSaveBtn();
	});
}
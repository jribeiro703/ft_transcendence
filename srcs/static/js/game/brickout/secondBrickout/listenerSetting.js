import brickVar2 from "./var.js";
import { updatePowerUpSelectionB } from "./update.js";
import { updateDifficultySelectionSB } from "./update.js";
import { updateLevelSelectionB } from "./update.js";

export function listenSettingPUB()
{

	brickVar2.withPowerUp.addEventListener('click', () =>
	{
		brickVar2.withPowerUp.classList.add('selected');
		brickVar2.withoutPowerUp.classList.remove('selected');
		updatePowerUpSelectionB(true);
	});

	brickVar2.withoutPowerUp.addEventListener('click', () => 
	{
		brickVar2.withoutPowerUp.classList.add('selected');
		brickVar2.withPowerUp.classList.remove('selected');
		updatePowerUpSelectionB(false); 
	});
}

export function listenSettingDifficultyB()
{
// debug
if (brickVar2.withPowerUp) {
    console.log("Element with ID 'withPowerUps' found");
} else {
    console.log("Element with ID 'withPowerUps' not found");
}
// end debug
	brickVar2.easy.addEventListener('click', () => 
	{
		brickVar2.easy.classList.add('selected');
		brickVar2.medium.classList.remove('selected');
		brickVar2.hard.classList.remove('selected');
		updateDifficultySelectionSB('easy');
	});
	
	brickVar2.medium.addEventListener('click', () => 
	{
		brickVar2.easy.classList.remove('selected');
		brickVar2.medium.classList.add('selected');
		brickVar2.hard.classList.remove('selected');
		updateDifficultySelectionSB('medium');
	});

	brickVar2.hard.addEventListener('click', () => 
	{
		brickVar2.easy.classList.remove('selected');
		brickVar2.medium.classList.remove('selected');
		brickVar2.hard.classList.add('selected');
		updateDifficultySelectionSB('hard');
	});
}

export function listenSettingLevelB()
{
	brickVar2.classicLevel.addEventListener('click', () =>
	{
		brickVar2.classicLevel.classList.add('selected');
		brickVar2.castleLevel.classList.remove('selected');
		brickVar2.xLevel.classList.remove('selected');
		brickVar2.invaderLevel.classList.remove('selected');
		updateLevelSelectionB('classic');
	});

	brickVar2.castleLevel.addEventListener('click', () =>
	{
		brickVar2.classicLevel.classList.remove('selected');
		brickVar2.castleLevel.classList.add('selected');
		brickVar2.xLevel.classList.remove('selected');
		brickVar2.invaderLevel.classList.remove('selected');
		updateLevelSelectionB('castle');
	});

	brickVar2.xLevel.addEventListener('click', () =>
	{
		brickVar2.classicLevel.classList.remove('selected');
		brickVar2.castleLevel.classList.remove('selected');
		brickVar2.xLevel.classList.add('selected');
		brickVar2.invaderLevel.classList.remove('selected');
		updateLevelSelectionB('x');
	});

	brickVar2.invaderLevel.addEventListener('click', () =>
	{
		brickVar2.classicLevel.classList.remove('selected');
		brickVar2.castleLevel.classList.remove('selected');
		brickVar2.xLevel.classList.remove('selected');
		brickVar2.invaderLevel.classList.add('selected');
		updateLevelSelectionB('invader');
	});
}

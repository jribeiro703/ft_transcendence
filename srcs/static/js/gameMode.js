import gameVar from "./var.js";

export function updateLevelSelection(level)
{
	gameVar.init_dx = 5;
	gameVar.init_dy = 5;
	gameVar.init_dx2 = 5;
	gameVar.init_dy2 = 5;
	if (level == 'easy')
	{
		console.log("easy mode");
		gameVar.init_dx = 3;
		gameVar.init_dy = 3;
	}
	if (level == 'medium')
	{
		console.log('medium mode');
		gameVar.init_dx = 6;
		gameVar.init_dy = 6;
	}
	if (level == 'hard')
	{
		gameVar.init_dx = 8;
		gameVar.init_dy = 8;
		console.log('hard mode');
	}

}

export function updateMapSelection(level)
{
	if (level == 'tableTennis')
		gameVar.customMap = false;
	if (level == 'brickLevel')
		gameVar.customMap = true;
}
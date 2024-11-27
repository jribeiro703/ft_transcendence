import gameVar from "./var.js";

export function updateDifficultySelection(level)
{
	if (level == 'easy')
	{
		console.log("easy mode");
		gameVar.init_dx = 2;
		gameVar.init_dy = 2;
		gameVar.aiLevel = 8;
		gameVar.difficulty = 'easy';
	}
	if (level == 'medium')
	{
		console.log('medium mode');
		gameVar.init_dx = 5;
		gameVar.init_dy = 5;
		gameVar.aiLevel = 10;
		gameVar.difficulty = 'medium';
	}
	if (level == 'hard')
	{
		gameVar.init_dx = 7;
		gameVar.init_dy = 7;
		gameVar.aiLevel = 12;
		console.log('hard mode');
		gameVar.difficulty = 'hard';
	}

}

export function updateLevelSelection(level)
{
	if (level === "tableTennis")
	{
		gameVar.tennisTable = true;
		gameVar.football = false;
		gameVar.tennis = false;
		gameVar.currentLevel = "tableTennis";
	}
	else if (level === "football")
	{
		gameVar.tennisTable = false;
		gameVar.football = true;
		gameVar.tennis = false;
		gameVar.currentLevel = "football";
	}
	else if (level === "tennis")
	{
		gameVar.tennisTable = false;
		gameVar.football = false;
		gameVar.tennis = true;
		gameVar.currentLevel = "tennis";
	}
}
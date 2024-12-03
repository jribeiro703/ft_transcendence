import gameVar from "./var.js";
import brickVar from "../brickout/var.js";

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
export function updateImageUrl()
{
	gameVar.pongUrl = "static/css/images/ttLevel.png";
	if (gameVar.football)
		gameVar.pongUrl = "static/css/images/footballLevel.png";
	else if (gameVar.tennis)
		gameVar.pongUrl = "static/css/images/tennisLevel.png";

	gameVar.brickUrl = "static/css/images/brickout.png";
	if (brickVar.castle)
		gameVar.brickUrl = "static/css/images/castleLevel.png";
	else if (brickVar.x)
		gameVar.brickUrl = "static/css/images/xLevel.png";
	else if (brickVar.invader)
		gameVar.brickUrl = 'static/css/images/invadersLevel.png';
}
export function updateCanvasColor()
{
	let color = null;
	if (gameVar.currentLevel === 'tennisTable')
		color = '#1A1A40';
	if (gameVar.currentLevel === 'football')
		color = '#006400';
	else if (gameVar.currentLevel === 'tennis')
		color = '#D2691E';
   
    const canvas = document.getElementById('myCanvas');
    if (canvas)
	{
        canvas.style.backgroundColor = color;
    }
}
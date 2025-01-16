import gameVar from "./var.js";
import brickVar from "../brickout/var.js";

export function updateDifficultySelection(level, def)
{
	if (!def)
		gameVar.checkDiff = true;
	if (level == 'easy')
	{
		gameVar.init_dx = 2;
		gameVar.init_dy = 2;
		gameVar.aiLevel = 8;
		gameVar.difficulty = 'easy';
	}
	if (level == 'medium')
	{
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
		gameVar.difficulty = 'hard';
	}
}

export function updateLevelSelection(level, def)
{
	if (!def)
		gameVar.checkLevel = true;

	if (level === 'classicPong')
		gameVar.currentLevel = 'classicPong';
	else if (level === "tableTennis")
		gameVar.currentLevel = "tableTennis";
	else if (level === "football")
		gameVar.currentLevel = "football";
	else if (level === "tennis")
		gameVar.currentLevel = "tennis";
}

export function updateImageUrl()
{

	if (gameVar.currentLevel === 'tableTennis')
		gameVar.pongUrl = "static/css/images/ttLevel.png"
	else if (gameVar.currentLevel === 'football')
		gameVar.pongUrl = "static/css/images/footballLevel.png";
	else if (gameVar.currentLevel === 'tennis')
		gameVar.pongUrl = "static/css/images/tennisLevel.png";
	else
		gameVar.pongUrl = "static/css/images/classicPong.png";

	if (brickVar.currLevel === 'castle')
		gameVar.brickUrl = "static/css/images/castleLevel.png";
	else if (brickVar.currLevel === 'x')
		gameVar.brickUrl = "static/css/images/xLevel.png";
	else if (brickVar.currLevel === 'invader')
		gameVar.brickUrl = 'static/css/images/invadersLevel.png';
	else
		gameVar.brickUrl = "static/css/images/brickout.png";
}

export function 	updateCanvasColor()
{
	let color = null;
	if (gameVar.currentLevel === 'classicPong')
		color = 'black';
	else if (gameVar.currentLevel === 'tableTennis')
		color = '#1A1A40';
	else if (gameVar.currentLevel === 'football')
		color = '#006400';
	else if (gameVar.currentLevel === 'tennis')
		color = '#D2691E';
    const canvas = document.getElementById('myCanvas');
    if (canvas)
	{
        canvas.style.backgroundColor = color;
		if (gameVar.currentLevel === 'classicPong')
		{
			canvas.style.borderLeft = '10px solid black';
			canvas.style.borderRight = '10px solid black';
			canvas.style.borderTop = 'none';
			canvas.style.borderBottom = 'none';
		}
    }
}

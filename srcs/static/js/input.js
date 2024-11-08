import gameVar from "./var.js";

export function keyDownHandler(e)
{
	if (e.key == "ArrowUp")
	{
		gameVar.playerUpPressed = true;
	}
	else if (e.key == "ArrowDown") 
	{
		gameVar.playerDownPressed = true;
	}
}
	
export function keyUpHandler(e)
{
	if (e.key == "ArrowUp")
	{
		gameVar.playerUpPressed = false;
	} 
	else if (e.key == "ArrowDown")
	{
		gameVar.playerDownPressed = false;
	}
}

export function startBall(e)
{
	if (e.code == "Space" && !gameVar.matchOver && !gameVar.aiServe && !gameVar.gameStart)
	{
		gameVar.gameStart = true;
		gameVar.dx = gameVar.init_dx;
		gameVar.dy = (Math.random() < 0.5 ? gameVar.init_dy : -gameVar.init_dy);
	}
}
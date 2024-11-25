import gameVar from "./var.js";
import { sendBallData, sendDirectionData } from "./network.js";


export function checkball()
{
	if (ballPositionChanged())
	{
		sendBallData(gameVar.x, gameVar.y, gameVar.gameSocket);
	}
	if (ballDirectionChanged())
	{
		sendDirectionData(gameVar.dx, gameVar.dy, gameVar.gameSocket);
	}
}

export function ballPositionChanged()
{
	if (gameVar.x != gameVar.previousBallState.x || gameVar.y != gameVar.previousBallState.y)
	{
		gameVar.previousBallState.x = gameVar.x;
		gameVar.previousBallState.y = gameVar.y;
		return (true);
	}
	return (false);
}

export function ballDirectionChanged()
{
	if (gameVar.dx != gameVar.previousBallState.dx || gameVar.dy != gameVar.previousBallState.dy)
	{
		gameVar.previousBallState.dx = gameVar.dx;
		gameVar.previousBallState.dy = gameVar.dy;
		return (true);
	}
	return (false);
}
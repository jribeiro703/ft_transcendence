import gameVar from "./var.js";
import { INIT_DX, INIT_DY, PADDLE_SPEED, AI_UPDATE_INTERVAL} from './const.js';

export function aiServeBall()
{
	if (!gameVar.matchOver)
	{
		setTimeout(() => 
		{
			gameVar.gameStart = true;
			gameVar.dx = -INIT_DX;
			gameVar.dy = (Math.random() < 0.5 ? INIT_DY : -INIT_DY);
			gameVar.aiServe = false;
		}, 1000);
	}
}

export function aiMovement()
{
	gameVar.aiMoveInterval = setInterval(() => {
		updateIaMove();	
	}, AI_UPDATE_INTERVAL);	
}

export function updateIaMove()
{
	if (gameVar.dx > 0 && gameVar.x > gameVar.canvasW / 2) 
	{
		if (gameVar.y < gameVar.aiPaddleX + gameVar.aiPaddleHeight / 2 && gameVar.aiPaddleX > 0)
		{
			gameVar.aiPaddleX -= PADDLE_SPEED;
		}
		else if (gameVar.y > gameVar.aiPaddleX + gameVar.aiPaddleHeight / 2 && gameVar.aiPaddleX < gameVar.canvasH - gameVar.aiPaddleHeight)
		{
			gameVar.aiPaddleX += PADDLE_SPEED;
		}
	}
}
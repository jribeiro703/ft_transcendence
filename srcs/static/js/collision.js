import gameVar from "./var.js";
import { resetBall } from "./reset.js";


export function collisionPaddleAi()
{
	if(gameVar.x - gameVar.ballRadius < gameVar.playerPaddleWidth &&
			gameVar.y > gameVar.playerPaddleY &&
			gameVar.y < gameVar.playerPaddleY + gameVar.playerPaddleHeight)
	{
		gameVar.x = gameVar.playerPaddleWidth + gameVar.ballRadius;
		let hitpos = (gameVar.y - gameVar.playerPaddleY) / gameVar.playerPaddleHeight;
		let angle = (hitpos - 0.5) * Math.PI / 2;
		gameVar.dx = (Math.cos(angle) * Math.abs(gameVar.dx) + 1);
		gameVar.dy = (Math.sin(angle) * Math.abs(gameVar.dy) - gameVar.init_dy);
		if (gameVar.dx > gameVar.init_dx + 1)
			gameVar.dx -= 1;
	}
	else if (gameVar.x + gameVar.ballRadius > gameVar.canvasW - gameVar.aiPaddleWidth &&
		gameVar.y > gameVar.aiPaddleY &&
		gameVar.y < gameVar.aiPaddleY + gameVar.aiPaddleHeight)
	{
		gameVar.x = gameVar.canvasW - gameVar.aiPaddleWidth - gameVar.ballRadius;
		let hitpos = (gameVar.y - gameVar.aiPaddleY) / gameVar.aiPaddleHeight;
		let angle = (hitpos - 0.5) * Math.PI / 2;
		gameVar.dx = -(Math.cos(angle) * Math.abs(gameVar.dx) + 1);
		gameVar.dy = (Math.sin(angle) * Math.abs(gameVar.dy) - gameVar.init_dy);
	}
}

export function manageCollision()
{
	gameVar.x += gameVar.dx;
	gameVar.y += gameVar.dy;
	if(gameVar.y + gameVar.dy > gameVar.canvasH - gameVar.ballRadius || gameVar.y + gameVar.dy < gameVar.ballRadius)
	{
		gameVar.dy = -gameVar.dy;
	}
	collisionPaddle();	
	ballOut();
}

export function ballOut()
{
	if (gameVar.x < 0)
	{
		resetBall('ai');
	}
	else if (gameVar.x > gameVar.canvasW)
	{
		resetBall('player');
	}
}
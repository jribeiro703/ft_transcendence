import gameVar from "./var.js";
import { resetBall } from "./reset.js";
import { checkball } from "./check.js";
import { collisionFoot } from "./foot.js";
import { collisionTennis } from "./tennis.js";
import { collisionPaddleAi } from "./ai.js";

export function manageRealCollision()
{
	gameVar.x += gameVar.dx;
    gameVar.y += gameVar.dy;
	collisionWall();
	if (!gameVar.localGame)
	{
		collisionPaddleAi();
		ballOut('ai');
	}
	else
	{
		collisionPaddle();
		ballOut('player2');
	}
}

export function collisionPaddleP1()
{
	if (gameVar.x > gameVar.playerPaddleWidth)
		return;
	gameVar.x = gameVar.playerPaddleWidth + gameVar.ballRadius;
	let hitpos = (gameVar.y - gameVar.playerPaddleY) / gameVar.playerPaddleHeight;
	let angle = (hitpos - 0.5) * Math.PI / 2;
	gameVar.dx = (Math.cos(angle) * Math.abs(gameVar.dx) + 1);
	gameVar.dy = (Math.sin(angle) * Math.abs(gameVar.dy) - gameVar.init_dy);
	if (gameVar.dx > gameVar.init_dx + 1)
		gameVar.dx -= 1;
}

export function collisionPaddleP2()
{
	if (gameVar.x < gameVar.canvasW - gameVar.player2PaddleWidth)
		return ;
	gameVar.x = gameVar.canvasW - gameVar.player2PaddleWidth - gameVar.ballRadius;
	let hitpos = (gameVar.y - gameVar.player2PaddleY) / gameVar.player2PaddleHeight;
	let angle = (hitpos - 0.5) * Math.PI / 2;
	gameVar.dx = -(Math.cos(angle) * Math.abs(gameVar.dx) + 1);
	gameVar.dy = (Math.sin(angle) * Math.abs(gameVar.dy) - gameVar.init_dy);
}

export function collisionWall()
{
	if(gameVar.y + gameVar.dy > gameVar.canvasH - gameVar.ballRadius || gameVar.y + gameVar.dy < gameVar.ballRadius)
	{
		gameVar.dy = -gameVar.dy;
		return (true);
	}
	else if (gameVar.currentLevel === 'football')
	{
		if (collisionFoot())
			return (true);
	}
	else if (gameVar.currentLevel === 'tennis')
	{
		if (collisionTennis())
			return (true);
	}
}

export function collisionPaddle()
{
	if(gameVar.x - gameVar.ballRadius < gameVar.playerPaddleWidth &&
			gameVar.y > gameVar.playerPaddleY &&
			gameVar.y < gameVar.playerPaddleY + gameVar.playerPaddleHeight)
	{
		collisionPaddleP1();
	}
	if (gameVar.x + gameVar.ballRadius > gameVar.canvasW - gameVar.player2PaddleWidth &&
			gameVar.y > gameVar.player2PaddleY &&
			gameVar.y < gameVar.player2PaddleY + gameVar.player2PaddleHeight)
	{
		collisionPaddleP2();
	}

}

export function manageCollisionLive()
{
	let directChanged = false;
	let posChanged = false;

	gameVar.x += gameVar.dx;
	gameVar.y += gameVar.dy;
	posChanged = true;

	if (collisionWall())
		directChanged = true;
	if (gameVar.playerIdx == 1)
	{
		if(gameVar.x - gameVar.ballRadius < gameVar.playerPaddleWidth &&
			gameVar.y > gameVar.playerPaddleY &&
			gameVar.y < gameVar.playerPaddleY + gameVar.playerPaddleHeight)
		{
			collisionPaddleP1();
			posChanged = true;
			directChanged = true;		
		}
	}
	if (gameVar.playerIdx == 2)
	{
		if (gameVar.x + gameVar.ballRadius > gameVar.canvasW - gameVar.player2PaddleWidth &&
			gameVar.y > gameVar.player2PaddleY &&
			gameVar.y < gameVar.player2PaddleY + gameVar.player2PaddleHeight)
		{
			collisionPaddleP2();
			directChanged = true;
			posChanged = true;
		}
	}
	if (gameVar.x < 0)
	{
		resetBall('player2');
		directChanged = true;
		posChanged = true;
	}
	else if (gameVar.x > gameVar.canvasW)
	{
		resetBall('player');
		directChanged = true;
		posChanged = true;
	}
	if (directChanged || posChanged)
	{
		checkball();
	}
}

export function ballOut(player)
{
	if (gameVar.x < 0)
	{
		if (player === 'ai')
			resetBall('ai');
		else if (player === 'player2')
			resetBall('player2');
	}
	else if (gameVar.x > gameVar.canvasW)
	{
		resetBall('player');
	}
}

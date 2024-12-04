import gameVar from "./var.js";
import { BALL_RADIUS, PADDLE_SPEED } from "./const.js";
import { resetBall } from "./reset.js";

function checkCollisionWithWalls()
{
    const map = gameVar.maps['customMap1'];
    if (map) 
	{
        map.forEach(wall =>
		{
            if (gameVar.x + BALL_RADIUS > wall.x &&
				gameVar.x - BALL_RADIUS < wall.x + wall.width &&
                gameVar.y + BALL_RADIUS > wall.y &&
				gameVar.y - BALL_RADIUS < wall.y + wall.height)
			{
				
                if (gameVar.x + BALL_RADIUS > wall.x &&
					gameVar.x - BALL_RADIUS < wall.x + wall.height &&
					wall.sta == 1)
				{
                    gameVar.dx = -gameVar.dx;
					wall.sta = 0;
                }
                if (gameVar.y + BALL_RADIUS > wall.y &&
					gameVar.y - BALL_RADIUS < wall.y + wall.width &&
					wall.sta == 1)
				{
                    gameVar.dy = -gameVar.dy;
					wall.sta = 0;
                }
            }
        });
    }
}

export function manageCollision()
{
	gameVar.x += gameVar.dx;
	gameVar.y += gameVar.dy;
	if(gameVar.y + gameVar.dy > gameVar.canvasH - BALL_RADIUS || gameVar.y + gameVar.dy < BALL_RADIUS)
	{
		gameVar.dy = -gameVar.dy;
	}
	if (gameVar.customMap == true)
		checkCollisionWithWalls();
	if(gameVar.x - BALL_RADIUS < gameVar.playerPaddleWidth &&
		gameVar.y > gameVar.playerPaddleY &&
		gameVar.y < gameVar.playerPaddleY + gameVar.playerPaddleHeight)
	{
		gameVar.x = gameVar.playerPaddleWidth + BALL_RADIUS;
		let hitpos = (gameVar.y - gameVar.playerPaddleY) / gameVar.playerPaddleHeight;
		let angle = (hitpos - 0.5) * Math.PI / 2;
		gameVar.dx = (Math.cos(angle) * Math.abs(gameVar.dx) + 1);
		gameVar.dy = (Math.sin(angle) * Math.abs(gameVar.dy) - gameVar.init_dy);
		if (gameVar.dx > gameVar.init_dx + 1)
			gameVar.dx -= 1;
	}
	else if (gameVar.x + BALL_RADIUS > gameVar.canvasW - gameVar.aiPaddleWidth &&
		gameVar.y > gameVar.aiPaddleY &&
		gameVar.y < gameVar.aiPaddleY + gameVar.aiPaddleHeight)
	{
		gameVar.x = gameVar.canvasW - gameVar.aiPaddleWidth - BALL_RADIUS;
		let hitpos = (gameVar.y - gameVar.aiPaddleY) / gameVar.aiPaddleHeight;
		let angle = (hitpos - 0.5) * Math.PI / 2;
		gameVar.dx = -(Math.cos(angle) * Math.abs(gameVar.dx) + 1);
		gameVar.dy = (Math.sin(angle) * Math.abs(gameVar.dy) - gameVar.init_dy);
	}
	if (gameVar.x < 0)
	{
		resetBall('ai');
	}
	else if (gameVar.x > gameVar.canvasW)
	{
		resetBall('player');
	}
}

export function manageServer()
{
	if (gameVar.currenServer == 'player')
	{
		gameVar.x = gameVar.playerPaddleWidth + BALL_RADIUS;
		gameVar.y = gameVar.playerPaddleY + gameVar.playerPaddleHeight / 2;
	}
	else
	{
		gameVar.x = gameVar.canvasW - gameVar.aiPaddleWidth - BALL_RADIUS;
		gameVar.y = gameVar.aiPaddleY + gameVar.aiPaddleHeight / 2;
	}
}

export function manageMove()
{
	if (!gameVar.matchOver)
	{
		if (gameVar.playerUpPressed && gameVar.playerPaddleY > 0)
		{
			gameVar.playerPaddleY -= PADDLE_SPEED;
		} 
		else if (gameVar.playerDownPressed && gameVar.playerPaddleY < gameVar.canvasH - gameVar.playerPaddleHeight)
		{
			gameVar.playerPaddleY += PADDLE_SPEED;
		} 
	}
}
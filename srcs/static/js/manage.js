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
	console.log("dx : ", gameVar.dx, "dy :", gameVar.dy);
	if(gameVar.y + gameVar.dy > gameVar.canvasH - BALL_RADIUS || gameVar.y + gameVar.dy < BALL_RADIUS)
	{
		gameVar.dy = -gameVar.dy;
	}
	if (gameVar.customMap == true)
		checkCollisionWithWalls();
	if(gameVar.x - BALL_RADIUS < gameVar.playerPaddleWidth &&
		gameVar.y > gameVar.playerPaddleX &&
		gameVar.y < gameVar.playerPaddleX + gameVar.playerPaddleHeight)
	{
		gameVar.x = gameVar.playerPaddleWidth + BALL_RADIUS;
		let hitpos = (gameVar.y - gameVar.playerPaddleX) / gameVar.playerPaddleHeight;
		let angle = (hitpos - 0.5) * Math.PI / 2;
		console.log("angle : ", angle);
		gameVar.dx = (Math.cos(angle) * Math.abs(gameVar.dx) + 1);
		gameVar.dy = (Math.sin(angle) * Math.abs(gameVar.dy) - gameVar.init_dy);
		if (gameVar.dx > gameVar.init_dx + 1)
			gameVar.dx -= 1;
		gameVar.lastTouch = 'player'
	}
	else if (gameVar.x + BALL_RADIUS > gameVar.canvasW - gameVar.aiPaddleWidth &&
		gameVar.y > gameVar.aiPaddleX &&
		gameVar.y < gameVar.aiPaddleX + gameVar.aiPaddleHeight)
	{
		gameVar.x = gameVar.canvasW - gameVar.aiPaddleWidth - BALL_RADIUS;
		let hitpos = (gameVar.y - gameVar.aiPaddleX) / gameVar.aiPaddleHeight;
		let angle = (hitpos - 0.5) * Math.PI / 2;
		gameVar.dx = -(Math.cos(angle) * Math.abs(gameVar.dx) + 1);
		gameVar.dy = (Math.sin(angle) * Math.abs(gameVar.dy) - gameVar.init_dy);
		gameVar.lastTouch = 'ai';
	}
	if (gameVar.x < 0)
	{
		resetBall('ai');
		gameVar.lastTouch = 'ai';
	}
	else if (gameVar.x > gameVar.canvasW)
	{
		resetBall('player');
		gameVar.lastTouch = 'player';
	}
}

export function manageServer()
{
	if (gameVar.currenServer == 'player')
	{
		gameVar.x = gameVar.playerPaddleWidth + BALL_RADIUS;
		gameVar.y = gameVar.playerPaddleX + gameVar.playerPaddleHeight / 2;
	}
	else
	{
		gameVar.x = gameVar.canvasW - gameVar.aiPaddleWidth - BALL_RADIUS;
		gameVar.y = gameVar.aiPaddleX + gameVar.aiPaddleHeight / 2;
	}
}

export function manageMove()
{
	if (gameVar.playerUpPressed && gameVar.playerPaddleX > 0)
	{
		gameVar.playerPaddleX -= PADDLE_SPEED;
	} 
	else if (gameVar.playerDownPressed && gameVar.playerPaddleX < gameVar.canvasH - gameVar.playerPaddleHeight)
	{
		gameVar.playerPaddleX += PADDLE_SPEED;
	}  
}
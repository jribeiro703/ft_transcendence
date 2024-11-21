import gameVar from "./var.js";
import { BALL_RADIUS, PADDLE_SPEED } from "./const.js";
import { resetBall } from "./reset.js";
import { sendBallData, sendDirectionData, sendPaddleData } from "./network.js";
import { displayVar } from "./input.js";

export function checkCollisionWithWalls()
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
	let directChanged = false;
	let posChanged = false;

	gameVar.x += gameVar.dx;
	gameVar.y += gameVar.dy;

	posChanged = true;
	if (gameVar.customMap == true)
	{
		checkCollisionWithWalls();
		directChanged = true;
	}
	if(gameVar.y + gameVar.dy > gameVar.canvasH - BALL_RADIUS || gameVar.y + gameVar.dy < BALL_RADIUS)
	{
		gameVar.dy = -gameVar.dy;
		directChanged = true;
	}
	if (gameVar.playerIdx == 1)
	{
		if(gameVar.x - BALL_RADIUS < gameVar.playerPaddleWidth &&
			gameVar.y > gameVar.playerPaddleY &&
			gameVar.y < gameVar.playerPaddleY + gameVar.playerPaddleHeight)
		{
			if (gameVar.x > gameVar.playerPaddleWidth)
			{
				return;
			}
			gameVar.x = gameVar.playerPaddleWidth + BALL_RADIUS;
			let hitpos = (gameVar.y - gameVar.playerPaddleY) / gameVar.playerPaddleHeight;
			let angle = (hitpos - 0.5) * Math.PI / 2;
			gameVar.dx = (Math.cos(angle) * Math.abs(gameVar.dx) + 1);
			gameVar.dy = (Math.sin(angle) * Math.abs(gameVar.dy) - gameVar.init_dy);
			posChanged = true;
			directChanged = true;
			if (gameVar.dx > gameVar.init_dx + 1)
			{
				gameVar.dx -= 1;
			}
		}
	}
	if (gameVar.playerIdx == 2)
	{
		if (gameVar.x + BALL_RADIUS > gameVar.canvasW - gameVar.player2PaddleWidth &&
			gameVar.y > gameVar.player2PaddleY &&
			gameVar.y < gameVar.player2PaddleY + gameVar.player2PaddleHeight)
		{
			if (gameVar.x < gameVar.canvasW - gameVar.player2PaddleWidth)
			{
				return ;
			}
			gameVar.x = gameVar.canvasW - gameVar.player2PaddleWidth - BALL_RADIUS;
			let hitpos = (gameVar.y - gameVar.player2PaddleY) / gameVar.player2PaddleHeight;
			let angle = (hitpos - 0.5) * Math.PI / 2;
			gameVar.dx = -(Math.cos(angle) * Math.abs(gameVar.dx) + 1);
			gameVar.dy = (Math.sin(angle) * Math.abs(gameVar.dy) - gameVar.init_dy);
			directChanged = true;
			posChanged = true;
		}
	}
	if (gameVar.x < 0 || gameVar.x > gameVar.canvasW)
	{
		resetBall(gameVar.x < 0 ? 'player2' : 'player');
		directChanged = true;
		posChanged = true;
	}
	if (directChanged || posChanged)
	{
		checkball();
	}
}

export function manageServer()
{
	if (gameVar.currenServer == 'player')
	{
		gameVar.x = gameVar.playerPaddleWidth + BALL_RADIUS;
		gameVar.y = gameVar.playerPaddleY + gameVar.playerPaddleHeight / 2;
	}
	else if (gameVar.currenServer == 'player2')
	{
		gameVar.x = gameVar.canvasW - gameVar.player2PaddleWidth - BALL_RADIUS;
		gameVar.y = gameVar.player2PaddleY + gameVar.player2PaddleHeight / 2;
	}
	sendBallData(gameVar.x, gameVar.y, gameVar.gameSocket);
}

export function manageMove()
{
	if (!gameVar.matchOver)
	{
		if (gameVar.playerIdx == 1)
		{
			if (gameVar.playerUpPressed && gameVar.playerPaddleY > 0)
			{
				gameVar.playerPaddleY -= PADDLE_SPEED;
				sendPaddleData(gameVar.playerPaddleY, gameVar.gameSocket, 1);
			} 
			else if (gameVar.playerDownPressed && gameVar.playerPaddleY < gameVar.canvasH - gameVar.playerPaddleHeight)
			{
				gameVar.playerPaddleY += PADDLE_SPEED;
				sendPaddleData(gameVar.playerPaddleY, gameVar.gameSocket, 1);
			} 
		}
		if (gameVar.playerIdx == 2)
		{
			if (gameVar.playerUpPressed && gameVar.player2PaddleY > 0)
			{
				gameVar.player2PaddleY -= PADDLE_SPEED;
				sendPaddleData(gameVar.player2PaddleY, gameVar.gameSocket, 2);
			} 
			else if (gameVar.playerDownPressed && gameVar.player2PaddleY < gameVar.canvasH - gameVar.player2PaddleHeight)
			{
				gameVar.player2PaddleY += PADDLE_SPEED;
				sendPaddleData(gameVar.player2PaddleY, gameVar.gameSocket, 2);
			}
		}
	}
}

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
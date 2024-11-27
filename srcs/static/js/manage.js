import gameVar from "./var.js";
import { PADDLE_SPEED } from "./const.js";
import { resetBall } from "./reset.js";
import { sendBallData, sendPaddleData } from "./network.js";
import { collisionFoot } from "./foot.js";
import { collisionPaddleAi, ballOut } from "./collision.js";
import { tennisCollision } from "./tennis.js";
import { checkball } from "./check.js";

export function manageRealCollision()
{
	gameVar.x += gameVar.dx;
    gameVar.y += gameVar.dy;
	if (gameVar.y + gameVar.dy > gameVar.canvasH - gameVar.ballRadius || 
		gameVar.y + gameVar.dy < gameVar.ballRadius)
	{
		gameVar.dy = -gameVar.dy;
		// directChanged = true;
	}
	if (gameVar.football)
		collisionFoot();
	if (gameVar.tennis)
		tennisCollision();
	collisionPaddleAi();
	ballOut();
}

export function manageCollisionLive()
{
	let directChanged = false;
	let posChanged = false;

	gameVar.x += gameVar.dx;
	gameVar.y += gameVar.dy;

	posChanged = true;
	if(gameVar.y + gameVar.dy > gameVar.canvasH - gameVar.ballRadius || gameVar.y + gameVar.dy < gameVar.ballRadius)
	{
		gameVar.dy = -gameVar.dy;
		directChanged = true;
	}
	if (gameVar.playerIdx == 1)
	{
		if(gameVar.x - gameVar.ballRadius < gameVar.playerPaddleWidth &&
			gameVar.y > gameVar.playerPaddleY &&
			gameVar.y < gameVar.playerPaddleY + gameVar.playerPaddleHeight)
		{
			if (gameVar.x > gameVar.playerPaddleWidth)
			{
				return;
			}
			gameVar.x = gameVar.playerPaddleWidth + gameVar.ballRadius;
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
		if (gameVar.x + gameVar.ballRadius > gameVar.canvasW - gameVar.player2PaddleWidth &&
			gameVar.y > gameVar.player2PaddleY &&
			gameVar.y < gameVar.player2PaddleY + gameVar.player2PaddleHeight)
		{
			if (gameVar.x < gameVar.canvasW - gameVar.player2PaddleWidth)
			{
				return ;
			}
			gameVar.x = gameVar.canvasW - gameVar.player2PaddleWidth - gameVar.ballRadius;
			let hitpos = (gameVar.y - gameVar.player2PaddleY) / gameVar.player2PaddleHeight;
			let angle = (hitpos - 0.5) * Math.PI / 2;
			gameVar.dx = -(Math.cos(angle) * Math.abs(gameVar.dx) + 1);
			gameVar.dy = (Math.sin(angle) * Math.abs(gameVar.dy) - gameVar.init_dy);
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

export function manageServer()
{
	if (gameVar.currenServer == 'player')
	{
		gameVar.x = gameVar.playerPaddleWidth + gameVar.ballRadius;
		gameVar.y = gameVar.playerPaddleY + gameVar.playerPaddleHeight / 2;
	}
	else if (gameVar.currenServer == 'player2')
	{
		gameVar.x = gameVar.canvasW - gameVar.player2PaddleWidth - gameVar.ballRadius;
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


// export function checkCollisionWithWalls()
// {
//     const map = gameVar.maps['customMap1'];
//     if (map) 
// 	{
//         map.forEach(wall =>
// 		{
//             if (gameVar.x + gameVar.ballRadius > wall.x &&
// 				gameVar.x - gameVar.ballRadius < wall.x + wall.width &&
//                 gameVar.y + gameVar.ballRadius > wall.y &&
// 				gameVar.y - gameVar.ballRadius < wall.y + wall.height)
// 			{
				
//                 if (gameVar.x + gameVar.ballRadius > wall.x &&
// 					gameVar.x - gameVar.ballRadius < wall.x + wall.height &&
// 					wall.sta == 1)
// 				{
//                     gameVar.dx = -gameVar.dx;
// 					wall.sta = 0;
//                 }
//                 if (gameVar.y + gameVar.ballRadius > wall.y &&
// 					gameVar.y - gameVar.ballRadius < wall.y + wall.width &&
// 					wall.sta == 1)
// 				{
//                     gameVar.dy = -gameVar.dy;
// 					wall.sta = 0;
//                 }
//             }
//         });
//     }
// }
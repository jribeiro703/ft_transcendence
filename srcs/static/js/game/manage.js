import gameVar from "./var.js";
import { PADDLE_SPEED } from "./const.js";
import { resetBall } from "./reset.js";
import { sendBallData, sendPaddleData } from "./network.js";
import { collisionFoot } from "./foot.js";
import { collisionPaddleAi, ballOut } from "./collision.js";
import { collisionTennis } from "./tennis.js";
import { checkball } from "./check.js";
import { initControl } from "./init.js";

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
	console.log("collision paddle p1");
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

	console.log("collision paddle p2");
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
		console.log("collision Wall");
		gameVar.dy = -gameVar.dy;
		return (true);
	}
	else if (gameVar.currentLevel === 'football')
	{
		console.log("collision Wallfoot");
		// gameVar.dy = -gameVar.dy;
		if (collisionFoot())
			return (true);
	}
	else if (gameVar.currentLevel === 'tennis')
	{
		console.log("collision Walltennis");
		// gameVar.dy = -gameVar.dy;
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

// export function manageServerLive()
// {
// 	if (gameVar.currentServer == 'player')
// 	{
// 		gameVar.x = gameVar.playerPaddleWidth + gameVar.ballRadius;
// 		gameVar.y = gameVar.playerPaddleY + gameVar.playerPaddleHeight / 2;
// 	}
// 	else if (gameVar.currentServer == 'player2')
// 	{
// 		gameVar.x = gameVar.canvasW - gameVar.player2PaddleWidth - gameVar.ballRadius;
// 		gameVar.y = gameVar.player2PaddleY + gameVar.player2PaddleHeight / 2;
// 	}
// 	sendBallData(gameVar.x, gameVar.y, gameVar.gameSocket);
// }

export function manageMoveLive()
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
		if (gameVar.player2UpPressed && gameVar.player2PaddleY > 0)
		{
			gameVar.player2PaddleY -= PADDLE_SPEED;
		} 
		else if (gameVar.player2DownPressed && gameVar.player2PaddleY < gameVar.canvasH - gameVar.player2PaddleHeight)
		{
			gameVar.player2PaddleY += PADDLE_SPEED;
		}
	}
}

export function manageServer()
{
	console.log("manageServer, curr : ", gameVar.currentServer);
	if (gameVar.currentServer == 'player')
	{
		gameVar.x = gameVar.playerPaddleWidth + gameVar.ballRadius;
		gameVar.y = gameVar.playerPaddleY + gameVar.playerPaddleHeight / 2;
	}
	if (gameVar.currentServer === 'player2')
	{
		gameVar.x = gameVar.canvasW - gameVar.player2PaddleWidth - gameVar.ballRadius;
		gameVar.y = gameVar.player2PaddleY + gameVar.player2PaddleHeight / 2;
	}
	else if (gameVar.currentServer === 'ai')
	{
		gameVar.x = gameVar.canvasW - gameVar.aiPaddleWidth - gameVar.ballRadius;
		gameVar.y = gameVar.aiPaddleY + gameVar.aiPaddleHeight / 2;
	}
	if (gameVar.liveMatch)
		sendBallData(gameVar.x, gameVar.y, gameVar.gameSocket);
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
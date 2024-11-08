import gameVar from "./var.js";
import { PADDLE_SPEED } from './const.js';
import { sendBallData } from "./network.js";

// export function manageMove(isFirstPlayer)
// {
// 	if (isFirstPlayer) {
// 		if (gameVar.playerUpPressed && gameVar.playerPaddleX > 0) {
// 			gameVar.playerPaddleX -= PADDLE_SPEED;
// 		} else if (gameVar.playerDownPressed && gameVar.playerPaddleX < gameVar.canvasH - gameVar.playerPaddleHeight) {
// 			gameVar.playerPaddleX += PADDLE_SPEED;
// 		}
// 	} else {
// 		if (gameVar.playerUpPressed && gameVar.aiPaddleX > 0) {
// 			gameVar.aiPaddleX -= PADDLE_SPEED;
// 		} else if (gameVar.playerDownPressed && gameVar.aiPaddleX < gameVar.canvasH - gameVar.aiPaddleHeight) {
// 			gameVar.aiPaddleX += PADDLE_SPEED;
// 		}
// 	}
// }

export function keyDownHandler(e, isFirstPlayer)
{
	if (e.key == "ArrowUp" || e.key == 'w')
	{
		gameVar.playerUpPressed = true;
	} 
	else if (e.key == "ArrowDown" || e.key == 's')
	{
		gameVar.playerDownPressed = true;
	}
}

export function keyUpHandler(e, isFirstPlayer)
{
	if (e.key == "ArrowUp" || e.key == 'w')
	{
		gameVar.playerUpPressed = false;
	}
	else if (e.key == "ArrowDown" || e.key == 's')
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
		// sendBallData(gameVar.x, gameVar.y, gameVar.dx, gameVar.dy, gameVar.gameSocket);
	}
}
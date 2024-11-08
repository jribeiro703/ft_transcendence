import gameVar from "./var.js";
import { INIT_DX, INIT_DY, PADDLE_SPEED } from './const.js';

export function manageMove(isFirstPlayer)
{
	if (isFirstPlayer) {
		if (gameVar.playerUpPressed && gameVar.playerPaddleX > 0) {
			gameVar.playerPaddleX -= PADDLE_SPEED;
		} else if (gameVar.playerDownPressed && gameVar.playerPaddleX < gameVar.canvasH - gameVar.playerPaddleHeight) {
			gameVar.playerPaddleX += PADDLE_SPEED;
		}
	} else {
		if (gameVar.playerUpPressed && gameVar.aiPaddleX > 0) {
			gameVar.aiPaddleX -= PADDLE_SPEED;
		} else if (gameVar.playerDownPressed && gameVar.aiPaddleX < gameVar.canvasH - gameVar.aiPaddleHeight) {
			gameVar.aiPaddleX += PADDLE_SPEED;
		}
	}
}

export function keyDownHandler(e, isFirstPlayer)
{
	if (e.key == "ArrowUp") {
		gameVar.playerUpPressed = true;
	} else if (e.key == "ArrowDown") {
		gameVar.playerDownPressed = true;
	}
}

export function keyUpHandler(e, isFirstPlayer)
{
	if (e.key == "ArrowUp") {
		gameVar.playerUpPressed = false;
	} else if (e.key == "ArrowDown") {
		gameVar.playerDownPressed = false;
	}
}

export function startBall(e)
{
	if (e.code == "Space" && !gameVar.matchOver && !gameVar.aiServe && !gameVar.gameStart) {
		gameVar.gameStart = true;
		gameVar.dx = gameVar.init_dx;
		gameVar.dy = (Math.random() < 0.5 ? gameVar.init_dy : -gameVar.init_dy);
	}
}
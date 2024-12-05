import gameVar from "./var.js";
import { PADDLE_SPEED } from "./const.js";
import { sendPaddleData } from "./network.js";

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
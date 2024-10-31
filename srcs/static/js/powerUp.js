import gameVar from "./var.js";
import { POWER_UP_SIZE, POWER_UP_DURATION, BALL_RADIUS} from "./const.js";


export function createPowerUP()
{
	gameVar.powerUpX = Math.random() * (gameVar.canvasW - 2 * 75) + 75;
	gameVar.powerUpY = Math.random() * (gameVar.canvasH -2 * 75) + 75;
}

export function collectPowerUp()
{
	if (!gameVar.powerUpActive)
	{
		if (gameVar.x < gameVar.powerUpX + POWER_UP_SIZE && gameVar.x + BALL_RADIUS > gameVar.powerUpX &&
		gameVar.y < gameVar.powerUpY + POWER_UP_SIZE && gameVar.y + BALL_RADIUS > gameVar.powerUpY) 
		{
			gameVar.playerPaddleHeight *= 1.3;
			gameVar.powerUpActive = true;

			setTimeout(() => 
			{
				gameVar.playerPaddleHeight /= 1.3;
			}, POWER_UP_DURATION);

			setTimeout(() =>
			{
				gameVar.powerUpActive = false;	
				createPowerUP();
			}, POWER_UP_DURATION + 3000);
		}
	}
}


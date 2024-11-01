import gameVar from "./var.js";
import { POWER_UP_SIZE, POWER_UP_DURATION, BALL_RADIUS, BUFFER_COLLISION} from "./const.js";





const img = new Image();


img.onload = function()
{
    // gameVar.ctx.drawImage(img, gameVar.powerUpX - 15, gameVar.powerUpY + 40, 30, 30);
	console.log("load img");
	drawPowerUp();
};


export function createPowerUp()
{
	console.log("createPU");
	// gameVar.powerUpX = Math.random() * (gameVar.canvasW - 2 * 75) + 75;
	// gameVar.powerUpY = Math.random() * (gameVar.canvasH -2 * 75) + 75;
	RandomPowerUp();
	img.src = gameVar.currentPowerUp.image;
	console.log("img create src: ", img.src);
	// drawPowerUp();
	gameVar.powerUpX = Math.random() * (gameVar.canvasW - 2 * 75) + 75;
	gameVar.powerUpY = Math.random() * (gameVar.canvasH -2 * 75) + 75;

}

export function RandomPowerUp()
{
	const randomIndex = Math.floor(Math.random() * gameVar.powerUps.length);
	gameVar.currentPowerUp = gameVar.powerUps[randomIndex];
	// console.log("img : ", gameVar.powerUps[randomIndex].image);
}

export function drawPowerUp()
{
	if (!gameVar.powerUpActive)
	{
		if (gameVar.ctx)
		{
			const imgWidth = 50;
			const imgHeight = 50;

			gameVar.ctx.drawImage(img, gameVar.powerUpX - imgWidth / 2, gameVar.powerUpY - imgHeight / 2, imgWidth, imgHeight);
		}
		else
			console.log("errror");
	}
}
export function collectPowerUp()
{
	if (!gameVar.powerUpActive)
	{
		if (gameVar.x < gameVar.powerUpX + POWER_UP_SIZE + BUFFER_COLLISION &&
			gameVar.x + BALL_RADIUS > gameVar.powerUpX - BUFFER_COLLISION &&
			gameVar.y < gameVar.powerUpY + POWER_UP_SIZE + BUFFER_COLLISION &&
			gameVar.y + BALL_RADIUS > gameVar.powerUpY - BUFFER_COLLISION) 
		{
			checkPowerUp();

		}
	}
}

export function newPowerUp()
{
	setTimeout(() =>
	{
		gameVar.powerUpActive = false;	
		createPowerUp();
	}, POWER_UP_DURATION + 3000);
}

export function checkPowerUp()
{
	console.log("checkpu");
	if (gameVar.currentPowerUp?.type == "slow")
	{
		console.log("slow");	
		gameVar.dx /= 2;
		gameVar.dy /= 2;
		gameVar.powerUpActive = true;

		setTimeout(() => 
		{
			gameVar.dx *= 2;
			gameVar.dy *= 2;
		}, POWER_UP_DURATION);
		newPowerUp();
	}
	if (gameVar.currentPowerUp?.type == "speed")
	{
		console.log("speed");	
		gameVar.dx *= 2;
		gameVar.dy *= 2;
		gameVar.powerUpActive = true;

		setTimeout(() => 
		{
			gameVar.dx /= 2;
			gameVar.dy /= 2;
		}, POWER_UP_DURATION);
		newPowerUp();
	}
	if (gameVar.currentPowerUp?.type == "sizeP")
	{
		console.log("sizeP");	
		gameVar.playerPaddleHeight *= 1.3;
		gameVar.powerUpActive = true;

		setTimeout(() => 
		{
			gameVar.playerPaddleHeight /= 1.3;
		}, POWER_UP_DURATION);	
		newPowerUp();
	}
	if (gameVar.currentPowerUp?.type == "sizeM")
	{
		console.log("sizeM");	
		gameVar.playerPaddleHeight /= 1.3;
		gameVar.powerUpActive = true;

		setTimeout(() => 
		{
			gameVar.playerPaddleHeight *= 1.3;
		}, POWER_UP_DURATION);
		newPowerUp();
	}
	if (gameVar.currentPowerUp?.type == "invincible")
	{
		console.log("invicible");	
		gameVar.playerPaddleHeight *= 5;
		gameVar.powerUpActive = true;

		setTimeout(() => 
		{
			gameVar.playerPaddleHeight /= 5;
		}, POWER_UP_DURATION);
		newPowerUp();
	}
}
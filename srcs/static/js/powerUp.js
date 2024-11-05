import gameVar from "./var.js";
import { POWER_UP_SIZE, POWER_UP_DURATION, BALL_RADIUS, BUFFER_COLLISION} from "./const.js";

const img = new Image();

img.onload = function()
{
	drawPowerUp();
};

export function updatePowerUpSelection(selected)
{
	gameVar.powerUpEnable = selected;

	if (selected)
		console.log("Power-Ups activés !");
	else 
		console.log("Power-Ups désactivés !");
}
	
export function createPowerUp()
{
	RandomPowerUp();
	img.src = gameVar.currentPowerUp.image;
	gameVar.powerUpX = Math.random() * (gameVar.canvasW - 2 * 75) + 75;
	gameVar.powerUpY = Math.random() * (gameVar.canvasH -2 * 75) + 75;
}

export function RandomPowerUp()
{
	const randomIndex = Math.floor(Math.random() * gameVar.powerUps.length);
	gameVar.currentPowerUp = gameVar.powerUps[randomIndex];
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
			console.log("errror drawPU");
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
	if (gameVar.currentPowerUp?.type == "slow")
		puSlow();
	if (gameVar.currentPowerUp?.type == "speed")
		puSpeed();
	if (gameVar.currentPowerUp?.type == "sizeP")
		puSizeP();
	if (gameVar.currentPowerUp?.type == "sizeM")
		puSizeM();
	if (gameVar.currentPowerUp?.type == "invincible")
		puInvicible();
}


function puSpeed()
{
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

function puSlow()
{
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

function puSizeP()
{
	if (gameVar.lastTouch == 'player')
	{
		gameVar.playerPaddleHeight *= 1.3;
		gameVar.powerUpActive = true;
		setTimeout(() => 
		{
				gameVar.playerPaddleHeight /= 1.3;
		}, POWER_UP_DURATION);	
		newPowerUp();
	}
	else
	{
		gameVar.aiPaddleHeight *= 1.3;
		gameVar.powerUpActive = true;
		setTimeout(() => 
		{
				gameVar.aiPaddleHeight /= 1.3;
		}, POWER_UP_DURATION);	
		newPowerUp();
	}
}

function puSizeM()
{
	if (gameVar.lastTouch == 'player')
	{
		gameVar.playerPaddleHeight /= 1.3;
		gameVar.powerUpActive = true;
		setTimeout(() => 
		{
				gameVar.playerPaddleHeight *= 1.3;
		}, POWER_UP_DURATION);
		newPowerUp();
	}
	else
	{
		gameVar.aiPaddleHeight /= 1.3;
		gameVar.powerUpActive = true;
		setTimeout(() => 
		{
				gameVar.aiPaddleHeight *= 1.3;
		}, POWER_UP_DURATION);
		newPowerUp();
	}
}

function puInvicible()
{
	if (gameVar.lastTouch == 'player')
	{
		gameVar.playerPaddleHeight *= 5;
		gameVar.powerUpActive = true;
		setTimeout(() => 
		{
				gameVar.playerPaddleHeight /= 5;
		}, POWER_UP_DURATION);
		newPowerUp();
	}
	else
	{
		gameVar.aiPaddleHeight *= 5;
		gameVar.powerUpActive = true;
		setTimeout(() => 
		{
				gameVar.aiPaddleHeight /= 5;
		}, POWER_UP_DURATION);
		newPowerUp();	
	}
}
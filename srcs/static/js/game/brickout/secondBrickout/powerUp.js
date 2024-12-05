import brickVar2 from "./var.js";

const img = new Image();

img.onerror = () => 
{
    console.error('Error loading power-up image:', img.src);
};

img.onload = function()
{
	drawPowerUpB();
};

export function resetPowerUpB()
{
    brickVar2.powerUpActive = false;
	if (brickVar2.currentPowerUp)
		brickVar2.currentPowerUp = null;
	createPowerUpB();
}

export function createPowerUpB()
{
	if (!brickVar2.powerUpOnscreen)
	{
		brickVar2.powerUpX = Math.random() * (brickVar2.canvasW);
		brickVar2.powerUpY = brickVar2.brickOffsetTop;

		RandomPowerUpB();
		img.src = brickVar2.currentPowerUp.image;
		brickVar2.powerUpOnscreen = true;
	}
}

export function RandomPowerUpB()
{
	const randomIndex = Math.floor(Math.random() * brickVar2.powerUps.length);
	brickVar2.currentPowerUp = brickVar2.powerUps[randomIndex];
}

export function drawPowerUpB()
{
	if (brickVar2.powerUpEnable)
    {
		if (!brickVar2.powerUpActive && brickVar2.ctx)
		{
			if (img.complete && img.naturalHeight !== 0)
			{
				const imgWidth = 50;
				const imgHeight = 50;
				try
				{
					brickVar2.ctx.drawImage(img, 
						brickVar2.powerUpX - imgWidth / 2, 
						brickVar2.powerUpY - imgHeight / 2, 
						imgWidth, 
						imgHeight
					);
				}
				catch (error)
				{
					console.error('Error drawing power-up:', error);
				}
			}
			else
			{
				brickVar2.ctx.beginPath();
				brickVar2.ctx.arc(brickVar2.powerUpX, brickVar2.powerUpY, 20, 0, Math.PI * 2);
				brickVar2.ctx.fillStyle = '#FF0000';
				brickVar2.ctx.fill();
				brickVar2.ctx.closePath();
			}
		}
	}
}

export function collectPowerUpB()
{
	if (brickVar2.powerUpEnable)
	{
		if (!brickVar2.powerUpActive && !brickVar2.finishLevel && brickVar2.powerUpOnscreen)
		{
			const powerUpCenterX = brickVar2.powerUpX + (brickVar2.POWER_UP_SIZE / 2);
			const powerUpCenterY = brickVar2.powerUpY + (brickVar2.POWER_UP_SIZE / 2);
			const paddleTop = brickVar2.canvasH - brickVar2.paddleHeight;
			const paddleBottom = brickVar2.canvasH;
			const paddleLeft = brickVar2.paddleX;
			const paddleRight = brickVar2.paddleX + brickVar2.paddleWidth;
			const tolerance = 10;
			
			if (powerUpCenterX >= paddleLeft - tolerance &&
				powerUpCenterX <= paddleRight + tolerance &&
				powerUpCenterY >= paddleTop - tolerance &&
				powerUpCenterY <= paddleBottom + tolerance)
			{
				console.log("PowerUp collected!");
				brickVar2.powerUpOnscreen = false;
				brickVar2.powerUpX = -100;
				checkPowerUpB();
				brickVar2.powerUpActive = true;
			}
		}
	}
}

export function newPowerUpB()
{
	setTimeout(() =>
	{
		createPowerUpB();
	}, brickVar2.POWER_UP_DURATION + 3000);
}

export function checkPowerUpB()
{
	if (brickVar2.currentPowerUp?.type === "slow")
		puSlowB();
	else if (brickVar2.currentPowerUp?.type === "speed")
		puSpeedB();
	else if (brickVar2.currentPowerUp?.type === "sizeP")
		puSizePB();
	else if (brickVar2.currentPowerUp?.type === "sizeM")
		puSizeMB();
	else if (brickVar2.currentPowerUp?.type === "invincible")
		puInvicibleB();
	else if (brickVar2.currentPowerUp?.type === 'extraLife')
		puExtraLife();
}

function puExtraLife()
{
	brickVar2.lives++;
	brickVar2.powerUpActive = false;
	newPowerUpB();
}

function puSpeedB()
{
	console.log("on accelere");
	const originSpeed = Math.sqrt(brickVar2.dx * brickVar2.dx + brickVar2.dy * brickVar2.dy);

	brickVar2.dx *= 2;
	brickVar2.dy *= 2;

	setTimeout(() => 
	{
		const direction = Math.atan2(brickVar2.dy, brickVar2.dx);

		brickVar2.dx = originSpeed * Math.cos(direction);
		brickVar2.dy = originSpeed * Math.sin(direction);
		brickVar2.powerUpActive = false;

	}, brickVar2.POWER_UP_DURATION);
	newPowerUpB();
}

function puSlowB()
{
	const originSpeed = Math.sqrt(brickVar2.dx * brickVar2.dx + brickVar2.dy * brickVar2.dy);
	brickVar2.dx /= 2;
	brickVar2.dy /= 2;
	setTimeout(() => 
	{
		const direction = Math.atan2(brickVar2.dy, brickVar2.dx);

		brickVar2.dx = originSpeed * Math.cos(direction);
		brickVar2.dy = originSpeed * Math.sin(direction);
		brickVar2.powerUpActive = false;

	}, brickVar2.POWER_UP_DURATION);
	newPowerUpB();
}

function puSizePB()
{
	brickVar2.paddleWidth *= 2;
	setTimeout(() => 
	{
		brickVar2.paddleWidth /= 2;

		brickVar2.powerUpActive = false;

	}, brickVar2.POWER_UP_DURATION);	
	newPowerUpB();
}

function puSizeMB()
{
	brickVar2.paddleWidth /= 2;
	setTimeout(() => 
	{
		brickVar2.paddleWidth *= 2;
		brickVar2.powerUpActive = false;

	}, brickVar2.POWER_UP_DURATION);
	newPowerUpB();
}

function puInvicibleB()
{
	brickVar2.paddleWidth *= 6;
	brickVar2.powerUpActive = true;
	setTimeout(() => 
	{
		brickVar2.paddleWidth /= 6;
		brickVar2.powerUpActive = false;

	}, brickVar2.POWER_UP_DURATION);
	newPowerUpB();
}
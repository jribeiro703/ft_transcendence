import brickVar from "./var.js";

const img = new Image();

img.onerror = () => 
{
    console.error('Error loading power-up image:', img.src);
};

img.onload = function()
{
	drawPowerUpB();
};

export function updatePowerUpSelectionB(selected, def)
{
	brickVar.powerUpEnable = selected;
	if (!def)
		brickVar.checkPu = true;
}

export function updatePowerUpB()
{
	if (brickVar.powerUpEnable)
    {
		if (brickVar.powerUpOnscreen)
		{
			brickVar.powerUpY += brickVar.powerUpSpeed;
			
			if (brickVar.powerUpY > brickVar.canvasH)
			{
				brickVar.powerUpOnscreen = false;
				createPowerUpB();
			}
		}
	}
}

export function resetPowerUpB()
{
    brickVar.powerUpActive = false;
	if (brickVar.currentPowerUp)
		brickVar.currentPowerUp = null;
	createPowerUpB();
}

export function createPowerUpB()
{
	if (!brickVar.powerUpOnscreen)
	{
		brickVar.powerUpX = Math.random() * (brickVar.canvasW);
		brickVar.powerUpY = brickVar.brickOffsetTop;

		RandomPowerUpB();
		img.src = brickVar.currentPowerUp.image;
		brickVar.powerUpOnscreen = true;
	}
}

export function RandomPowerUpB()
{
	const randomIndex = Math.floor(Math.random() * brickVar.powerUps.length);
	brickVar.currentPowerUp = brickVar.powerUps[randomIndex];
}

export function drawPowerUpB()
{
	if (brickVar.powerUpEnable)
    {
		if (!brickVar.powerUpActive && brickVar.ctx)
		{
			if (img.complete && img.naturalHeight !== 0)
			{
				const imgWidth = 50;
				const imgHeight = 50;
				try
				{
					brickVar.ctx.drawImage(img, 
						brickVar.powerUpX - imgWidth / 2, 
						brickVar.powerUpY - imgHeight / 2, 
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
				brickVar.ctx.beginPath();
				brickVar.ctx.arc(brickVar.powerUpX, brickVar.powerUpY, 20, 0, Math.PI * 2);
				brickVar.ctx.fillStyle = '#FF0000';
				brickVar.ctx.fill();
				brickVar.ctx.closePath();
			}
		}
	}
}

export function collectPowerUpB()
{
	if (brickVar.powerUpEnable)
	{
		if (!brickVar.powerUpActive && !brickVar.finishLevel && brickVar.powerUpOnscreen)
		{
			const powerUpCenterX = brickVar.powerUpX + (brickVar.POWER_UP_SIZE / 2);
			const powerUpCenterY = brickVar.powerUpY + (brickVar.POWER_UP_SIZE / 2);
			const paddleTop = brickVar.canvasH - brickVar.paddleHeight;
			const paddleBottom = brickVar.canvasH;
			const paddleLeft = brickVar.paddleX;
			const paddleRight = brickVar.paddleX + brickVar.paddleWidth;
			const tolerance = 10;
			
			if (powerUpCenterX >= paddleLeft - tolerance &&
				powerUpCenterX <= paddleRight + tolerance &&
				powerUpCenterY >= paddleTop - tolerance &&
				powerUpCenterY <= paddleBottom + tolerance)
			{
				brickVar.powerUpOnscreen = false;
				brickVar.powerUpX = -100;
				checkPowerUpB();
				brickVar.powerUpActive = true;
			}
		}
	}
}

export function newPowerUpB()
{
	setTimeout(() =>
	{
		createPowerUpB();
	}, brickVar.POWER_UP_DURATION + 3000);
}

export function checkPowerUpB()
{
	if (brickVar.currentPowerUp?.type === "slow")
		puSlowB();
	else if (brickVar.currentPowerUp?.type === "speed")
		puSpeedB();
	else if (brickVar.currentPowerUp?.type === "sizeP")
		puSizePB();
	else if (brickVar.currentPowerUp?.type === "sizeM")
		puSizeMB();
	else if (brickVar.currentPowerUp?.type === "invincible")
		puInvicibleB();
	else if (brickVar.currentPowerUp?.type === "extraLife")
		puExtraLife();
}

function puExtraLife()
{
	brickVar.lives++;
	brickVar.powerUpActive = false;
	newPowerUpB();
}

function puSpeedB()
{
	const originSpeed = Math.sqrt(brickVar.dx * brickVar.dx + brickVar.dy * brickVar.dy);

	brickVar.dx *= 2;
	brickVar.dy *= 2;

	setTimeout(() => 
	{
		const direction = Math.atan2(brickVar.dy, brickVar.dx);

		brickVar.dx = originSpeed * Math.cos(direction);
		brickVar.dy = originSpeed * Math.sin(direction);
		brickVar.powerUpActive = false;

	}, brickVar.POWER_UP_DURATION);
	newPowerUpB();
}

function puSlowB()
{
	const originSpeed = Math.sqrt(brickVar.dx * brickVar.dx + brickVar.dy * brickVar.dy);
	brickVar.dx /= 2;
	brickVar.dy /= 2;
	setTimeout(() => 
	{
		const direction = Math.atan2(brickVar.dy, brickVar.dx);

		brickVar.dx = originSpeed * Math.cos(direction);
		brickVar.dy = originSpeed * Math.sin(direction);
		brickVar.powerUpActive = false;

	}, brickVar.POWER_UP_DURATION);
	newPowerUpB();
}

function puSizePB()
{
	brickVar.paddleWidth *= 2;
	setTimeout(() => 
	{
		brickVar.paddleWidth /= 2;

		brickVar.powerUpActive = false;

	}, brickVar.POWER_UP_DURATION);	
	newPowerUpB();
}

function puSizeMB()
{
	brickVar.paddleWidth /= 2;
	setTimeout(() => 
	{
		brickVar.paddleWidth *= 2;
		brickVar.powerUpActive = false;

	}, brickVar.POWER_UP_DURATION);
	newPowerUpB();
}

function puInvicibleB()
{
	brickVar.paddleWidth *= 6;
	brickVar.powerUpActive = true;
	setTimeout(() => 
	{
		brickVar.paddleWidth /= 6;
		brickVar.powerUpActive = false;

	}, brickVar.POWER_UP_DURATION);
	newPowerUpB();
}
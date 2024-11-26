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

export function updatePowerUpSelectionB(selected)
{
	brickVar.powerUpEnable = selected;

	if (selected)
		console.log("Power-Ups activés !");
	else 
		console.log("Power-Ups désactivés !");
}

export function updatePowerUpB()
{
	if (brickVar.gameStart)
    {
		if (!brickVar.powerUpActive)
		{
			brickVar.powerUpY += brickVar.powerUpSpeed;
			
			if (brickVar.powerUpY > brickVar.canvasH)
				createPowerUpB();
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
	RandomPowerUpB();
	img.src = brickVar.currentPowerUp.image;
	brickVar.powerUpX = Math.random() * (brickVar.canvasW - 2 * 75) + 75;
	brickVar.powerUpY = brickVar.brickOffsetTop;
}

export function RandomPowerUpB()
{
	const randomIndex = Math.floor(Math.random() * brickVar.powerUps.length);
	brickVar.currentPowerUp = brickVar.powerUps[randomIndex];
}

// export function drawPowerUpB()
// {
// 	if (!brickVar.powerUpActive)
// 	{
// 		if (brickVar.ctx)
// 		{
// 			const imgWidth = 40;
// 			const imgHeight = 40;
// 			brickVar.ctx.drawImage(img, brickVar.powerUpX - imgWidth / 2, brickVar.powerUpY - imgHeight / 2, imgWidth, imgHeight);
// 		}
// 		else
// 			console.log("errror drawPU");
// 	}
// }

export function drawPowerUpB()
{
    if (!brickVar.powerUpActive && brickVar.ctx)
	{
        if (img.complete && img.naturalHeight !== 0)
		{
            const imgWidth = 40;
            const imgHeight = 40;
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
            // Fallback en attendant le chargement de l'image
            brickVar.ctx.beginPath();
            brickVar.ctx.arc(brickVar.powerUpX, brickVar.powerUpY, 20, 0, Math.PI * 2);
            brickVar.ctx.fillStyle = '#FF0000';
            brickVar.ctx.fill();
            brickVar.ctx.closePath();
        }
    }
}

export function collectPowerUpB()
{
	if (!brickVar.powerUpActive && !brickVar.finishLevel)
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
            console.log("PowerUp collected!");
            brickVar.powerUpActive = true;
            checkPowerUpB();
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
	else if (brickVar.currentPowerUp?.type === 'bbsp')
		puBbspB();
}

function puBbspB()
{
	brickVar.ballRadius *= 3;
	brickVar.paddleWidth /= 3;
	brickVar.powerUpActive = true;

	setTimeout(() => 
	{
		brickVar.ballRadius /= 3;
		brickVar.paddleWidth *= 3;
		brickVar.powerUpActive = false;

	}, brickVar.POWER_UP_DURATION);
	newPowerUpB();
	
}

function puSpeedB()
{
	console.log("on accelere");
	brickVar.dx *= 2;
	brickVar.dy *= 2;

	brickVar.powerUpActive = true;
	setTimeout(() => 
	{
		brickVar.dx /= 2;
		brickVar.dy /= 2;
		brickVar.powerUpActive = false;

	}, brickVar.POWER_UP_DURATION);
	newPowerUpB();
}

function puSlowB()
{
	brickVar.dx /= 2;
	brickVar.dy /= 2;

	brickVar.powerUpActive = true;
	setTimeout(() => 
	{
		brickVar.dx *= 2;
		brickVar.dy *= 2;
		brickVar.powerUpActive = false;

	}, brickVar.POWER_UP_DURATION);
	newPowerUpB();
}

function puSizePB()
{
	brickVar.paddleWidth *= 1.4;
	brickVar.powerUpActive = true;
	setTimeout(() => 
	{
		brickVar.paddleWidth /= 1.4;

		brickVar.powerUpActive = false;

	}, brickVar.POWER_UP_DURATION);	
	newPowerUpB();
}

function puSizeMB()
{
	brickVar.paddleWidth /= 1.4;
	brickVar.powerUpActive = true;
	setTimeout(() => 
	{
		brickVar.paddleWidth *= 1.4;
		brickVar.powerUpActive = false;

	}, brickVar.POWER_UP_DURATION);
	newPowerUpB();
}

function puInvicibleB()
{
	brickVar.paddleWidth *= 5;
	brickVar.powerUpActive = true;
	setTimeout(() => 
	{
		brickVar.paddleWidth /= 5;
		brickVar.powerUpActive = false;

	}, brickVar.POWER_UP_DURATION);
	newPowerUpB();
}
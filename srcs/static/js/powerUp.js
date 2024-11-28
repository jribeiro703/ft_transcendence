import gameVar from "./var.js";
import { POWER_UP_DURATION, BUFFER_COLLISION} from "./const.js";
import { showGameSelectionView } from "./gameView.js";

const img1 = new Image();
const img2 = new Image();

img1.onload = function()
{
	drawPowerUp();
};

img2.onload = function()
{
	drawPowerUp();
}

export function drawPowerUp()
{
	if (gameVar.powerUpEnable)
	{
		if (!gameVar.powerUp1Active && gameVar.ctx)
		{
			console.log("draw pu active is false")
			const imgWidth = 50;
			const imgHeight = 50;
			
			if (img1.complete && gameVar.currentPowerUp1)
			{
				gameVar.ctx.drawImage(img1, 
					gameVar.powerUpX1 - imgWidth / 2, 
					gameVar.powerUpY1 - imgHeight / 2, 
					imgWidth, 
					imgHeight
				);
			}
			else
			{
				gameVar.ctx.beginPath();
				gameVar.ctx.arc(gameVar.powerUpX1, gameVar.powerUpY1, 25, 0, Math.PI * 2);
				gameVar.ctx.fillStyle = '#FF0000';
				gameVar.ctx.fill();
				gameVar.ctx.closePath();
			}
		}
		if (!gameVar.powerUp2Active && gameVar.ctx)
		{
			const imgWidth = 50;
			const imgHeight = 50;
			
			if (img2.complete && gameVar.currentPowerUp2)
			{
				gameVar.ctx.drawImage(img2, 
					gameVar.powerUpX2 - imgWidth / 2, 
					gameVar.powerUpY2 - imgHeight / 2, 
					imgWidth, 
					imgHeight
				);
			}
			else
			{
				gameVar.ctx.beginPath();
				gameVar.ctx.arc(gameVar.powerUpX2, gameVar.powerUpY2, 25, 0, Math.PI * 2);
				gameVar.ctx.fillStyle = '#FF0000';
				gameVar.ctx.fill();
				gameVar.ctx.closePath();
			}
		}
	}
}

export function newPowerUp(isFirstPu, time)
{
	if (isFirstPu && gameVar.powerUp1Active || !isFirstPu && gameVar.powerUp2Active) 
	{
		console.log("pu deja active pour :", isFirstPu);
		return;
	}
	setTimeout(() =>
	{
		if(isFirstPu)
			createPowerUp1();
		else
			createPowerUp2();
	}, 3000 + time);
}

function isSpeedPowerUp(powerUp)
{
    return powerUp?.type === 'speed' || powerUp?.type === 'slow';
}

export function createPowerUp1()
{
    if (!gameVar.powerUp1OnScreen)
	{
		const availablePu = gameVar.powerUps.filter(pu =>
		{
			if (gameVar.speedPuActive || isSpeedPowerUp(gameVar.currentPowerUp2))
			{
				return pu.type !== 'spped'  && pu.type !== 'slow';
			}
			return (true);
		});
        gameVar.powerUpX1 = gameVar.canvasW / 2;
        gameVar.powerUpY1 = Math.random() * (gameVar.canvasH - 50) + 25;
        
        const randomPowerUp1 = Math.floor(Math.random() * availablePu.length);
        gameVar.currentPowerUp1 = availablePu[randomPowerUp1];
        
        img1.src = gameVar.currentPowerUp1.image;
        gameVar.powerUp1OnScreen = true;
    }
}

export function createPowerUp2()
{
    if (!gameVar.powerUp2OnScreen)
	{
		const availablePu = gameVar.powerUps.filter(pu =>
		{
			if (gameVar.speedPuActive || isSpeedPowerUp(gameVar.currentPowerUp1))
			{
				return pu.type !== 'spped'  && pu.type !== 'slow';
			}
			return (true);
		});
        gameVar.powerUpX2 = gameVar.canvasW / 2;
        gameVar.powerUpY2 = Math.random() * (gameVar.canvasH - 50) + 25;
        
        const randomPowerUp2 = Math.floor(Math.random() * availablePu.length);
        gameVar.currentPowerUp2 = availablePu[randomPowerUp2];
        
        img2.src = gameVar.currentPowerUp2.image;
        gameVar.powerUp2OnScreen = true;
    }
}

export function updatePowerUpSelection(selected)
{
	gameVar.powerUpEnable = selected;

	if (selected)
	{
		console.log("Power-Ups activés !");
		createPowerUp1();
		createPowerUp2();
	}
	else 
	{
		console.log("Power-Ups désactivés !");
	}
}
	
export function puVar()
{
	console.log("pux: ", gameVar.powerUpX);
	console.log("puy: ", gameVar.powerUpY);
}


export function collectPowerUp()
{
	if (gameVar.powerUpEnable)
	{
		if (!gameVar.powerUp1Active && gameVar.powerUp1OnScreen)
		{
			if (gameVar.powerUpX1 < gameVar.playerPaddleWidth + BUFFER_COLLISION &&
				gameVar.powerUpY1 > gameVar.playerPaddleY - BUFFER_COLLISION &&
				gameVar.powerUpY1 < gameVar.playerPaddleY + gameVar.playerPaddleHeight + BUFFER_COLLISION)
			{
				gameVar.powerUp1OnScreen = false;
				gameVar.powerUpX1 = -100;
				checkPowerUp('player', gameVar.currentPowerUp1);
				console.log("player catch :", gameVar.currentPowerUp1);
				gameVar.powerUp1Active = true;
				// newPowerUp(true, 7000);
			}
		}
		if (!gameVar.powerUp2Active && gameVar.powerUp2OnScreen)
		{
			if (gameVar.localGame)
			{
				if (gameVar.powerUpX2 > gameVar.canvasW - gameVar.player2PaddleWidth - BUFFER_COLLISION &&
					gameVar.powerUpY2 > gameVar.player2PaddleY - BUFFER_COLLISION &&
					gameVar.powerUpY2 < gameVar.player2PaddleY + gameVar.player2PaddleHeight + BUFFER_COLLISION)
				{
					gameVar.powerUp2OnScreen = false;
					gameVar.powerUpX2 = gameVar.canvasW + 100;
					checkPowerUp('player2', gameVar.currentPowerUp2);
					console.log("player2 catch :", gameVar.currentPowerUp2);
					gameVar.powerUp2Active = true;
					// newPowerUp(false, 7000);
				}
			}
			else
			{
				if (gameVar.powerUpX2 > gameVar.canvasW - gameVar.aiPaddleWidth - BUFFER_COLLISION &&
					gameVar.powerUpY2 > gameVar.aiPaddleY - BUFFER_COLLISION &&
					gameVar.powerUpY2 < gameVar.aiPaddleY + gameVar.aiPaddleHeight + BUFFER_COLLISION)
				{
					gameVar.powerUp2OnScreen = false;
					gameVar.powerUpX2 = gameVar.canvasW + 100;
					checkPowerUp('ai', gameVar.currentPowerUp2);
					gameVar.powerUp2Active = true;
					// newPowerUp(false, 7000);
				}
			}
		}
	}
}

function applyPowerUpEffect(player, effect, duration = POWER_UP_DURATION)
{
    if (player === 'player')
	{
        gameVar.powerUp1Active = true;
		if (gameVar.currentPowerUp1?.type === 'speed' || gameVar.currentPowerUp1?.type === 'slow')
			gameVar.speedPuActive = true;
        setTimeout(() =>
		{
            effect();
            gameVar.powerUp1Active = false;
			if (gameVar.currentPowerUp1?.type === 'speed' || gameVar.currentPowerUp1?.type === 'slow')
				gameVar.speedPuActive = false;
			newPowerUp(true, 0);
        }, duration);
    }
	else
	{
		if (gameVar.currentPowerUp2?.type === 'speed' || gameVar.currentPowerUp2?.type === 'slow')
			gameVar.speedPuActive = true;
        gameVar.powerUp2Active = true;
        setTimeout(() =>
		{
            effect();
            gameVar.powerUp2Active = false;
			if (gameVar.currentPowerUp2?.type === 'speed' || gameVar.currentPowerUp2?.type === 'slow')
				gameVar.speedPuActive = false;
			newPowerUp(false, 0);
        }, duration);
    }
}

function puSpeed(player)
{
    const originSpeed = Math.sqrt(gameVar.dx * gameVar.dx + gameVar.dy * gameVar.dy);

    gameVar.dx *= 2;
	gameVar.dy *= 2;
    
    applyPowerUpEffect(player, () =>
	{
		const direction = Math.atan2(gameVar.dy, gameVar.dx);

        gameVar.dx = originSpeed * Math.cos(direction);
		gameVar.dy = originSpeed * Math.sin(direction);
    });
}

function puSlow(player)
{
	const originSpeed = Math.sqrt(gameVar.dx * gameVar.dx + gameVar.dy * gameVar.dy)

    gameVar.dx /= 2;
	gameVar.dy /= 2;
    
    applyPowerUpEffect(player, () =>
	{
		const currentDirection = Math.atan2(gameVar.dy, gameVar.dx);

        gameVar.dx = originSpeed * Math.cos(currentDirection);
		gameVar.dy = originSpeed * Math.sin(currentDirection);

    });
}

function puSizeP(player)
{
    if (player === 'player')
	{
        const originalHeight = gameVar.playerPaddleHeight;
        gameVar.playerPaddleHeight *= 2;
        
        applyPowerUpEffect(player, () => {
            gameVar.playerPaddleHeight = originalHeight;
        });
    }
	else if (player == 'player2')
	{
        const originalHeight = gameVar.player2PaddleHeight;
        gameVar.player2PaddleHeight *= 2;
        
        applyPowerUpEffect(player, () => {
            gameVar.player2PaddleHeight = originalHeight;
        });
    }
	else if (player == 'ai')
	{
        const originalHeight = gameVar.aiPaddleHeight;
        gameVar.aiPaddleHeight *= 2;
        
        applyPowerUpEffect(player, () => {
            gameVar.aiPaddleHeight = originalHeight;
        });
    }
}

function puSizeM(player)
{
    if (player === 'player')
	{
        const originalHeight = gameVar.playerPaddleHeight;
        gameVar.playerPaddleHeight /= 2;
        
        applyPowerUpEffect(player, () => {
            gameVar.playerPaddleHeight = originalHeight;
        });
    } 
	else if (player === 'player2') 
	{
        const originalHeight = gameVar.player2PaddleHeight;
        gameVar.player2PaddleHeight /= 2;
        
        applyPowerUpEffect(player, () => {
            gameVar.player2PaddleHeight = originalHeight;
        });
    }
	else if (player === 'ai') 
	{
        const originalHeight = gameVar.aiPaddleHeight;
        gameVar.aiPaddleHeight /= 2;
        
        applyPowerUpEffect(player, () => {
            gameVar.aiPaddleHeight = originalHeight;
        });
    }
}

function puInvincible(player)
{
    if (player === 'player')
	{
		const originalHeight = gameVar.playerPaddleHeight;
		gameVar.playerPaddleHeight *= 4;
        applyPowerUpEffect(player, () => {
            gameVar.playerPaddleHeight = originalHeight;
        });
    }
	else if (player === 'player2')
	{
		const originalHeight = gameVar.player2PaddleHeight;
		gameVar.player2PaddleHeight *= 4;
        applyPowerUpEffect(player, () => {
            gameVar.playerPaddleHeight = originalHeight;
        });
    }
	else if (player === 'ai')
	{
		const originalHeight = gameVar.aiPaddleHeight;
		gameVar.aiPaddleHeight *= 4;
        applyPowerUpEffect(player, () => {
            gameVar.aiPaddleHeight = originalHeight;
        });
    }
}

export function checkPowerUp(player, power)
{
	if (power.type == "slow")
		puSlow(player);
	if (power.type == "speed")
		puSpeed(player);
	if (power.type == "sizeP")
		puSizeP(player);
	if (power.type == "sizeM")
		puSizeM(player);
	if (power.type == "invincible")
		puInvincible(player);
}

export function updatePowerUp()
{
	if (gameVar.powerUpEnable)
	{
		if (gameVar.powerUp1OnScreen)
		{
			gameVar.powerUpX1 -= gameVar.powerUpSpeed;
			if (gameVar.powerUpX1 < 0)
			{
				gameVar.powerUpX1 = -100;
				gameVar.powerUp1OnScreen = false;
				newPowerUp(true, 3000);
			}
		}

		if (gameVar.powerUp2OnScreen)
		{
			gameVar.powerUpX2 += gameVar.powerUpSpeed;
			if (gameVar.powerUpX2 > gameVar.canvasW)
			{
				gameVar.powerUpX2 = gameVar.canvasW + 100;
				gameVar.powerUp2OnScreen = false;
				newPowerUp(false, 3000);
			}
		}
	}
}

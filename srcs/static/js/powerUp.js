import gameVar from "./var.js";
import { POWER_UP_DURATION, BUFFER_COLLISION} from "./const.js";

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
    if (!gameVar.powerUpActive1 && gameVar.ctx)
	{
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
	if (!gameVar.powerUpActive2 && gameVar.ctx)
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

export function newPowerUp(isFirstPu, time)
{
	setTimeout(() =>
	{
		if(isFirstPu)
			createPowerUp1();
		else
			createPowerUp2();
	}, 3000 + time);
}

export function createPowerUp1()
{
    if (!gameVar.powerUp1OnScreen)
	{
        gameVar.powerUpX1 = gameVar.canvasW / 2;
        gameVar.powerUpY1 = Math.random() * (gameVar.canvasH - 50) + 25;
        
        const randomPowerUp1 = Math.floor(Math.random() * gameVar.powerUps.length);
        gameVar.currentPowerUp1 = gameVar.powerUps[randomPowerUp1];
        
        img1.src = gameVar.currentPowerUp1.image;
        gameVar.powerUp1OnScreen = true;
    }
}

export function createPowerUp2()
{
    if (!gameVar.powerUp2OnScreen)
	{
        gameVar.powerUpX2 = gameVar.canvasW / 2;
        gameVar.powerUpY2 = Math.random() * (gameVar.canvasH - 50) + 25;
        
        const randomPowerUp2 = Math.floor(Math.random() * gameVar.powerUps.length);
        gameVar.currentPowerUp2 = gameVar.powerUps[randomPowerUp2];
        
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
    if (!gameVar.powerUp1Active && gameVar.powerUp1OnScreen)
	{
        if (gameVar.powerUpX1 < gameVar.playerPaddleWidth + BUFFER_COLLISION &&
            gameVar.powerUpY1 > gameVar.playerPaddleY - BUFFER_COLLISION &&
            gameVar.powerUpY1 < gameVar.playerPaddleY + gameVar.playerPaddleHeight + BUFFER_COLLISION)
		{
            gameVar.powerUp1OnScreen = false;
			gameVar.powerUpX1 = -100;
            checkPowerUp('player', gameVar.currentPowerUp1);
            gameVar.powerUp1Active = true;
            newPowerUp(true, 7000);
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
                gameVar.powerUp2Active = true;
                newPowerUp(false, 7000);
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
                newPowerUp(false, 7000);
            }
		}
    }
}

function applyPowerUpEffect(player, effect, duration = POWER_UP_DURATION)
{
    if (player === 'player')
	{
        gameVar.powerUp1Active = true;
        setTimeout(() => {
            effect();
            gameVar.powerUp1Active = false;
        }, duration);
    }
	else
	{
        gameVar.powerUp2Active = true;
        setTimeout(() => {
            effect();
            gameVar.powerUp2Active = false;
        }, duration);
    }
}

function puSpeed(player)
{
    const originalSpeed = gameVar.dx;
    gameVar.dx *= 2;
    
    applyPowerUpEffect(player, () => {
        gameVar.dx = originalSpeed;
    });
}

function puSlow(player)
{
    const originalSpeed = gameVar.dx;
    gameVar.dx *= 0.5;
    
    applyPowerUpEffect(player, () => {
        gameVar.dx = originalSpeed;
    });
}

function puSizeP(player)
{
    if (player === 'player')
	{
        const originalHeight = gameVar.playerPaddleHeight;
        gameVar.playerPaddleHeight *= 1.5;
        
        applyPowerUpEffect(player, () => {
            gameVar.playerPaddleHeight = originalHeight;
        });
    }
	else if (player == 'player2')
	{
        const originalHeight = gameVar.player2PaddleHeight;
        gameVar.player2PaddleHeight *= 1.5;
        
        applyPowerUpEffect(player, () => {
            gameVar.player2PaddleHeight = originalHeight;
        });
    }
	else if (player == 'ai')
	{
        const originalHeight = gameVar.aiPaddleHeight;
        gameVar.aiPaddleHeight *= 1.5;
        
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
        gameVar.playerPaddleHeight *= 0.5;
        
        applyPowerUpEffect(player, () => {
            gameVar.playerPaddleHeight = originalHeight;
        });
    } 
	else if (player === 'player2') 
	{
        const originalHeight = gameVar.player2PaddleHeight;
        gameVar.player2PaddleHeight *= 0.5;
        
        applyPowerUpEffect(player, () => {
            gameVar.player2PaddleHeight = originalHeight;
        });
    }
	else if (player === 'ai') 
	{
        const originalHeight = gameVar.aiPaddleHeight;
        gameVar.aiPaddleHeight *= 0.5;
        
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
		gameVar.playerPaddleHeight *= 3;
        applyPowerUpEffect(player, () => {
            gameVar.playerPaddleHeight = originalHeight;
        });
    }
	else if (player === 'player2')
	{
		const originalHeight = gameVar.player2PaddleHeight;
		gameVar.player2PaddleHeight *= 3;
        applyPowerUpEffect(player, () => {
            gameVar.playerPaddleHeight = originalHeight;
        });
    }
	else if (player === 'ai')
	{
		const originalHeight = gameVar.aiPaddleHeight;
		gameVar.aiPaddleHeight *= 3;
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
    if (gameVar.powerUp1OnScreen)
	{
        gameVar.powerUpX1 -= gameVar.powerUpSpeed;
        if (gameVar.powerUpX1 < 0)
		{
			gameVar.powerUpX1 = -100;
            gameVar.powerUp1OnScreen = false;
            newPowerUp(true, 0);
        }
    }

    if (gameVar.powerUp2OnScreen)
	{
        gameVar.powerUpX2 += gameVar.powerUpSpeed;
        if (gameVar.powerUpX2 > gameVar.canvasW)
		{
			gameVar.powerUpX2 = gameVar.canvasW + 100;
            gameVar.powerUp2OnScreen = false;
            newPowerUp(false, 0);
        }
    }
}

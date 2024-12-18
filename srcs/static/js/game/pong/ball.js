import gameVar from "./var.js";
import { checkball } from "./check.js";

export function initializeBall()
{
	if (gameVar.currentLevel === 'classicPong')
		gameVar.ballRadius = 4;
	else	
		gameVar.ballRadius = 8;
	if (gameVar.currentServer === 'player')
	{
		gameVar.x = gameVar.playerPaddleWidth + gameVar.ballRadius; 
		gameVar.y = gameVar.playerPaddleY + gameVar.playerPaddleHeight / 2;
	}
	else if (gameVar.currentServer === 'player2') 
	{
		gameVar.x = gameVar.canvasW - gameVar.player2PaddleWidth - gameVar.ballRadius;
		gameVar.y = gameVar.player2PaddleY + gameVar.player2PaddleHeight / 2;
	}
	else if (gameVar.currentServer === 'ai')
	{	
		gameVar.x = gameVar.canvasW - gameVar.aiPaddleWidth - gameVar.ballRadius;
		gameVar.y = gameVar.aiPaddleY + gameVar.aiPaddleHeight / 2		
	}
	gameVar.dx = 0;
	gameVar.dy = 0;
	if (gameVar.liveMatch)
		checkball();
}

export function drawBall()
{
	if (gameVar.currentLevel === 'classicPong')
	{
		const squareSize = 13;
        const squareX = gameVar.x - (squareSize / 2) + 4;
        const squareY = gameVar.y - (squareSize / 2);

        gameVar.ctx.beginPath();
        gameVar.ctx.rect(squareX, squareY, squareSize, squareSize);
        gameVar.ctx.fillStyle = 'white';
        gameVar.ctx.fill();
        gameVar.ctx.closePath();
	}
	else
	{
		if (isNaN(gameVar.x) || isNaN(gameVar.y) || !isFinite(gameVar.x) || !isFinite(gameVar.y))
		{
			console.error('Invalid ball coordinates:', gameVar.x, gameVar.y);
			return;
		}
		const x = gameVar.x - gameVar.ballRadius;
		const y = gameVar.y - gameVar.ballRadius;
		const gradient = gameVar.ctx.createLinearGradient
		(
			Number(x) || 0,
			Number (y) || 0,                                         
			Number (x + gameVar.ballRadius * 2) || 0,
			Number (y + gameVar.ballRadius * 2) || 0
		);

		gradient.addColorStop(0, "#FFFFFF");
		gradient.addColorStop(0.4, "#E0E0E0");
		gradient.addColorStop(0.65, "#808080");
		gradient.addColorStop(0.8, "#404040"); 
		gradient.addColorStop(1, "#000000");   

		gameVar.ctx.beginPath();
		gameVar.ctx.arc(gameVar.x, gameVar.y, gameVar.ballRadius, 0, Math.PI*2);
		gameVar.ctx.fillStyle = gradient;
		gameVar.ctx.fill();
		gameVar.ctx.closePath();
	}
}

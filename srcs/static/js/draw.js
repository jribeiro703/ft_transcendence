import gameVar from "./var.js";
import { BALL_RADIUS, POWER_UP_SIZE } from "./const.js";
import { createPowerUp } from "./powerUp.js";

export function initDraw()
{
	drawBall();
	drawPaddles();
	drawLines();
	// createPowerUp();
}

export function drawPaddles()
{
	gameVar.ctx.beginPath();
	gameVar.ctx.rect(0, gameVar.playerPaddleX, gameVar.playerPaddleWidth, gameVar.playerPaddleHeight);
	gameVar.ctx.fillStyle = "#FF414D";
	gameVar.ctx.fill();
	gameVar.ctx.closePath();

	gameVar.ctx.beginPath();
	gameVar.ctx.rect(gameVar.canvasW - gameVar.aiPaddleWidth, gameVar.aiPaddleX, gameVar.aiPaddleWidth, gameVar.aiPaddleHeight);
	gameVar.ctx.fillStyle = "#FF414D";
	gameVar.ctx.fill();
	gameVar.ctx.closePath();
}

export function drawLines() 
{
	gameVar.ctx.strokeStyle = 'white';
	gameVar.ctx.lineWidth = 4;
	gameVar.ctx.setLineDash([12, 12]);
	gameVar.ctx.beginPath();
	gameVar.ctx.moveTo(gameVar.canvasW / 2, 0);
	gameVar.ctx.lineTo(gameVar.canvasW / 2, gameVar.canvasH);
	gameVar.ctx.stroke();
	gameVar.ctx.setLineDash([]); 

	gameVar.ctx.lineWidth = 2;
	gameVar.ctx.strokeRect(0, 0, gameVar.canvasW, gameVar.canvasH);

	gameVar.ctx.lineWidth = 2;
	gameVar.ctx.beginPath();
	gameVar.ctx.moveTo(0, gameVar.canvasH / 2); 
	gameVar.ctx.lineTo(gameVar.canvasW, gameVar.canvasH / 2);
	gameVar.ctx.stroke();
}

export function initializeBall()
{
	if (gameVar.currenServer === 'player')
	{
		gameVar.x = gameVar.playerPaddleWidth + BALL_RADIUS; 
		gameVar.y = gameVar.playerPaddleX + gameVar.playerPaddleHeight / 2;
	}
	else 
	{
		gameVar.x = gameVar.canvasw - gameVar.aiPaddleWidth - BALL_RADIUS;
		gameVar.y = gameVar.aiPaddleX + gameVar.aiPaddleHeight / 2;
	}
	gameVar.dx = 0;
	gameVar.dy = 0;
}

export function drawBall()
{
	gameVar.ctx.beginPath();
	gameVar.ctx.arc(gameVar.x, gameVar.y, BALL_RADIUS, 0, Math.PI * 2);
	gameVar.ctx.fillStyle = "#F8FF00";
	gameVar.ctx.fill();
	gameVar.ctx.closePath();
}
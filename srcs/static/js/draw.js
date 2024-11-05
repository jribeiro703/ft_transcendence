import gameVar from "./var.js";
import { BALL_RADIUS } from "./const.js";
import { drawPowerUp, collectPowerUp } from "./powerUp.js";
import { manageCollision, manageServer, manageMove } from "./manage.js";
import { updateIaMove } from "./ai.js";

export function initDraw()
{
	drawBall();
	drawPaddles();
	if (gameVar.customMap == false)
		drawLines();	
}

export function draw()
{
	gameVar.ctx.clearRect(0, 0, gameVar.canvasW, gameVar.canvasH);

	initDraw();
	drawPowerUp();
	collectPowerUp();
	if (gameVar.customMap == true)
		drawBricks();
	if (gameVar.gameStart)
		manageCollision();
	else
		manageServer();
	updateIaMove();
	manageMove();
	gameVar.animationFrame = requestAnimationFrame(draw);
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

export function drawBricks()
{
	const map = gameVar.maps['customMap1'];
	if (map)
	{
		map.forEach(wall =>
		{
			if (wall.sta == 1)	
			{
				gameVar.ctx.fillStyle = 'gray';
				gameVar.ctx.fillRect(wall.x, wall.y, wall.width, wall.height);
			}
		});
	}
}

export function initializeBall()
{
	// // if (gameVar.customMap == false)
	// {
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
	// }
	// else
	// {
	// 	gameVar.x = gameVar.playerPaddleWidth + BALL_RADIUS; 
	// 	gameVar.y = gameVar.playerPaddleX + gameVar.playerPaddleHeight / 2;
	// 	gameVar.x2 = gameVar.canvasw - gameVar.aiPaddleWidth - BALL_RADIUS;
	// 	gameVar.y2 = gameVar.aiPaddleX + gameVar.aiPaddleHeight / 2;
	// 	gameVar.dx2 = 0;
	// 	gameVar.dy2 = 0;		
	// }


}

export function drawBall()
{
	gameVar.ctx.beginPath();
	gameVar.ctx.arc(gameVar.x, gameVar.y, BALL_RADIUS, 0, Math.PI * 2);
	gameVar.ctx.fillStyle = "#F8FF00";
	gameVar.ctx.fill();
	gameVar.ctx.closePath();
	// if (gameVar.customMap == true)
	// {
	// 	console.log("second ball");
	// 	gameVar.ctx.beginPath();
	// 	gameVar.ctx.arc(gameVar.x2, gameVar.y2, BALL_RADIUS, 0, Math.PI * 2);
	// 	gameVar.ctx.fillStyle = "#F8FF00";
	// 	gameVar.ctx.fill();
	// 	gameVar.ctx.closePath();
	// }
}


import gameVar from "./var.js";
import { drawPowerUp, collectPowerUp, updatePowerUp } from "./powerUp.js";
import { manageServer, manageMove, manageRealCollision, manageCollisionLive } from "./manage.js";
import { manageServerAi, manageMoveAi, aiMove} from "./ai.js";
import { checkball } from "./check.js";
import { drawFootball } from "./foot.js";
import { drawTennisCourt } from "./tennis.js";
import { drawScoreBoard } from "./gameView.js";

export function initDraw()
{
	drawBall();
	checkPaddles();
	if (gameVar.currentLevel === 'tableTennis')
		drawLines();	
	else if (gameVar.currentLevel === 'football')
		drawFootball();
	else if (gameVar.currentLevel === 'tennis')
		drawTennisCourt();
}


export function drawLive()
{
	gameVar.ctx.clearRect(0, 0, gameVar.canvasW, gameVar.canvasH);
	initDraw();
	drawScoreBoard();
	if (gameVar.gameStart)
		manageCollisionLive();
	else
		manageServer();
	manageMove();
	if (gameVar.animationFrame)
		cancelAnimationFrame(gameVar.animationFrame);
	gameVar.animationFrame = requestAnimationFrame(drawLive);	
}

export function draw()
{
	gameVar.ctx.clearRect(0, 0, gameVar.canvasW, gameVar.canvasH);
	initDraw();
	drawScoreBoard();
	// drawPowerUp();
	// collectPowerUp();
	// updatePowerUp();
	if (gameVar.gameStart)
	{
		manageRealCollision();
		drawPowerUp();
		collectPowerUp();
		updatePowerUp();
	}
	else
		manageServerAi();
	manageMoveAi();
	aiMove(gameVar.targetY);
	if (gameVar.animationFrame)
		cancelAnimationFrame(gameVar.animationFrame);
	gameVar.animationFrame = requestAnimationFrame(draw);
}


export function checkPaddles()
{
	if (gameVar.liveMatch)
	{
		if (gameVar.playerIdx == 1)
			drawPaddle(1);
		if (gameVar.playerIdx == 2)
			drawPaddle(2)
	}
	else
	{
		drawPlayerPaddle();
		if (!gameVar.localGame)
			drawOtherPaddle("ai");
		else
			drawOtherPaddle('player2');
	}
}


function drawPaddle(player)
{
	if (player === 1)
	{
		drawPlayerPaddle();
		drawOtherPaddle("player2");
	}
	if (player === 2)
	{
		drawOtherPaddle("player2");
		drawPlayerPaddle();
	}
}

function drawPlayerPaddle()
{
	const x = 0;
    const radius = gameVar.playerPaddleWidth / 2 + 3;
	let color = null;

	if (gameVar.currentLevel === 'tableTennis')
		color = "#FF414D";
	else if (gameVar.currentLevel === 'football')
		color = "#FF414D";
	else if (gameVar.currentLevel === 'tennis')
		color = "#4169E1";

    gameVar.ctx.beginPath();
    gameVar.ctx.moveTo(x, gameVar.playerPaddleY);
    gameVar.ctx.lineTo(x, gameVar.playerPaddleY + gameVar.playerPaddleHeight);
    gameVar.ctx.lineTo(x + gameVar.playerPaddleWidth - radius, gameVar.playerPaddleY + gameVar.playerPaddleHeight);
    gameVar.ctx.arc(x + gameVar.playerPaddleWidth - radius, gameVar.playerPaddleY + gameVar.playerPaddleHeight - radius,
        radius, Math.PI/2, 0, true);
    gameVar.ctx.lineTo(x + gameVar.playerPaddleWidth, gameVar.playerPaddleY + radius);
    gameVar.ctx.arc(x + gameVar.playerPaddleWidth - radius, gameVar.playerPaddleY + radius,
        radius, 0, -Math.PI/2, true);
    gameVar.ctx.lineTo(x, gameVar.playerPaddleY);
    gameVar.ctx.fillStyle = color;
    gameVar.ctx.fill();
    gameVar.ctx.closePath();
}

function drawOtherPaddle(player)
{
	let paddleY = 0;
	let paddleHeight = 0;
	let paddleWidth = 0;
	let x = 0
	let radius = 0;
	let color = null;

	if (player === "player2")
	{
		console.log("draw player2 paddle");
		paddleY = gameVar.player2PaddleY;
		paddleHeight = gameVar.player2PaddleHeight;
		paddleWidth = gameVar.player2PaddleWidth;
		x = gameVar.canvasW - gameVar.player2PaddleWidth;
		radius = gameVar.player2PaddleWidth / 2 + 3;
		if (gameVar.currentLevel === 'tableTennis')
			color = "#0095DD";
		else if (gameVar.currentLevel === 'football')
			color = "#FF8C00";
		else if (gameVar.currentLevel === 'tennis')
			color = "#228B22";
	}
	else if (player === "ai")
	{
		paddleY = gameVar.aiPaddleY
		paddleHeight = gameVar.aiPaddleHeight;
		paddleWidth = gameVar.aiPaddleWidth;
		x = gameVar.canvasW - gameVar.aiPaddleWidth;
		radius = gameVar.aiPaddleWidth / 2 + 3;
		if (gameVar.currentLevel === 'tableTennis')
			color = "#0095DD";
		else if (gameVar.currentLevel === 'football')
			color = "#FF8C00";
		else if (gameVar.currentLevel === 'tennis')
			color = "#228B22";
	}

    gameVar.ctx.beginPath();
    gameVar.ctx.moveTo(x + paddleWidth, paddleY);
    gameVar.ctx.lineTo(x + paddleWidth, paddleY + paddleHeight);
    gameVar.ctx.lineTo(x + radius, paddleY + paddleHeight);
    gameVar.ctx.arc(x + radius, paddleY + paddleHeight - radius,
        radius, Math.PI/2, Math.PI, false);
    gameVar.ctx.lineTo(x, paddleY + radius);
    gameVar.ctx.arc(x + radius, paddleY + radius,
        radius, Math.PI, -Math.PI/2, false);
    gameVar.ctx.lineTo(x + paddleWidth, paddleY);
    gameVar.ctx.fillStyle = color;
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
	if (gameVar.currentServer === 'player')
	{
		gameVar.x = gameVar.playerPaddleWidth + gameVar.ballRadius; 
		gameVar.y = gameVar.playerPaddleY + gameVar.playerPaddleHeight / 2;
	}
	else 
	{
		if (gameVar.localGame || gameVar.liveMatch)
		{
			console.log("player2");
			gameVar.x = gameVar.canvasW - gameVar.player2PaddleWidth - gameVar.ballRadius;
			gameVar.y = gameVar.player2PaddleY + gameVar.player2PaddleHeight / 2;
		}
		else
		{
			console.log("ai");
			gameVar.x = gameVar.canvasW - gameVar.aiPaddleWidth - gameVar.ballRadius;
			gameVar.y = gameVar.aiPaddleY + gameVar.aiPaddleHeight / 2		
		}
	}
	gameVar.dx = 0;
	gameVar.dy = 0;
	if (gameVar.liveMatch)
		checkball();
}

export function drawBall()
{
	 if (isNaN(gameVar.x) || isNaN(gameVar.y) || !isFinite(gameVar.x) || !isFinite(gameVar.y)) {
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


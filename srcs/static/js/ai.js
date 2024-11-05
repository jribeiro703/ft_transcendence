import gameVar from "./var.js";
import { PADDLE_SPEED, AI_UPDATE_INTERVAL, AI, AI_LEVEL, FRAME_RATE} from './const.js';

export function aiServeBall()
{
	if (!gameVar.matchOver)
	{
		setTimeout(() => 
		{
			gameVar.gameStart = true;
			gameVar.dx = -gameVar.init_dx;
			gameVar.dy = (Math.random() < 0.5 ? gameVar.init_dy : -gameVar.init_dy);
			gameVar.aiServe = false;
		}, 1000);
	}
}

export function manageAi()
{
	console.log("manageAI");
	const currentTime = Date.now();
	if (currentTime - AI.lastUpdate >= AI.refreshTime)
	{
		AI.lastUpdate = currentTime;
		const ballFuturePos = predictBallPos(gameVar);
		moveAi(ballFuturePos);
		console.log("aimove");
		const readableDate = new Date(Date.now());
		console.log(readableDate);
	}
}

function predictBallPos(gameVar)
{
	let predictY = gameVar.y;
	let predictDy = gameVar.dy;
	let predictX = gameVar.x;
	let predictDx = gameVar.dx;

	let simuStep = 2000;
	while (simuStep > 0)
	{
		predictY += predictDy;
		predictX += predictDx;
		if (predictY <= 0 || predictY >= gameVar.canvasH)
		{
			predictDy *= -1;
			predictY = Math.max(0, Math.min(gameVar.canvasH, predictY));
		}
		if (predictX <= 0 || predictX >= gameVar.canvasW)
		{
			predictDx *= -1;
			predictX = Math.max(0, Math.min(gameVar.canvasW, predictX));
		}
		simuStep--;
	}
	return predictY;
}

function moveAi(predictY)
{
	console.log("predic Y : ", predictY);
	const distance = predictY - gameVar.aiPaddleX;
	const direction = Math.sign(distance);

	const speedAdj = Math.min(Math.abs(distance), PADDLE_SPEED * AI_LEVEL);
	gameVar.aiPaddleX = Math.min(Math.max(0, gameVar.aiPaddleX + direction * speedAdj), gameVar.canvasH - gameVar.aiPaddleHeight);
	console.log("paddle ai :", gameVar.aiPaddleX)
}

export function aiMovement()
{
	gameVar.aiMoveInterval = setInterval(() =>
	{
		// manageAi();
		updateIaMove();	
	}, AI_UPDATE_INTERVAL);	
}

export function updateIaMove()
{
	if (gameVar.dx > 0 && gameVar.x > gameVar.canvasW / 2) 
	{
		if (gameVar.y < gameVar.aiPaddleX + gameVar.aiPaddleHeight / 2 && gameVar.aiPaddleX > 0)
		{
			gameVar.aiPaddleX -= PADDLE_SPEED;
		}
		else if (gameVar.y > gameVar.aiPaddleX + gameVar.aiPaddleHeight / 2 && gameVar.aiPaddleX < gameVar.canvasH - gameVar.aiPaddleHeight)
		{
			gameVar.aiPaddleX += PADDLE_SPEED;
		}
	}
}

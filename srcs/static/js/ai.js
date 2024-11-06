import gameVar from "./var.js";
import { PADDLE_SPEED, AI_UPDATE_INTERVAL, AI, AI_LEVEL } from './const.js';

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
export function manageAi2()
{
	// console.log("manageAI");
	const currentTime = Date.now();
	if (currentTime - AI.lastUpdate >= AI.refreshTime)
	{
		
		console.log("predict" ,predictBallPos(gameVar));
		// moveAi(ballFuturePos);
		// console.log("aimove");
		const readableDate = new Date(Date.now());
		console.log(readableDate);
	}
}


function predictBallPos(gameVar)
{
	const ballPos = 
	{
		x: gameVar.x,
		y: gameVar.y
	}
	const dirVec = 
	{
		dx: gameVar.dx,
		dy: gameVar.dy
	}
	const aiPaddle =
	{
		x: gameVar.aiPaddleX,
	}
	const boundaries =
	{
		x_min: 0,
		x_max: gameVar.canvasW,
		y_min: 0,
		y_max: gameVar.canvasH,
	}
	let step = 250;
	let futurePtsList = [];

	for (let i = 0; i < step; i++)
	{
		let xTmp = Math.floor(i * dirVec.x + ballPos.x);
        let yTmp = Math.floor(i * dirVec.y + ballPos.y);
        
        let xEnd, yEnd;

        // Si la balle dépasse le bas du terrain
        if (yTmp > boundaries.y_max)
		{
            yEnd = Math.floor(2 * boundaries.y_max - yTmp);
            xEnd = xTmp;
        }
        // Si la balle dépasse le haut du terrain
        else if (yTmp < boundaries.y_min)
		{
            yEnd = Math.floor(-yTmp);
            xEnd = xTmp;
        }
		else 
		{
            yEnd = yTmp;
        }

        // Si la balle dépasse le côté droit
        if (xTmp > aiPaddle.x)
		{
            xEnd = Math.floor(boundaries.x_max);
            yEnd = Math.floor(ballPos.y + ((boundaries.x_max - ballPos.x) / dirVec.x) * dirVec.y);
        }
        // Si la balle dépasse le côté gauche
        else if (xTmp < boundaries.x_min)
		{
            xEnd = Math.floor(boundaries.x_min);
            yEnd = Math.floor(ballPos.y + ((boundaries.x_min - ballPos.x) / dirVec.x) * dirVec.y);
        } 
		else
		{
            xEnd = xTmp;
        }

        let endPos = [xEnd, yEnd];
        futurePtsList.push(endPos);
	}
	return (futurePtsList);
}

function moveAi(predictY)
{
	// console.log("predic Y : ", predictY);
	const distance = predictY - gameVar.aiPaddleX;
	const direction = Math.sign(distance);

	const speedAdj = Math.min(Math.abs(distance), PADDLE_SPEED * AI_LEVEL);
	gameVar.aiPaddleX = Math.min(Math.max(0, gameVar.aiPaddleX + direction * speedAdj), gameVar.canvasH - gameVar.aiPaddleHeight);
	// console.log("paddle ai :", gameVar.aiPaddleX) 
}


export function manageAi()
{
	gameVar.aiMoveInterval = setInterval(() =>
	{
		console.log("aimove");
		// const readableDate = new Date(Date.now());
		// console.log(readableDate);
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

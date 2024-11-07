import gameVar from "./var.js";
import { PADDLE_SPEED, AI_UPDATE_INTERVAL, PADDLE_THRESHOLD, CENTER_POSITION } from './const.js';

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

export function aiMove(targetY)
{
	if (gameVar.targetY != 0)
	{
		if (Math.abs(gameVar.aiPaddleY - gameVar.targetY) > PADDLE_THRESHOLD)
		{
			if (gameVar.aiPaddleY < targetY && gameVar.aiPaddleY < gameVar.canvasH - gameVar.aiPaddleHeight)
				gameVar.aiPaddleY += PADDLE_SPEED;
			else if (gameVar.aiPaddleY > targetY && gameVar.aiPaddleY > 0)
				gameVar.aiPaddleY -= PADDLE_SPEED;
		}
	}
}

export function manageAi()
{
	gameVar.aiMoveInterval = setInterval(() =>
	{
		if (gameVar.dx > 0)
		{
			let future = predictBallPos(gameVar);
			gameVar.targetY = future[749][1];
		}
	}, AI_UPDATE_INTERVAL);	
}

export function updateIaMove()
{
	if (gameVar.dx > 0 && gameVar.x > gameVar.canvasW / 2) 
	{
		if (gameVar.y < gameVar.aiPaddleY + gameVar.aiPaddleHeight / 2 && gameVar.aiPaddleY > 0)
		{
			gameVar.aiPaddleY -= PADDLE_SPEED;
		}
		else if (gameVar.y > gameVar.aiPaddleY + gameVar.aiPaddleHeight / 2 && gameVar.aiPaddleY < gameVar.canvasH - gameVar.aiPaddleHeight)
		{
			gameVar.aiPaddleY += PADDLE_SPEED;
		}
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
	const limits =
	{
		x_min: 0,
		x_max: gameVar.canvasW,
		y_min: 0,
		y_max: gameVar.canvasH,
	}
	let step = 750;
	let futurePtsList = [];

	for (let i = 0; i < step; i++)
	{
		let xTmp = Math.floor(i * dirVec.dx + ballPos.x);
        let yTmp = Math.floor(i * dirVec.dy + ballPos.y);
        
        let xEnd, yEnd;
        if (yTmp > limits.y_max)
		{
            yEnd = Math.floor(2 * limits.y_max - yTmp);
            xEnd = xTmp;
        }
        else if (yTmp < limits.y_min)
		{
            yEnd = Math.floor(-yTmp);
            xEnd = xTmp;
        }
		else 
		{
            yEnd = yTmp;
        }
        if (xTmp > (limits.x_max - gameVar.aiPaddleWidth))
		{
            xEnd = Math.floor(limits.x_max);
            yEnd = Math.floor(ballPos.y + ((limits.x_max - ballPos.x) / dirVec.dx) * dirVec.dy);
        }
        else if (xTmp < limits.x_min)
		{
            xEnd = Math.floor(limits.x_min);
            yEnd = Math.floor(ballPos.y + ((limits.x_min - ballPos.x) / dirVec.dx) * dirVec.dy);
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
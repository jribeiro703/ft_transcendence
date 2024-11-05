import gameVar from "./var.js";
import { PADDLE_SPEED, AI_UPDATE_INTERVAL} from './const.js';

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

export function aiMovement()
{
	gameVar.aiMoveInterval = setInterval(() => {
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


class Paddle 
{
	constructor(y, height)
	{
		this.position = y;
		this.height = height;
	}

	moveUp()
	{
		this.position -= 10;
		if (this.position < 0)
			this.position = 0;

	}

	moveDown()
	{
		this.position += 10;
		if (this.position + this.height > gameVar.canvasH)
			this.position = gameVar.canvasH - this.height;
	}
}

class aiCpu
{
	constructor(paddle)
	{
		this.paddle = paddle;
		this.refreshTime = 1000;
		this.lastUpdate = Date.now();
	}
	update()
	{
		const currentTime = Date.now();
		if (currentTime - this.lastUpdate >= this.refreshTime)
		{
			this.lastUpdate = currentTime;
			const futurBallpos = this.predictBallPos();
			if (futurBallpos < this.paddle.position)
			{
				this.paddle.moveUp();
			}
			else if (futurBallpos > this.paddle.position + this.paddle.height)
			{
				this.paddle.moveDown();
			}
		}
	}

	predictBallPos()
	{
		const futureY = gameVar.y + gameVar.dy * (this.refreshTime / 1000); 
		
		if (futureY < 0  || futureY > gameVar.canvasH)
			return (gameVar.canvasH - Math.abs(futureY));

		return (futureY);
	}
}
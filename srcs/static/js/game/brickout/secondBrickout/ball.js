import brickVar2 from "./var.js";
import { resetPowerUpB } from "./powerUp.js";
import { displayBallB } from "../../pong/displayVar.js";

export function startBallB(e)
{
	if (e.code === 'Enter' && !brickVar2.gameStart)
	{
		if (!brickVar2.finishLevel)
		{
            console.log("Starting ball2");
            brickVar2.gameStart = true;
			brickVar2.startTime = true;
            brickVar2.dx = brickVar2.initDx;
            brickVar2.dy = -brickVar2.initDy;
			displayBallB();
			console.log("New dx, dy:", brickVar2.dx, brickVar2.dy);
		}
	else
		{
            console.log("Level finished - ignoring space");
            e.preventDefault();
            e.stopPropagation();
        }
	}
}

export function initBallB()
{
	brickVar2.x = brickVar2.paddleX + brickVar2.paddleWidth / 2;
	brickVar2.y = brickVar2.canvasH - brickVar2.paddleHeight - brickVar2.ballRadius;

	brickVar2.dx = 0;
	brickVar2.dy = 0;
}

export function resetBallB()
{
	initBallB();
	brickVar2.gameStart = false;
	resetPowerUpB();
}
export function updateBallPositionB()
{
    if (brickVar2.gameStart)
	{
        brickVar2.x += brickVar2.dx;
        brickVar2.y += brickVar2.dy;
    }
}

export function handleBallB()
{
	brickVar2.x = brickVar2.paddleX + brickVar2.paddleWidth / 2;
	brickVar2.y = brickVar2.canvasH - (brickVar2.paddleHeight + brickVar2.ballRadius);
}
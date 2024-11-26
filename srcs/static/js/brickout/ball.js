import { resetPowerUpB } from "./powerUp.js";
import brickVar from "./var.js";

export function startBallB(e)
{
	if (e.code === 'Space' && !brickVar.gameStart)
	{
		if (!brickVar.finishLevel)
		{
            console.log("Starting ball");
            brickVar.gameStart = true;
            brickVar.dx = brickVar.initDx;
            brickVar.dy = (Math.random() < 0.5 ? brickVar.initDy : -brickVar.initDy);
        }
		else
		{
            console.log("Level finished - ignoring space");
            e.preventDefault();
            e.stopPropagation();
        }
	}
}
export function displayBallB()
{
	console.log("x: ", brickVar.x);
	console.log("y: ", brickVar.y);
	console.log("dx: ", brickVar.dx);
	console.log("dy: ", brickVar.dy);
}

export function initBallB()
{
	brickVar.x = brickVar.paddleX + brickVar.paddleWidth / 2;
	brickVar.y = brickVar.canvasH - brickVar.paddleHeight - brickVar.ballRadius;

	brickVar.dx = 0;
	brickVar.dy = 0;
}

export function resetBallB()
{
	initBallB();
	brickVar.gameStart = false;
	resetPowerUpB();
}
export function updateBallPositionB()
{
    if (brickVar.gameStart)
	{
        brickVar.x += brickVar.dx;
        brickVar.y += brickVar.dy;
    }
}

export function handleBallB()
{
	brickVar.x = brickVar.paddleX + brickVar.paddleWidth / 2;
	brickVar.y = brickVar.canvasH - (brickVar.paddleHeight + brickVar.ballRadius);
}
import { resetPowerUpB } from "./powerUp.js";
import brickVar2 from "./var.js";

export function startBallB(e)
{
	if (e.code === 'Enter' && !brickVar2.gameStart)
	{
		if (!brickVar2.finishLevel)
		{
            console.log("Starting ball2");
            brickVar2.gameStart = true;
            brickVar2.dx = brickVar2.initDx;
            brickVar2.dy = (Math.random() < 0.5 ? brickVar2.initDy : -brickVar2.initDy);
			// displayBallB();
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
export function displayBallB()
{
	// console.log("x: ", brickVar2.x);
	// console.log("y: ", brickVar2.y);
	// console.log("dx: ", brickVar2.dx);
	// console.log("dy: ", brickVar2.dy);
	console.log("init Dx :", brickVar2.initDx);
	console.log("init Dy :", brickVar2.initDy);
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
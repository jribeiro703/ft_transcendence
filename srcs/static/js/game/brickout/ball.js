import { resetPowerUpB } from "./powerUp.js";
import brickVar from "./var.js";
import brickVar2 from "./secondBrickout/var.js";

export function startBallB(e)
{
	if (e.code === 'Space' && !brickVar.gameStart)
	{
		if (!brickVar.finishLevel)
		{
            brickVar.gameStart = true;
			brickVar.startTime = true;
            brickVar.dx = brickVar.initDx;
            // brickVar.dy = (Math.random() < 0.5 ? brickVar.initDy : -brickVar.initDy);
            brickVar.dy = -brickVar.initDy;
			displayBallB();
			console.log("New dx, dy:", brickVar.dx, brickVar.dy);
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
	// console.log("x: ", brickVar.x);
	// console.log("y: ", brickVar.y);
	// console.log("dx: ", brickVar.dx);
	// console.log("dy: ", brickVar.dy);
	console.log("init Dx :", brickVar.initDx);
	console.log("init Dy :", brickVar.initDy);
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
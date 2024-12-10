import brickVar from "./var.js";
import { resetPowerUpB } from "./powerUp.js";
import { updateDifficultySelectionB } from "./update.js";

export function startBallB(e)
{
	if (e.code === 'Space' && !brickVar.gameStart)
	{
		if (!brickVar.finishLevel)
		{
            console.log("Starting ball1");
			console.log("diff1: ", brickVar.difficulty)
            brickVar.gameStart = true;
			brickVar.startTime = true;
			if (!brickVar.initDx || !brickVar.initDy)
				updateDifficultySelectionB(brickVar.difficulty, true);
            brickVar.dx = brickVar.initDx;
            brickVar.dy = -brickVar.initDy;
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
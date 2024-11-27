import brickVar from './var.js';
import { collisionDetectionB, drawBricksB, initBricksB } from './brick.js'
import { drawBallB, drawLivesB, drawPaddleB, drawScoreB } from './draw.js';
import { keyDownHandlerB, keyUpHandlerB, mouseMoveHandlerB} from './control.js';
import { initBallB, updateBallPositionB, startBallB, handleBallB } from './ball.js';
import { manageCollisionB, manageMoveB } from './manage.js';
import { collectPowerUpB, createPowerUpB, drawPowerUpB, updatePowerUpB } from './powerUp.js';
import { checkLevelB } from './level.js';


export function initListenerB()
{
	removeEventListenersB();

	document.addEventListener("keydown", (e) => {
        if (e.code === "Space") {
            startBallB(e);
        }
    });

    document.addEventListener("keydown", (e) => {
        if (e.code === "ArrowRight" || e.code === "ArrowLeft") {
            keyDownHandlerB(e);
        }
    });

    document.addEventListener("keyup", (e) => {
        if (e.code === "ArrowRight" || e.code === "ArrowLeft") {
            keyUpHandlerB(e);
        }
    });

	if (brickVar.classic)
		startGameB("classic");
	else if (brickVar.castle)
		startGameB("castle");
	else if (brickVar.x)
		startGameB('x');
	else if (brickVar.invader)
		startGameB('invader');
	else
		startBallB('classic');

}

function removeEventListenersB()
{
    document.removeEventListener("keydown", keyDownHandlerB);
    document.removeEventListener("keyup", keyUpHandlerB);
    document.removeEventListener("keydown", startBallB);
}

export function startGameB(level)
{
	if (!brickVar.initGame)
	{
		initBallB();
		checkLevelB(level);
		if (brickVar.powerUpenable)
			createPowerUpB();
		drawB();
		brickVar.initGame = true;
	}
}

function initVar()
{
	console.log("dx :", brickVar.initDx);
	console.log("dy :", brickVar.initDy);
}
function baseDrawB()
{
	drawBricksB();
	drawBallB();
	drawPaddleB();
	drawScoreB();
	drawLivesB();
}

function drawB()
{
	if (brickVar.finishLevel == false)
	{
		brickVar.ctx.clearRect(0, 0, brickVar.canvasW, brickVar.canvasH);
		baseDrawB();
		if (brickVar.gameStart)
		{
			drawPowerUpB();
			collectPowerUpB();
			collisionDetectionB();
			manageCollisionB();
			updatePowerUpB();
		}
		else
			handleBallB();
		manageMoveB();
		updateBallPositionB();
		if (brickVar.anim)
			cancelAnimationFrame(brickVar.anim); 
		brickVar.anim = requestAnimationFrame(drawB);
	}

}



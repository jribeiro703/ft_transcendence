import brickVar from './var.js';
import { collisionDetectionB, drawBricksB, initBricksB } from './brick.js'
import { drawBallB, drawPaddleB } from './draw.js';
import { keyDownHandlerB, keyUpHandlerB, mouseMoveHandlerB} from './control.js';
import { initBallB, updateBallPositionB, startBallB, handleBallB } from './ball.js';
import { manageCollisionB, manageMoveB } from './manage.js';
import { collectPowerUpB, createPowerUpB, drawPowerUpB, updatePowerUpB } from './powerUp.js';
import { startGameB } from '../start.js';
import { drawScoreBoardB } from './draw.js';
import { displayBallB } from './ball.js';

export function showGameBrickView()
{
	console.log("brickview");

	history.pushState({ view: 'game'}, '', `?view=solo/brickout`);
	const mainContent = document.getElementById('mainContent');
	mainContent.innerHTML = '';
	const insertTo = document.createElement('div');
	insertTo.innerHTML = `
	<div id="scoreboard">
		<canvas id="scoreCanvas"></canvas>
	</div>
	<canvas id="brickoutCanvas"></canvas>
	`;
	mainContent.appendChild(insertTo);
    
	var canvas = document.getElementById("brickoutCanvas");
	if (!canvas)
	{
        console.error("Canvas not found");
        return;
    }
	brickVar.canvas = canvas;
	brickVar.ctx = canvas.getContext("2d");
	canvas.width = brickVar.canvasW;
	canvas.height = brickVar.canvasH;
	canvas.style.width = `${brickVar.canvasW}px`;
    canvas.style.height = `${brickVar.canvasH}px`;

	var scoreCanvas = document.getElementById('scoreCanvas');
	brickVar.scoreCtx = scoreCanvas.getContext('2d');
	scoreCanvas.width = brickVar.scoreCanvW;
	scoreCanvas.height = brickVar.scoreCanvH;

	brickVar.gameTime = 0;
    brickVar.gameTimer = setInterval(() =>
	{
        if (brickVar.startTime)
		{
            brickVar.gameTime++;
        }
    }, 1000);

    scoreCanvas.style.marginBottom = '10px';

	brickVar.initialize = true;
}

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
		startGameB('classic');

}

function removeEventListenersB()
{
    document.removeEventListener("keydown", keyDownHandlerB);
    document.removeEventListener("keyup", keyUpHandlerB);
    document.removeEventListener("keydown", startBallB);
}



function initVar()
{
	console.log("dx :", brickVar.initDx);
	console.log("dy :", brickVar.initDy);
}

function baseDrawB()
{
	brickVar.ctx.clearRect(0, 0, brickVar.canvasW, brickVar.canvasH);
	drawScoreBoardB();
	drawBricksB();
	drawBallB();
	drawPaddleB();
	// drawScoreB();
	// drawLivesB();
}

export function drawB()
{
	if (brickVar.finishLevel == false)
	{
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
		{
			handleBallB();
			displayBallB();
		}
		manageMoveB();
		updateBallPositionB();
		if (brickVar.anim)
			cancelAnimationFrame(brickVar.anim); 
		brickVar.anim = requestAnimationFrame(drawB);
	}

}



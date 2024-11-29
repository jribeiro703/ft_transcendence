import brickVar2 from './var.js';
import { collisionDetectionB, drawBricksB, initBricksB } from './brick.js'
import { drawBallB, drawPaddleB } from './draw.js';
import { keyDownHandlerB, keyUpHandlerB, mouseMoveHandlerB} from './control.js';
import { initBallB, updateBallPositionB, startBallB, handleBallB } from './ball.js';
import { manageCollisionB, manageMoveB } from './manage.js';
import { collectPowerUpB, createPowerUpB, drawPowerUpB, updatePowerUpB } from './powerUp.js';

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
	brickVar2.canvas = canvas;
	brickVar2.ctx = canvas.getContext("2d");
	canvas.width = brickVar2.canvasW;
	canvas.height = brickVar2.canvasH;
	canvas.style.width = `${brickVar2.canvasW}px`;
    canvas.style.height = `${brickVar2.canvasH}px`;

	var scoreCanvas = document.getElementById('scoreCanvas');
	brickVar2.scoreCtx = scoreCanvas.getContext('2d');
	scoreCanvas.width = brickVar2.scoreCanvW;
	scoreCanvas.height = brickVar2.scoreCanvH;

	brickVar2.gameTime = 0;
    brickVar2.gameTimer = setInterval(() =>
	{
        if (brickVar2.startTime)
		{
            brickVar2.gameTime++;
        }
    }, 1000);

    scoreCanvas.style.marginBottom = '10px';

	brickVar2.initialize = true;
}
export function showGameBrickMultiView()
{
	console.log("brickMultiview");

	// history.pushState({ view: 'game'}, '', `?view=solo/brickout`);
	const mainContent = document.getElementById('mainContent');
	mainContent.innerHTML = '';
	const insertTo = document.createElement('div');
	insertTo.innerHTML = `
	<div id="scoreboard">
		<canvas id="scoreCanvas"></canvas>
	</div>
	<div id="twoPlayerBrick">
		<canvas id="brickoutCanvas"></canvas>
		<canvas id="brickoutCanvas2"></canvas>
	</div>
	`;
	mainContent.appendChild(insertTo);
    
	var canvas = document.getElementById("brickoutCanvas");
	if (!canvas)
	{
        console.error("Canvas not found");
        return;
    }
	brickVar2.canvas = canvas;
	brickVar2.ctx = canvas.getContext("2d");
	canvas.width = brickVar2.canvasW;
	canvas.height = brickVar2.canvasH;
	canvas.style.width = `${brickVar2.canvasW}px`;
    canvas.style.height = `${brickVar2.canvasH}px`;

	var scoreCanvas = document.getElementById('scoreCanvas');
	brickVar2.scoreCtx = scoreCanvas.getContext('2d');
	scoreCanvas.width = brickVar2.scoreCanvW;
	scoreCanvas.height = brickVar2.scoreCanvH;

	brickVar2.gameTime = 0;
    brickVar2.gameTimer = setInterval(() =>
	{
        if (brickVar2.startTime)
		{
            brickVar2.gameTime++;
        }
    }, 1000);

    scoreCanvas.style.marginBottom = '10px';

	brickVar2.initialize = true;
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


	if (brickVar2.classic)
		startGameB("classic");
	else if (brickVar2.castle)
		startGameB("castle");
	else if (brickVar2.x)
		startGameB('x');
	else if (brickVar2.invader)
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
	console.log("dx :", brickVar2.initDx);
	console.log("dy :", brickVar2.initDy);
}

function baseDrawB()
{
	brickVar2.ctx.clearRect(0, 0, brickVar2.canvasW, brickVar2.canvasH);
	// drawScoreBoardB();
	drawBricksB();
	drawBallB();
	drawPaddleB();
	// drawScoreB();
	// drawLivesB();
}

export function drawB()
{
	if (brickVar2.finishLevel == false)
	{
		baseDrawB();
		if (brickVar2.gameStart)
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
			// displayBallB();
		}
		manageMoveB();
		updateBallPositionB();
		if (brickVar2.anim)
			cancelAnimationFrame(brickVar2.anim); 
		brickVar2.anim = requestAnimationFrame(drawB);
	}

}




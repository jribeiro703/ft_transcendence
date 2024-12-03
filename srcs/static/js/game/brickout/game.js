import gameVar from '../pong/var.js';
import brickVar from './var.js';
import brickVar2 from './secondBrickout/var.js';
import { collisionDetectionB, drawBricksB} from './brick.js'
import { drawBallB, drawPaddleB } from './draw.js';
import { keyDownHandlerB, keyUpHandlerB} from './control.js';
import { updateBallPositionB, handleBallB } from './ball.js';
import { manageCollisionB, manageMoveB } from './manage.js';
import { collectPowerUpB, drawPowerUpB, updatePowerUpB } from './powerUp.js';
import { drawScoreBoardB } from './draw.js';
import { startBallB as startBallFirst } from './ball.js';
import { startBallB as startBallSecond } from './secondBrickout/ball.js'
import { startGameB as startGameFirst} from './control.js';
import { startGameB as startGameSecond } from './secondBrickout/control.js';
import { updateSettingSelectionForSecond } from './settings.js';
import { checkSettingB } from './settings.js';

export function showGameBrickView()
{
	gameVar.game = "brickout";
	checkSettingB();
	console.log("brickview");
	// history.pushState({ view: 'game'}, '', `?view=solo/brickout`);
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
	initListenerB();
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
	brickVar.canvas = canvas;
	brickVar.ctx = canvas.getContext("2d");
	canvas.width = brickVar.canvasW;
	canvas.height = brickVar.canvasH;
	canvas.style.width = `${brickVar.canvasW}px`;
    canvas.style.height = `${brickVar.canvasH}px`;

	var scoreCanvas = document.getElementById('scoreCanvas');
	brickVar.scoreCtx = scoreCanvas.getContext('2d');
	scoreCanvas.width = brickVar.scoreCanvW
	scoreCanvas.height = brickVar.scoreCanvH + 100;

	brickVar.gameTime = 0;
    brickVar.gameTimer = setInterval(() =>
	{
        if (brickVar.startTime)
		{
            brickVar.gameTime++;
        }
    }, 1000);

	brickVar2.gameTime = 0;
    brickVar2.gameTimer = setInterval(() =>
	{
        if (brickVar2.startTime)
		{
            brickVar2.gameTime++;
        }
    }, 1000);

    scoreCanvas.style.marginBottom = '10px';

	var canvas2 = document.getElementById("brickoutCanvas2");
	if (!canvas2)
	{
        console.error("Canvas not found");
        return;
    }
	brickVar2.canvas = canvas2;
	brickVar2.ctx = canvas2.getContext("2d");
	canvas2.width = brickVar2.canvasW;
	canvas2.height = brickVar2.canvasH;
	canvas2.style.width = `${brickVar2.canvasW}px`;
    canvas2.style.height = `${brickVar2.canvasH}px`;

	brickVar.initialize = true;
	brickVar2.initialize = true;

}
export function initListenerB()
{
	removeEventListenersB();

	document.addEventListener("keydown", (e) => {
        if (e.code === "Space") {
            startBallFirst(e);
        }
    });

    document.addEventListener("keydown", (e) => {
        if (e.code === "ArrowRight" || e.code === "ArrowLeft" || e.code === 'KeyA' || e.code === 'KeyD') {
			console.log("pppp");
            keyDownHandlerB(e);
        }
    });

    document.addEventListener("keyup", (e) => {
        if (e.code === "ArrowRight" || e.code === "ArrowLeft" || e.code === 'KeyA' || e.code === 'KeyD') {
            keyUpHandlerB(e);
        }
    });

		if (brickVar.classic)
		startGameFirst("classic");
	else if (brickVar.castle)
		startGameFirst("castle");
	else if (brickVar.x)
		startGameFirst('x');
	else if (brickVar.invader)
		startGameFirst('invader');
	else
		startGameFirst('classic');

}
export function initListenerMultiB()
{
	removeEventListenersB();

	document.addEventListener("keydown", (e) => {
        if (e.code === "Space") {
            startBallFirst(e);
        }
    });

    document.addEventListener("keydown", (e) => {
        if (e.code === "ArrowRight" || e.code === "ArrowLeft" || e.code === "KeyA" || e.code === "KeyD") {
            keyDownHandlerB(e);
        }
    });

    document.addEventListener("keyup", (e) => {
        if (e.code === "ArrowRight" || e.code === "ArrowLeft" || e.code === "KeyA" || e.code === "KeyD") {
            keyUpHandlerB(e);
        }
    });

	document.addEventListener("keydown", (e) => {
        if (e.code === "Enter") {
            startBallSecond(e);
        }
    });

	updateSettingSelectionForSecond();
	
	checkSettingB();
	if (brickVar.classic)
	{
		startGameFirst("classic");
		startGameSecond("classic");
	}
	else if (brickVar.castle)
	{
		startGameFirst("castle");
		startGameSecond("castle");
	}
	else if (brickVar.x)
	{
		startGameFirst('x');
		startGameSecond('x');
	}
	else if (brickVar.invader)
	{
		startGameFirst('invader');
		startGameSecond('invader');
	}
	else
	{
		startGameFirst('classic');
		startGameSecond('classic');
	}
}

function removeEventListenersB()
{
    document.removeEventListener("keydown", keyDownHandlerB);
    document.removeEventListener("keyup", keyUpHandlerB);
    document.removeEventListener("keydown", startBallFirst);
    document.removeEventListener("keydown", startBallSecond);
}

function baseDrawB()
{
	brickVar.ctx.clearRect(0, 0, brickVar.canvasW, brickVar.canvasH);
	drawScoreBoardB();
	drawBricksB();
	drawBallB();
	drawPaddleB();
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
		}
		manageMoveB();
		updateBallPositionB();
		if (brickVar.anim)
			cancelAnimationFrame(brickVar.anim); 
		brickVar.anim = requestAnimationFrame(drawB);
	}

}



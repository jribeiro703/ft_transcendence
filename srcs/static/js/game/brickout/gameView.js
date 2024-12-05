import gameVar from '../pong/var.js';
import brickVar from './var.js';
import brickVar2 from './secondBrickout/var.js';
import { checkSettingB } from './settings.js';
import { initListenerB, initListenerMultiB } from './init.js';

export function showGameBrickView()
{
	checkSettingB();
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
    
	loadFirstCanvas();
	loadScoreCanvas();
	initListenerB();
	brickVar.initialize = true;
}

export function loadScoreCanvas()
{
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
}
export function showGameBrickMultiView()
{
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
    
	loadFirstCanvas();
	loadSecondCanvas();
	load2pScoreCanvas();
	initListenerMultiB();
	brickVar.initialize = true;
	brickVar2.initialize = true;
}
export function loadFirstCanvas()
{
	var canvas = document.getElementById("brickoutCanvas");
	brickVar.canvas = canvas;
	brickVar.ctx = canvas.getContext("2d");
	canvas.width = brickVar.canvasW;
	canvas.height = brickVar.canvasH;
	canvas.style.width = `${brickVar.canvasW}px`;
    canvas.style.height = `${brickVar.canvasH}px`;
}
export function loadSecondCanvas()
{
	var canvas2 = document.getElementById("brickoutCanvas2");
	brickVar2.canvas = canvas2;
	brickVar2.ctx = canvas2.getContext("2d");
	canvas2.width = brickVar2.canvasW;
	canvas2.height = brickVar2.canvasH;
	canvas2.style.width = `${brickVar2.canvasW}px`;
    canvas2.style.height = `${brickVar2.canvasH}px`;
}
export function load2pScoreCanvas()
{
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
}


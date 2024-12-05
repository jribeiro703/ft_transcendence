import brickVar2 from './var.js';

export function showGameBrickView()
{
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

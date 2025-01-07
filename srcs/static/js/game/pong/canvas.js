import gameVar from "./var.js";
import brickVar from "../brickout/var.js";
import brickVar2 from "../brickout/secondBrickout/var.js";

export function initializeCanvasPong()
{
    return new Promise((resolve) =>
	{
        const checkCanvas = setInterval(() =>
		{
            const pongCanvas = document.getElementById('myCanvas');
            const scoreCanvas = document.getElementById('scoreCanvas');

            if (pongCanvas)
			{
                gameVar.ctx = pongCanvas.getContext('2d');
                pongCanvas.width = gameVar.canvasW;
                pongCanvas.height = gameVar.canvasH;
            }
            if (scoreCanvas)
			{
                gameVar.scoreCtx = scoreCanvas.getContext('2d');
                scoreCanvas.width = gameVar.scoreCanvW;
                scoreCanvas.height = gameVar.scoreCanvH;
                scoreCanvas.style.marginBottom = '10px';
            }
			gameVar.gameTime = 0;
			gameVar.gameTimer = setInterval(() =>
			{
				if (gameVar.startTime)
				{
					gameVar.gameTime++;
				}
			}, 1000);

			clearInterval(checkCanvas);
			resolve();

        }, 100);
    });
}
export function initializeCanvasBrick()
{
    return new Promise((resolve) =>
	{
        const checkCanvas = setInterval(() =>
		{
            const brickoutCanvas = document.getElementById('brickoutCanvas');
            if (brickoutCanvas)
			{
                brickVar.ctx = brickoutCanvas.getContext('2d');
                brickoutCanvas.width = brickVar.canvasW;
                brickoutCanvas.height = brickVar.canvasH;
                brickoutCanvas.style.width = `${brickVar.canvasW}px`;
                brickoutCanvas.style.height = `${brickVar.canvasH}px`;
            }

			clearInterval(checkCanvas);
			resolve();
        }, 100);
    });
}
export function initializeScoreCanvasBrickout()
{
	return new Promise((resolve) =>
	{
        const checkCanvas = setInterval(() =>
		{
            const scoreCanvas = document.getElementById('scoreCanvas');
			if (scoreCanvas)
			{
                brickVar.scoreCtx = scoreCanvas.getContext('2d');
                scoreCanvas.width = brickVar.scoreCanvW;
                scoreCanvas.height = brickVar.scoreCanvH;
                scoreCanvas.style.marginBottom = '10px';
            }

			brickVar.gameTime = 0;				
			brickVar.gameTimer = setInterval(() =>
			{
				if (brickVar.startTime)
				{
					brickVar.gameTime++;
				}
			}, 1000);

			clearInterval(checkCanvas);
			resolve();

        }, 100);
    });
}


export function initializeScoreCanvas2P()
{
	return new Promise((resolve) =>
	{
        const checkCanvas = setInterval(() =>
		{
            const scoreCanvas = document.getElementById('scoreCanvas');
			if (scoreCanvas)
			{
                brickVar.scoreCtx = scoreCanvas.getContext('2d');
                scoreCanvas.width = brickVar.scoreCanvW;
                scoreCanvas.height = brickVar.scoreCanvH + 100;
                scoreCanvas.style.marginBottom = '10px';
            }

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

			clearInterval(checkCanvas);
			resolve();

        }, 100);
    });
}

export function initializeCanvasBrick2p()
{
    return new Promise((resolve) =>
	{
        const checkCanvas = setInterval(() =>
		{
            const brickoutCanvas = document.getElementById('brickoutCanvas');
            const brickoutCanvas2 = document.getElementById('brickoutCanvas2');
            if (brickoutCanvas)
			{
                brickVar.ctx = brickoutCanvas.getContext('2d');
                brickoutCanvas.width = brickVar.canvasW;
                brickoutCanvas.height = brickVar.canvasH;
                brickoutCanvas.style.width = `${brickVar.canvasW}px`;
                brickoutCanvas.style.height = `${brickVar.canvasH}px`;
            }
            if (brickoutCanvas2)
			{
                brickVar2.ctx = brickoutCanvas2.getContext('2d');
                brickoutCanvas2.width = brickVar.canvasW;
                brickoutCanvas2.height = brickVar.canvasH;
                brickoutCanvas2.style.width = `${brickVar.canvasW}px`;
                brickoutCanvas2.style.height = `${brickVar.canvasH}px`;
            }
			clearInterval(checkCanvas);
			resolve();

        }, 100);
    });
}

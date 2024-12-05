import gameVar from "./var.js";
import brickVar from "../brickout/var.js";
import brickVar2 from "../brickout/secondBrickout/var.js";


export function initializeCanvas()
{
    return new Promise((resolve) => {
        const checkCanvas = setInterval(() => {
            // Canvas principal Pong
            const pongCanvas = document.getElementById('myCanvas');
            const scoreCanvas = document.getElementById('scoreCanvas');
            
            // Canvas Brickout
            const brickoutCanvas = document.getElementById('brickoutCanvas');
            const brickoutCanvas2 = document.getElementById('brickoutCanvas2');

            if (pongCanvas) {
                gameVar.ctx = pongCanvas.getContext('2d');
                pongCanvas.width = gameVar.canvasW;
                pongCanvas.height = gameVar.canvasH;
            }

            if (scoreCanvas) {
                gameVar.scoreCtx = scoreCanvas.getContext('2d');
                scoreCanvas.width = gameVar.scoreCanvW;
                scoreCanvas.height = gameVar.scoreCanvH;
                scoreCanvas.style.marginBottom = '10px';
            }

            if (brickoutCanvas) {
                brickVar.ctx = brickoutCanvas.getContext('2d');
                brickoutCanvas.width = brickVar.canvasW;
                brickoutCanvas.height = brickVar.canvasH;
                brickoutCanvas.style.width = `${brickVar.canvasW}px`;
                brickoutCanvas.style.height = `${brickVar.canvasH}px`;
            }

            if (brickoutCanvas2) {
                brickVar.ctx2 = brickoutCanvas2.getContext('2d');
                brickoutCanvas2.width = brickVar.canvasW;
                brickoutCanvas2.height = brickVar.canvasH;
                brickoutCanvas2.style.width = `${brickVar.canvasW}px`;
                brickoutCanvas2.style.height = `${brickVar.canvasH}px`;
            }

            // Si au moins un canvas est présent, on initialise le timer
            if (pongCanvas || brickoutCanvas) {
                const currentGame = pongCanvas ? gameVar : brickVar;
                currentGame.gameTime = 0;
                currentGame.gameTimer = setInterval(() => {
                    if (currentGame.startTime) {
                        currentGame.gameTime++;
                    }
                }, 1000);

                clearInterval(checkCanvas);
                resolve();
            }
        }, 100); // vérifie toutes les 100ms
    });
}
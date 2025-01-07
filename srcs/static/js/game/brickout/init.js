import brickVar from "./var.js";
import { PADDLE_POSX } from "../pong/const.js";
import brickVar2 from "./secondBrickout/var.js";
import { keyDownHandlerB, keyUpHandlerB } from "./control.js";
import { startBallB as startBallFirst } from './ball.js';
import { startBallB as startBallSecond } from './secondBrickout/ball.js'
import { startGameB as startGameFirst} from './control.js';
import { startGameB as startGameSecond } from './secondBrickout/control.js';
import { initBricksB as initBricksFirst } from "./brick.js";
import { initBricksB as initBricksSecond } from "./secondBrickout/brick.js";

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
            keyDownHandlerB(e);
        }
    });
    document.addEventListener("keyup", (e) => {
        if (e.code === "ArrowRight" || e.code === "ArrowLeft" || e.code === 'KeyA' || e.code === 'KeyD') {
            keyUpHandlerB(e);
        }
    });
}

export function initGame()
{
	brickVar.initialize = true;

	if (brickVar.currLevel === 'classic')
	{
		initBricksFirst(brickVar.PATTERNS.CLASSIC);
		startGameFirst("classic");
	}
	else if (brickVar.currLevel === 'castle')
	{
		initBricksFirst(brickVar.PATTERNS.CASTLE)
		startGameFirst("castle");
	}	
	else if (brickVar.currLevel === 'x')
	{
		initBricksFirst(brickVar.PATTERNS.X);
		startGameFirst('x');
	}
	else if (brickVar.currLevel === 'invader')
	{
		initBricksFirst(brickVar.PATTERNS.INVADER);
		startGameFirst('invader');
	}
	else
	{
		initBricksFirst(brickVar.PATTERNS.CLASSIC);
		startGameFirst('classic');
	}
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

}
export function startBrickGame2p()
{
	const level = brickVar.currLevel || 'classic';
	initBricksFirst(brickVar.PATTERNS[level.toUpperCase()]);
	initBricksSecond(brickVar2.PATTERNS[level.toUpperCase()]);

	startGameFirst(level);
	startGameSecond(level);
}
function removeEventListenersB()
{
    document.removeEventListener("keydown", keyDownHandlerB);
    document.removeEventListener("keyup", keyUpHandlerB);
    document.removeEventListener("keydown", startBallFirst);
    document.removeEventListener("keydown", startBallSecond);
}


export function initPaddlesPosB()
{
    brickVar.paddleX = PADDLE_POSX;
    brickVar2.paddleX = PADDLE_POSX;
}
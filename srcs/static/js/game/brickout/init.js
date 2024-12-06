import brickVar from "./var.js";
import { keyDownHandlerB, keyUpHandlerB } from "./control.js";
import { startBallB as startBallFirst } from './ball.js';
import { startBallB as startBallSecond } from './secondBrickout/ball.js'
import { startGameB as startGameFirst} from './control.js';
import { startGameB as startGameSecond } from './secondBrickout/control.js';
import { updateSettingSelectionForSecond } from "./update.js";
import { checkSettingB } from "./settings.js";
import brickVar2 from "./secondBrickout/var.js";
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

	brickVar.initialize = true;
	if (brickVar.currLevel === 'classic')
		startGameFirst("classic");
	else if (brickVar.currLevel === 'castle')
		startGameFirst("castle");
	else if (brickVar.currLevel === 'x')
		startGameFirst('x');
	else if (brickVar.currLevel === 'invader')
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
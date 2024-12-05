import brickVar from "./var.js";
import { keyDownHandlerB, keyUpHandlerB } from "./control.js";
import { startBallB as startBallFirst } from './ball.js';
import { startBallB as startBallSecond } from './secondBrickout/ball.js'
import { startGameB as startGameFirst} from './control.js';
import { startGameB as startGameSecond } from './secondBrickout/control.js';
import { updateSettingSelectionForSecond } from "./update.js";
import { checkSettingB } from "./settings.js";

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
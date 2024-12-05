import brickVar2 from "./var.js";
import { startBallB } from "./ball.js";
import { keyDownHandlerB, keyUpHandlerB } from "./control.js";
import { startGameB } from "./control.js";

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
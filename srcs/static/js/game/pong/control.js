import { keyDownHandler, keyUpHandler, startBallLive, startBall } from "./input.js";
import { removeEventListeners } from "./init.js";

export function initControlLive()
{
	document.addEventListener("keydown", (e) => {
        if (e.code === "Space")
		{
            startBallLive(e);
        }
    });

    document.addEventListener("keydown", (e) => {
        if (e.code === "ArrowUp" || e.code === "ArrowDown")
		{
            keyDownHandler(e);
        }
    });

    document.addEventListener("keyup", (e) => {
        if (e.code === "ArrowUp" || e.code === "ArrowDown")
		{
            keyUpHandler(e);
        }
    });
}
export function initControl(local)
{
	removeEventListeners();
	document.addEventListener("keydown", (e) => {
		if (e.code === "Space")
		{
			startBall(e);
		}
	});

	document.addEventListener("keydown", (e) => {
		if (e.code === "ArrowUp" || e.code === "ArrowDown" || e.code === "KeyW" || e.code === "KeyS")
		{
			keyDownHandler(e, local);
		}
	});

	document.addEventListener("keyup", (e) => {
		if (e.code === "ArrowUp" || e.code === "ArrowDown" || e.code === "KeyW" || e.code === "KeyS")
		{
			keyUpHandler(e, local);
		}
	});

	document.addEventListener("keydown", (e) => {
		if (e.code === 'Enter')
		{
			startBall(e);
		}
	})
}
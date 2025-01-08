import gameVar from "./var.js";
import { keyDownHandler, keyUpHandler, startBallLive, startBall } from "./input.js";

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

function removeEventListeners()
{
    if (gameVar.eventHandlers.keydown)
        document.removeEventListener("keydown", gameVar.eventHandlers.keydown);
    if (gameVar.eventHandlers.keyup) 
        document.removeEventListener("keyup", gameVar.eventHandlers.keyup);
    if (gameVar.eventHandlers.startBall) 
        document.removeEventListener("keydown", gameVar.eventHandlers.startBall);
}

export function initControl(local)
{
    removeEventListeners();
    gameVar.eventHandlers.startBall = (e) =>
	{
        if (e.code === "Space" || e.code === "Enter")
            startBall(e);
    };

    gameVar.eventHandlers.keydown = (e) =>
	{
        if (e.code === "ArrowUp" || e.code === "ArrowDown" || 
            e.code === "KeyW" || e.code === "KeyS")
            keyDownHandler(e, local);
    };

    gameVar.eventHandlers.keyup = (e) =>
	{
        if (e.code === "ArrowUp" || e.code === "ArrowDown" || 
            e.code === "KeyW" || e.code === "KeyS")
            keyUpHandler(e, local);
    };

    document.addEventListener("keydown", gameVar.eventHandlers.startBall);
    document.addEventListener("keydown", gameVar.eventHandlers.keydown);
    document.addEventListener("keyup", gameVar.eventHandlers.keyup);
}
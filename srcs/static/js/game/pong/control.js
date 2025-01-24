import gameVar from "./var.js";
import { keyDownHandler, keyUpHandler, startBallLive, startBall } from "./input.js";

function removeAllTouchEvent()
{
    document.removeEventListener("keydown", keyDownHandler);
    document.removeEventListener("keydown", (e) => keyDownHandler(e, true));
    document.removeEventListener("keydown", (e) => keyDownHandler(e, false));
    document.removeEventListener("keyup", keyUpHandler);
    document.removeEventListener("keyup", (e) => keyUpHandler(e, true));
    document.removeEventListener("keyup", (e) => keyUpHandler(e, false));
    document.removeEventListener("keydown", startBall);
    document.removeEventListener("keydown", startBallLive);
    
    if (gameVar.eventHandlers.keydown)
        document.removeEventListener("keydown", gameVar.eventHandlers.keydown);
    if (gameVar.eventHandlers.keyup)
        document.removeEventListener("keyup", gameVar.eventHandlers.keyup);
    if (gameVar.eventHandlers.startBall)
        document.removeEventListener("keydown", gameVar.eventHandlers.startBall);
    
    gameVar.eventHandlers = {
        keydown: null,
        keyup: null,
        startBall: null
    };
}


export function initControl()
{
    removeAllTouchEvent();
    if (gameVar.localGame)
    {
        gameVar.eventHandlers.startBall = startBall;
        gameVar.eventHandlers.keydown = (e) => keyDownHandler(e, true);
        gameVar.eventHandlers.keyup = (e) => keyUpHandler(e, true);
    }
    else if (gameVar.liveMatch)
    {
        gameVar.eventHandlers.startBall = startBallLive;
        gameVar.eventHandlers.keydown = (e) => keyDownHandler(e, false);
        gameVar.eventHandlers.keyup = (e) => keyUpHandler(e, false);
    }
    else
    {
        gameVar.eventHandlers.startBall = startBall;
        gameVar.eventHandlers.keydown = (e) => keyDownHandler(e, false);
        gameVar.eventHandlers.keyup = (e) => keyUpHandler(e, false);
    }

    document.addEventListener("keydown", gameVar.eventHandlers.startBall);
    document.addEventListener("keydown", gameVar.eventHandlers.keydown);
    document.addEventListener("keyup", gameVar.eventHandlers.keyup);
}
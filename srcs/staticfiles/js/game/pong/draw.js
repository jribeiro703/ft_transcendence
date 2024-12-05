import gameVar from "./var.js";
import { drawPowerUp, collectPowerUp, updatePowerUp, newPowerUp } from "./powerUp.js";
import { manageServer } from "./manage.js";
import { manageCollisionLive, manageRealCollision } from "./collision.js";
import { aiMove} from "./ai.js";
import { drawFootball } from "./foot.js";
import { drawTennisCourt, drawLines} from "./tennis.js";
import { manageMoveLive, manageMove } from './movement.js';
import { drawBall } from "./ball.js";
import { checkPaddles } from "./paddle.js";
import { drawScoreBoard } from "./score.js";

export function initDraw()
{
	drawBall();
	checkPaddles();
	drawScoreBoard();
	if (gameVar.currentLevel === 'tableTennis')
		drawLines();	
	else if (gameVar.currentLevel === 'football')
		drawFootball();
	else if (gameVar.currentLevel === 'tennis')
		drawTennisCourt();
}

export function draw()
{
	gameVar.ctx.clearRect(0, 0, gameVar.canvasW, gameVar.canvasH);
	initDraw();
	if (gameVar.gameStart)
	{
		manageRealCollision();
		drawPowerUp();
		collectPowerUp();
		updatePowerUp();
	}
	else
		manageServer();
	manageMove();
	aiMove(gameVar.targetY);
	if (gameVar.animationFrame)
		cancelAnimationFrame(gameVar.animationFrame);
	gameVar.animationFrame = requestAnimationFrame(draw);
}

export function drawLive()
{
	if (gameVar.clientLeft)
	{
		kickOut();
		return ;
	}
	gameVar.ctx.clearRect(0, 0, gameVar.canvasW, gameVar.canvasH);
	initDraw();
	if (gameVar.gameStart)
		manageCollisionLive();
	else
		manageServer();
	manageMoveLive();
	if (gameVar.animationFrame)
		cancelAnimationFrame(gameVar.animationFrame);
	gameVar.animationFrame = requestAnimationFrame(drawLive);	
}
export function kickOut()
{
	cancelAnimationFrame(gameVar.animationFrame);
	gameVar.ctx.clearRect(0, 0, gameVar.canvasW, gameVar.canvasH);
	gameVar.ctx.font = "35px Arial";
	gameVar.ctx.fillStyle = "red";	
	gameVar.ctx.fillText("Opponent has rage quit" , gameVar.canvasW / 4, gameVar.canvasH / 6);
	addBtn();
}


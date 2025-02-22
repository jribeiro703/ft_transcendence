import gameVar from "./var.js";
import brickVar from "../brickout/var.js";
import { drawPowerUp, collectPowerUp, updatePowerUp } from "./powerUp.js";
import { manageServer } from "./manage.js";
import { manageCollisionLive, manageRealCollision } from "./collision.js";
import { aiMove, drawPredictionPath } from "./ai.js";
import { drawFootball } from "./foot.js";
import { drawTennisCourt, drawLines} from "./tennis.js";
import { manageMoveLive, manageMove } from './movement.js';
import { drawBall } from "./ball.js";
import { checkPaddles } from "./paddle.js";
import { checkScore, drawScoreBoard, drawScoreBoardLive } from "./score.js";
import { updateCanvasColor } from "./update.js";
import { delRooms } from "./room.js";
import { listenBtn } from "./reset.js";

export function initDraw()
{
	if (gameVar.ctx)
	{
		gameVar.ctx.clearRect(0, 0, gameVar.canvasW, gameVar.canvasH);
		if (gameVar.currentLevel === 'tableTennis')
			drawLines();	
		else if (gameVar.currentLevel === 'football')
			drawFootball();
		else if (gameVar.currentLevel === 'tennis')
			drawTennisCourt();
		else if (gameVar.currentLevel === 'classicPong')
			drawClassicPong();
		updateCanvasColor();
		drawBall();
		checkPaddles();
		if (gameVar.liveMatch)
		{
			drawScoreBoardLive();
			// checkScore();
		}
		else
		{
			if (!gameVar.finishGame)
				drawScoreBoard();
		}
	}
}

export function managePu()
{
	drawPowerUp();
	collectPowerUp();
	updatePowerUp();
}

export function draw()
{
	initDraw();
	drawPredictionPath(gameVar.ctx);
	if (gameVar.gameStart)
	{
		manageRealCollision();
		managePu();
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
	if (gameVar.game === 'pong')
	{
		cancelAnimationFrame(gameVar.animationFrame);
		gameVar.ctx.clearRect(0, 0, gameVar.canvasW, gameVar.canvasH);
		gameVar.ctx.font = "35px Arial";
		gameVar.ctx.fillStyle = "red";	
		gameVar.ctx.fillText("Opponent has rage quit..." , gameVar.canvasW / 4, gameVar.canvasH / 3);
		if (gameVar.tournament)
		{
			gameVar.ctx.fillText("You won the match by forfeit!", gameVar.canvasW / 4, (gameVar.canvasH / 3) + 50);
		}
	}
	else if (gameVar.game === 'brickout')
	{
		cancelAnimationFrame(brickVar.anim);
		brickVar.ctx.clearRect(0, 0, brickVar.canvasW, brickVar.canvasH);
		brickVar.ctx.font = "35px Arial";
		brickVar.ctx.fillStyle = "red";	
		brickVar.ctx.fillText("Opponent has rage quit..." , brickVar.canvasW / 4, brickVar.canvasH / 3);
	}
	delRooms();
	if (gameVar.returnLobby && gameVar.quitGameBtn)
	{
		gameVar.quitGameBtn.style.display = 'block';
		listenBtn();
	}
}

function drawClassicPong()
{
    gameVar.ctx.setLineDash([10, 11]);
	gameVar.ctx.strokeStyle = "white";
    gameVar.ctx.lineWidth = 10;
    
    gameVar.ctx.beginPath();
    gameVar.ctx.moveTo(gameVar.canvasW / 2, 0 + 5);
    gameVar.ctx.lineTo(gameVar.canvasW / 2, gameVar.canvasH);
    gameVar.ctx.stroke();
    
    gameVar.ctx.setLineDash([]); 
    
	gameVar.ctx.beginPath();
	gameVar.ctx.lineWidth = 15;
	gameVar.ctx.moveTo(0, 0);
	gameVar.ctx.lineTo(gameVar.canvasW, 0);
	gameVar.ctx.stroke();

	gameVar.ctx.beginPath();
	gameVar.ctx.lineWidth = 15;
	gameVar.ctx.moveTo(0, gameVar.canvasH);
	gameVar.ctx.lineTo(gameVar.canvasW, gameVar.canvasH);
	gameVar.ctx.stroke();
}

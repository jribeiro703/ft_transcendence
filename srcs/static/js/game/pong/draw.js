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
import { updateCanvasColor } from "./update.js";

export function initDraw()
{
	drawBall();
	checkPaddles();
	drawScoreBoard();
	// gameVar.currentLevel = 'classic';
	if (gameVar.currentLevel === 'tableTennis')
		drawLines();	
	else if (gameVar.currentLevel === 'football')
		drawFootball();
	else if (gameVar.currentLevel === 'tennis')
		drawTennisCourt();
	else if (gameVar.currentLevel === 'classic')
	{
		drawClassicPong();
		updateCanvasColor()
	}

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

function drawClassicPong()
{
    // Style pour la ligne centrale pointillée
    gameVar.ctx.setLineDash([10, 15]); // Crée une ligne pointillée [longueur_trait, espace]
    gameVar.ctx.strokeStyle = "white";
    gameVar.ctx.lineWidth = 10;
    
    // Dessine la ligne centrale verticale
    gameVar.ctx.beginPath();
    gameVar.ctx.moveTo(gameVar.canvasW / 2, 0);
    gameVar.ctx.lineTo(gameVar.canvasW / 2, gameVar.canvasH);
    gameVar.ctx.stroke();
    
    // Réinitialise le style pour les bordures (ligne pleine)
    gameVar.ctx.setLineDash([]); 
    
    // Dessine les bordures
    gameVar.ctx.strokeRect(0, 0, gameVar.canvasW, gameVar.canvasH);
}
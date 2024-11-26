import brickVar from "./var.js";

export function drawBallB()
{
	const x = brickVar.x - brickVar.ballRadius;
    const y = brickVar.y - brickVar.ballRadius;
    const gradient = brickVar.ctx.createLinearGradient
	(
        x, y,                                         
        x + brickVar.ballRadius * 2,
        y + brickVar.ballRadius * 2                 
    );

	gradient.addColorStop(0, "#FFFFFF");
	gradient.addColorStop(0.2, "#E0E0E0");
    gradient.addColorStop(0.5, "#808080");
	gradient.addColorStop(0.8, "#404040"); 
    gradient.addColorStop(1, "#000000");   

    brickVar.ctx.beginPath();
    brickVar.ctx.arc(brickVar.x, brickVar.y, brickVar.ballRadius, 0, Math.PI*2);
    brickVar.ctx.fillStyle = gradient;
    brickVar.ctx.fill();
    brickVar.ctx.closePath();
}

export function drawPaddleB()
{
    const y = brickVar.canvasH - brickVar.paddleHeight;
    const radius = brickVar.paddleHeight / 2 + 3;
    brickVar.ctx.beginPath();
    brickVar.ctx.moveTo(brickVar.paddleX + radius, y);
    brickVar.ctx.lineTo(brickVar.paddleX + brickVar.paddleWidth - radius, y);
    brickVar.ctx.lineTo(brickVar.paddleX + brickVar.paddleWidth - radius, y);
    brickVar.ctx.arc(brickVar.paddleX + brickVar.paddleWidth - radius, y + radius, radius, -Math.PI / 2, Math.PI / 2);
    brickVar.ctx.lineTo(brickVar.paddleX + radius, y + brickVar.paddleHeight); 
    brickVar.ctx.arc(brickVar.paddleX + radius, y + radius, radius, Math.PI / 2, 1.5 * Math.PI);
    brickVar.ctx.fillStyle = "#0095DD";
    brickVar.ctx.fill();
    brickVar.ctx.closePath();
}

export function drawScoreB()
{
    brickVar.ctx.font = "16px Arial";
    brickVar.ctx.fillStyle = "grey";
    brickVar.ctx.fillText("Score: "+brickVar.score, 8, 20);
}

export function drawLivesB()
{
    brickVar.ctx.font = "16px Arial";
    brickVar.ctx.fillStyle = "grey";
    brickVar.ctx.fillText("Lives: "+brickVar.lives, brickVar.canvasW - 65, 20);
}
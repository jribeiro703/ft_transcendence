import gameVar from "../var.js";
import brickVar2 from "./var.js";

export function drawBallB()
{
	const x = brickVar2.x - brickVar2.ballRadius;
    const y = brickVar2.y - brickVar2.ballRadius;
    const gradient = brickVar2.ctx.createLinearGradient
	(
        x, y,                                         
        x + brickVar2.ballRadius * 2,
        y + brickVar2.ballRadius * 2                 
    );

	gradient.addColorStop(0, "#FFFFFF");
	gradient.addColorStop(0.2, "#E0E0E0");
    gradient.addColorStop(0.5, "#808080");
	gradient.addColorStop(0.8, "#404040"); 
    gradient.addColorStop(1, "#000000");   

    brickVar2.ctx.beginPath();
    brickVar2.ctx.arc(brickVar2.x, brickVar2.y, brickVar2.ballRadius, 0, Math.PI*2);
    brickVar2.ctx.fillStyle = gradient;
    brickVar2.ctx.fill();
    brickVar2.ctx.closePath();
}

export function drawPaddleB()
{
    const y = brickVar2.canvasH - brickVar2.paddleHeight;
    const radius = brickVar2.paddleHeight / 2 + 3;
    brickVar2.ctx.beginPath();
    brickVar2.ctx.moveTo(brickVar2.paddleX + radius, y);
    brickVar2.ctx.lineTo(brickVar2.paddleX + brickVar2.paddleWidth - radius, y);
    brickVar2.ctx.lineTo(brickVar2.paddleX + brickVar2.paddleWidth - radius, y);
    brickVar2.ctx.arc(brickVar2.paddleX + brickVar2.paddleWidth - radius, y + radius, radius, -Math.PI / 2, Math.PI / 2);
    brickVar2.ctx.lineTo(brickVar2.paddleX + radius, y + brickVar2.paddleHeight); 
    brickVar2.ctx.arc(brickVar2.paddleX + radius, y + radius, radius, Math.PI / 2, 1.5 * Math.PI);
    brickVar2.ctx.fillStyle = "#0095DD";
    brickVar2.ctx.fill();
    brickVar2.ctx.closePath();
}

// export function drawScoreB()
// {
//     brickVar2.ctx.font = "16px Arial";
//     brickVar2.ctx.fillStyle = "grey";
//     brickVar2.ctx.fillText("Score: "+brickVar2.score, 8, 20);
// }

// export function drawLivesB()
// {
//     brickVar2.ctx.font = "16px Arial";
//     brickVar2.ctx.fillStyle = "grey";
//     brickVar2.ctx.fillText("Lives: "+brickVar2.lives, brickVar2.canvasW - 65, 20);
// }

function loadCustomFont()
{
    return new FontFace('fontScore', 'url(/static/css/font/scoreboard-webfont.woff2)');
}


export function drawScoreBoardB()
{

    loadCustomFont().load().then(function(font) 
	{
        document.fonts.add(font);
		const ctx = brickVar2.scoreCtx;
		ctx.clearRect(0, 0, brickVar2.scoreCanvW, brickVar2.scoreCanvH);
		
		ctx.font = '24px fontScore';
		ctx.fillStyle = '#FFFFFF';
		ctx.textAlign = 'center';
		
		const centerX = brickVar2.scoreCanvW / 2;
		const leftX = brickVar2.scoreCanvW * 0.25;
		const rightX = brickVar2.scoreCanvW * 0.75;
		const y = 35;

		ctx.fillText('Score', leftX, y);
		ctx.fillText('Lives', rightX, y);

		ctx.font = '32px fontScore';
		ctx.fillText(brickVar2.score, leftX, y + brickVar2.scoreCanvH / 2);
		ctx.fillText(brickVar2.lives, rightX, y + brickVar2.scoreCanvH / 2);
		const minutes = Math.floor(brickVar2.gameTime / 60);
		const seconds = brickVar2.gameTime % 60;
		const time = `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
		ctx.font = '20px fontScore';
		ctx.fillText(time, centerX, y + brickVar2.scoreCanvH / 2);
	}).catch(function(error)
	{
		console.error("Error on font load", error);
	});
}
import gameVar from "../var.js";
import brickVar from "./var.js";
import brickVar2 from "./secondBrickout/var.js";

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

// export function drawScoreB()
// {
//     brickVar.ctx.font = "16px Arial";
//     brickVar.ctx.fillStyle = "grey";
//     brickVar.ctx.fillText("Score: "+brickVar.score, 8, 20);
// }

// export function drawLivesB()
// {
//     brickVar.ctx.font = "16px Arial";
//     brickVar.ctx.fillStyle = "grey";
//     brickVar.ctx.fillText("Lives: "+brickVar.lives, brickVar.canvasW - 65, 20);
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
		const ctx = brickVar.scoreCtx;
		ctx.clearRect(0, 0, brickVar.scoreCanvW, brickVar.scoreCanvH + 100);
		
		ctx.font = '24px fontScore';
		ctx.fillStyle = '#FFFFFF';
		ctx.textAlign = 'center';
		
		const centerX = brickVar.scoreCanvW / 2;
		const leftX = brickVar.scoreCanvW * 0.25;
		const rightX = brickVar.scoreCanvW * 0.75;
		const y = 35;

		if (gameVar.game == 'brickout2p')
		{
			ctx.fillText("Player 1", leftX - 5, y);
			ctx.fillText("Score" , leftX - 15, y + 60);
			ctx.fillText("Lives", leftX - 15, y + 100);
			ctx.fillText("Player 2", rightX + 15, y)
			ctx.fillText("Score" , rightX, y + 60);
			ctx.fillText("Lives", rightX, y + 100);
			ctx.fillText(brickVar.score, leftX + 45, y + 60);
			ctx.fillText(brickVar.lives, leftX + 45, y + 100);
			ctx.fillText(brickVar2.score, rightX + 60, y + 60);
			ctx.fillText(brickVar2.lives, rightX + 60, y + 100);

			ctx.font = '32px fontScore';
			ctx.fillText("VS", centerX, (brickVar.scoreCanvH) / 2);

			const minutes = Math.floor(brickVar.gameTime / 60);
			const seconds = brickVar.gameTime % 60;
			const time = `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
			ctx.font = '20px fontScore';
			ctx.fillText(time, leftX - 10, y + brickVar.scoreCanvH + 45);
		
			const minutes2 = Math.floor(brickVar2.gameTime / 60);
			const seconds2 = brickVar2.gameTime % 60;
			const time2 = `${minutes2}:${seconds2 < 10 ? '0' : ''}${seconds2}`;
			ctx.font = '20px fontScore';
			ctx.fillText(time2, rightX + 10, y + brickVar.scoreCanvH + 45);

		}
		else
		{
			ctx.font = '32px fontScore';
			ctx.fillText('Score', leftX, y);
			ctx.fillText('Lives', rightX, y);
			ctx.fillText(brickVar.score, leftX, y + brickVar.scoreCanvH / 2);
			ctx.fillText(brickVar.lives, rightX, y + brickVar.scoreCanvH / 2);	
			ctx.fillText(brickVar.score, leftX, y + brickVar.scoreCanvH / 2);
			ctx.fillText(brickVar.lives, rightX, y + brickVar.scoreCanvH / 2);
			const minutes = Math.floor(brickVar.gameTime / 60);
			const seconds = brickVar.gameTime % 60;
			const time = `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
			ctx.font = '20px fontScore';
			ctx.fillText(time, centerX, y + brickVar.scoreCanvH / 2);
		}


	}).catch(function(error)
	{
		console.error("Error on font load", error);
	});
}
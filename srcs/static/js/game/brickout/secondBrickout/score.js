import brickVar from "../var.js";
import brickVar2 from "./var.js";
import gameVar from "../../pong/var.js";
import { levelDisplayB } from "./level.js";
import { addBtnB } from "./manage.js";
import { compareScore } from "../score.js";

function loadCustomFont()
{
    return new FontFace('fontScore', 'url(/static/css/font/scoreboard-webfont.woff2)');
}

export function youWinB()
{
	if (!brickVar2.finish)
	{
		loadCustomFont().load().then(function(font) 
		{
			brickVar2.ctx.font = 'bold 24px fontScore';
			brickVar2.ctx.fillStyle = "#66a5e8";
			brickVar2.ctx.fillText("Congratulations, you win !!", brickVar2.canvasW / 2 - 200, brickVar2.canvasH / 2);

		}).catch(function(error)
		{
			console.error("Error on font load", error);
		});	
	}
	if (!gameVar.liveMatch && !gameVar.localGame)
		levelDisplayB();
	else if (gameVar.liveMatch)
		chechOpponentRemote();
	else if (gameVar.localGame)
	{
		chechOpponent();
		if ((brickVar.lives === 0 || brickVar.finishLevel) && (brickVar2.lives === 0 || brickVar2.finishLevel))
			addBtnB();
	}
	else
		addBtnB();
}
// export function youWinB()
// {
// 	if (!brickVar2.finish)
// 	{
// 		brickVar2.ctx.font = "35px Arial";
//     	brickVar2.ctx.fillStyle = "red";
//     	brickVar2.ctx.fillText("Congratulations, you win !!", brickVar2.canvasW / 2 - 200, brickVar2.canvasH / 2);
// 	}
// 	levelDisplayB();
// 	addBtnB();
// }

export function saveScoreB()
{
	var levelScore = 0;
	if (brickVar2.currLevel === 'classic')
		levelScore = 0;
	if (brickVar2.currLevel === 'castle')
		levelScore = 104;
	else if (brickVar2.currLevel === 'x')
		levelScore = 104 + 169;
	else if (brickVar2.currLevel === 'invader')
		levelScore = 104 + 169 + 169;
	brickVar2.finalScore = brickVar2.score + levelScore;
}

export function drawScoreBoardB()
{
	if (!brickVar2.scoreCtx || !brickVar2.ctx)
	{
		console.log("Error on ctx2");
		return;
	}
	
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
export function chechOpponent()
{
	let display = false;
	if (gameVar.localGame)
	{
		const waiting = setInterval(() =>
		{
			if ((brickVar.startTime === true || brickVar.gameTime < 1) && (!brickVar.finishLevel))
			{
				if (!display)
				{
					display = true;
					brickVar2.ctx.clearRect(0, 0, brickVar2.canvasW, brickVar2.canvasH);
					brickVar2.ctx.font = 'bold 24px fontScore';
					brickVar2.ctx.fillStyle = '#66a5e8';
					brickVar2.ctx.textAlign = 'left';
					brickVar2.ctx.fillText("Waiting for opponent to finish...", brickVar2.canvasW / 4, brickVar2.canvasH / 2 - 100);
					brickVar2.ctx.fillText("Your final score :" , brickVar2.canvasW / 4, brickVar2.canvasH / 2);
					brickVar2.ctx.fillText(brickVar2.score, brickVar2.canvasW / 4 + 250, (brickVar2.canvasH / 2));
				}
			}
			else
			{
				if (brickVar.gameTime > 2)
				{
					clearInterval(waiting);
					compareScore();
				}	
			}
		}, 1000);
	}
}
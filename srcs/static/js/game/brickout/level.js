import brickVar from "./var.js";
import { initGame, initListenerB } from "./init.js";
import { initBricksB } from "./brick.js";
import { sendScoreB } from "./score.js";
import { startGameB } from "./control.js";

export function youWinB()
{
	if (!brickVar.finish)
	{
		brickVar.ctx.font = "35px Arial";
    	brickVar.ctx.fillStyle = "red";
    	brickVar.ctx.fillText("Congratulations, you win !!", brickVar.canvasW / 2 - 200, brickVar.canvasH / 2);
	}
	levelDisplayB();
	addBtnB();
}

export function checkLevelB(level)
{
	if (level == "classic")
		initBricksB(brickVar.PATTERNS.CLASSIC);
	else if (level == "castle")
		initBricksB(brickVar.PATTERNS.CASTLE);
	else if (level == 'x')
		initBricksB(brickVar.PATTERNS.X);
	else if (level == 'invader')
		initBricksB(brickVar.PATTERNS.INVADER);
}

export function levelDisplayB()
{
	brickVar.ctx.font = "35px Arial";
    brickVar.ctx.fillStyle = "white";

	if (brickVar.currLevel == "classic")
		brickVar.ctx.fillText("Next Level : The Castle", brickVar.canvasW / 2 - 180, brickVar.canvasH / 2 + 150);
	if (brickVar.currLevel == "castle")
		brickVar.ctx.fillText("Next Level : X ", brickVar.canvasW / 2 - 100, brickVar.canvasH / 2 + 150);
	if (brickVar.currLevel == "x")
		brickVar.ctx.fillText("Next Level : Space Invader", brickVar.canvasW / 2 - 200, brickVar.canvasH / 2 + 150);
	if (brickVar.currLevel == "invader")
	{
		brickVar.finish = true;
		brickVar.finalScore = 104 + 169 + 169 + 169;
		brickVar.ctx.fillText("You have finish the game, Nice ! Score : " +brickVar.finalScore , brickVar.canvasW / 2 - 220, brickVar.canvasH / 6);
		sendScoreB();
		addImageB("/static/css/images/ms.png");
	}
}

export function addImageB(url)
{
	const mainContent = document.getElementById("brickoutCanvas");
	const msUrl = url;
	if (!mainContent)
	{
		console.error("Container element not found!");
		return;
	}
	const mickeal = document.createElement('div');
	mickeal.innerHTML = `
	<div = id="mickeal">
		<img id="mScot" src="${msUrl}" width="380" height"300">
	</div>
	`;
	mainContent.appendChild(mickeal);

	const image = new Image();
    image.src = msUrl;
    image.onload = () =>
	{
        const imgWidth = 380;
        const imgHeight = 300;
        const x = (brickVar.canvasW - imgWidth) / 2;
        const y = (brickVar.canvasH - imgHeight) / 2 + 50;
        brickVar.ctx.drawImage(image, x, y, imgWidth, imgHeight);
    };

    image.onerror = () =>
	{
        console.error("Error loading image");
    };
}

export function handleNextLevelB()
{
	clearBtnB();
	initListenerB();
	initGame();
	const nextLevelBtn = document.getElementById("nextLevelBtn");
    if (nextLevelBtn)
	{
        nextLevelBtn.disabled = true;
        nextLevelBtn.removeEventListener("click", handleNextLevelB);
    }
	brickVar.initGame = false;
	brickVar.gameStart = false;
	brickVar.finishLevel = false;
	brickVar.score = 0;
	if (brickVar.currLevel == 'classic')
		startGameB("castle");
	else if (brickVar.currLevel == 'castle')
		startGameB("x");
	else if (brickVar.currLevel == 'x')
		startGameB("invader");
	else if (brickVar.currLevel == 'invader')
		return;
}

export function restartLevelB()
{
	clearBtnB();
	initListenerB();
	initGame();	
	brickVar.initGame = false;
	brickVar.gameStart = false;
	brickVar.finishLevel = false;
	brickVar.score = 0;

	if (brickVar.currLevel === 'classic')
		startGameB('classic')
	else if (brickVar.currLevel === 'castle')
		startGameB('castle');
	else if (brickVar.currLevel === 'x')
		startGameB('x');
	else if (brickVar.currLevel === 'invader')
		startGameB('invader');
}
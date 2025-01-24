import brickVar2 from "./var.js";
import { initBricksB } from "./brick.js";
import { initListenerB } from "./init.js";
import { startGameB } from "./control.js";

export function checkLevelB(level)
{
	if (level == "classic")
		initBricksB(brickVar2.PATTERNS.CLASSIC);
	else if (level == "castle")
		initBricksB(brickVar2.PATTERNS.CASTLE);
	else if (level == 'x')
		initBricksB(brickVar2.PATTERNS.X);
	else if (level == 'invader')
		initBricksB(brickVar2.PATTERNS.INVADER);
}

export function levelDisplayB()
{
	brickVar2.ctx.font = "35px Arial";
    brickVar2.ctx.fillStyle = "white";

	if (brickVar2.currLevel == "classic")
		brickVar2.ctx.fillText("Next Level : The Castle", brickVar2.canvasW / 2 - 180, brickVar2.canvasH / 2 + 150);
	if (brickVar2.currLevel == "castle")
		brickVar2.ctx.fillText("Next Level : X ", brickVar2.canvasW / 2 - 100, brickVar2.canvasH / 2 + 150);
	if (brickVar2.currLevel == "x")
		brickVar2.ctx.fillText("Next Level : Space Invader", brickVar2.canvasW / 2 - 200, brickVar2.canvasH / 2 + 150);
	if (brickVar2.currLevel == "invader")
	{
		brickVar2.finish = true;
		brickVar2.finalScore = 104 + 169 + 169 + 169;
		brickVar2.ctx.fillText("You have finish the game, Nice ! Score : " +brickVar2.finalScore , brickVar2.canvasW / 2 - 220, brickVar2.canvasH / 6);
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
        const x = (brickVar2.canvasW - imgWidth) / 2;
        const y = (brickVar2.canvasH - imgHeight) / 2 + 50;
        brickVar2.ctx.drawImage(image, x, y, imgWidth, imgHeight);
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
	const nextLevelBtn = document.getElementById("nextLevelBtn");
    if (nextLevelBtn)
	{
        nextLevelBtn.disabled = true;
        nextLevelBtn.removeEventListener("click", handleNextLevelB);
    }
	brickVar2.initGame = false;
	brickVar2.gameStart = false;
	brickVar2.finishLevel = false;
	brickVar2.score = 0;
	if (brickVar2.currLevel == 'classic')
		startGameB("castle");
	else if (brickVar2.currLevel == 'castle')
		startGameB("x");
	else if (brickVar2.currLevel == 'x')
		startGameB("invader");
	else if (brickVar2.currLevel == 'invader')
		return;
}

export function restartLevelB()
{
	clearBtnB();
	initListenerB();
	
	brickVar2.initGame = false;
	brickVar2.gameStart = false;
	brickVar2.finishLevel = false;
	brickVar2.score = 0;

	if (brickVar2.currLevel === 'classic')
		startGameB('classic')
	else if (brickVar2.currLevel === 'castle')
		startGameB('castle');
	else if (brickVar2.currLevel === 'x')
		startGameB('x');
	else if (brickVar2.currLevel === 'invader')
		startGameB('invader');
}
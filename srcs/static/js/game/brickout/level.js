import brickVar from "./var.js";
import { initGame, initListenerB } from "./init.js";
import { initBricksB } from "./brick.js";
import { startGameB } from "./control.js";
import { addBtnB } from "./manage.js";
import { clearBtnB } from "./manage.js";
import { initializeCanvasBrick } from "../pong/canvas.js";
import { initializeScoreCanvasBrickout } from "../pong/canvas.js";
import { displayGameBrickView } from "../pong/display.js";
import gameVar from "../pong/var.js";
import { chechOpponent, chechOpponentRemote, sendScoreB } from "./score.js";
import { resetMatchB } from "./reset.js";

export function youWinB()
{
	if (!gameVar.liveMatch && !gameVar.localGame)
	{
		levelDisplayB();
		addBtnB();
	}
	else if (gameVar.liveMatch)
	{
		chechOpponentRemote();
		if (gameVar.playerIdx === 1 || brickVar.playerIdx === 1)
			sendScoreB()
	}
	else if (gameVar.localGame)
	{
		chechOpponent();
		if (brickVar.playerLives === 0 && brickVar.opponentLives === 0)
			addBtnB();
	}
	else
		addBtnB();
}

export function checkLevelB(level)
{
	if (!level)
		level = brickVar.currLevel;
	if (!brickVar.currLevel)
		brickVar.currLevel = level;
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
	brickVar.ctx.font = "bold 24px fontScore";
    brickVar.ctx.fillStyle = "white";
	if (brickVar.currLevel !== "invader")
	{
		if (brickVar.currLevel == "classic")
			brickVar.ctx.fillText("Next Level : The Castle", brickVar.canvasW / 2 - 180, 70);
		if (brickVar.currLevel == "castle")
			brickVar.ctx.fillText("Next Level : X ", brickVar.canvasW / 2 - 100, 70);
		if (brickVar.currLevel == "x")
			brickVar.ctx.fillText("Next Level : Space Invader", brickVar.canvasW / 2 - 200, 70);
		addImageB("/static/css/images/mswin.png");
	}
	else if (brickVar.currLevel == "invader")
	{
		brickVar.finish = true;
		brickVar.finalScore = 104 + 169 + 169 + 169;
		brickVar.ctx.fillText("You've finish the game !", brickVar.canvasW / 2 - 190, brickVar.canvasH / 6);
		brickVar.ctx.fillText("Congratulation !", brickVar.canvasW / 2 - 190, brickVar.canvasH / 6 + 30);
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
	<div id="mickeal">
		<img id="mScot" src="${msUrl}" width="550" height="300">
	</div>
	`;
	mainContent.appendChild(mickeal);

	const image = new Image();
    image.src = msUrl;
    image.onload = () =>
	{
        const imgWidth = 550;
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

export async function handleNextLevelB()
{
	clearBtnB();
	displayGameBrickView();
	await initializeCanvasBrick();
	await initializeScoreCanvasBrickout();
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
	brickVar.lives = 5;
	if (brickVar.currLevel == 'classic')
		startGameB("castle");
	else if (brickVar.currLevel == 'castle')
		startGameB("x");
	else if (brickVar.currLevel == 'x')
		startGameB("invader");
	else if (brickVar.currLevel == 'invader')
		return;
}

export async function restartLevelB()
{
	clearBtnB();
	displayGameBrickView();
	await initializeCanvasBrick();
	await initializeScoreCanvasBrickout();
	initListenerB();
	initGame();	
	brickVar.initGame = false;
	brickVar.gameStart = false;
	brickVar.finishLevel = false;
	brickVar.score = 0;
	brickVar.lives = 5;
	if (brickVar.currLevel === 'classic')
		startGameB('classic')
	else if (brickVar.currLevel === 'castle')
		startGameB('castle');
	else if (brickVar.currLevel === 'x')
		startGameB('x');
	else if (brickVar.currLevel === 'invader')
		startGameB('invader');
}
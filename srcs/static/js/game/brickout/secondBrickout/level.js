import brickVar2 from "./var.js";
import { initListenerB } from "./game.js";
import { initBricksB } from "./brick.js";
import { sendScoreB } from "./manage.js";
// import { startGameB } from "./game.js";

export function youWinB()
{
	if (!brickVar2.finish)
	{
		brickVar2.ctx.font = "35px Arial";
    	brickVar2.ctx.fillStyle = "red";
    	brickVar2.ctx.fillText("Congratulations, you win !!", brickVar2.canvasW / 2 - 200, brickVar2.canvasH / 2);
	}
	levelDisplayB();
	addBtnB();
}

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
		sendScoreB();
		addImageB("/static/css/images/ms.png");
	}
}

export function updateLevelSelectionB(level)
{
	if (level === "classic")
	{
		brickVar2.classic = true;
		brickVar2.castle = false;
		brickVar2.x = false;
		brickVar2.invader = false;
	}
	else if (level === "castle")
	{
		brickVar2.classic = false;
		brickVar2.castle = true;
		brickVar2.x = false;
		brickVar2.invader = false;
	}
	else if (level === "x")
	{
		brickVar2.classic = false;
		brickVar2.castle = false;
		brickVar2.x = true;
		brickVar2.invader = false;
	}
	else if (level === "invader")
	{
		brickVar2.classic = false;
		brickVar2.castle = false;
		brickVar2.x = false;
		brickVar2.invader = true;
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

export function addBtnB()
{
	if (!brickVar2.finish)
	{
		const mainContent = document.getElementById("mainContent");
		if (!mainContent)
		{
			console.error("Container element not found!");
			return;
		}
		const btn = document.createElement('div');
		btn.innerHTML = `
			<div class="nextLevel" id="nextLevel">
				<button id="nextLevelBtn">Next Level</button> 
				<button id="restartLevelBtn">Restart Game</button> 
				<button id="quitBtn">Return Home</button>
			</div>
		`;
		mainContent.appendChild(btn);
		checkBtnB('nextLevel');
	}
	else
	{
		const mainContent = document.getElementById("mainContent");
		if (!mainContent)
		{
			console.error("Container element not found!");
			return;
		}
		const btn = document.createElement('div');
		btn.innerHTML = `
		<div class="finish id="finish">
			<button id="restartLevelBtn">Restart Game</button> 
			<button id="quitBtn">Return Home</button>
		</div>
		`;
		mainContent.appendChild(btn);
		checkBtnB("finish");
	}
}



export function checkBtnB(status)
{
	if (status === 'nextLevel')
	{
		const nextLevelBtn = document.getElementById("nextLevelBtn");
		const quitBtn = document.getElementById("quitBtn");
		const restartLevelBtn = document.getElementById("restartLevelBtn")
		if (nextLevelBtn)
			nextLevelBtn.addEventListener("click", handleNextLevelB);
		if (restartLevelBtn)
			restartLevelBtn.addEventListener("click", restartLevelB);
		if (quitBtn)
			quitBtn.addEventListener('click', () => document.location.reload());
	}
	else if (status === 'finish')
	{
		console.log("else check btn");
		const quitBtn = document.getElementById("quitBtn");
		const restartLevelBtn = document.getElementById("restartLevelBtn")
		if (restartLevelBtn)
			restartLevelBtn.addEventListener("click", () => restartLevelB);
		if (quitBtn)
			quitBtn.addEventListener('click', () => document.location.reload());
	}
}
export function clearBtnB()
{
	const nextLevel = document.getElementById("nextLevel");
    if (!nextLevel)
	{
		console.log("next level is null");
        return;
    }
    try
	{
        const nextLevelBtn = document.getElementById("nextLevelBtn");
		const quitBtn = document.getElementById("quitBtn");
        const restartLevelBtn = document.getElementById("restartLevelBtn");
        if (nextLevelBtn)
            nextLevelBtn.removeEventListener("click", handleNextLevelB);
    	if (restartLevelBtn)
            restartLevelBtn.removeEventListener("click", restartLevelB);
		if (quitBtn)
			quitBtn.addEventListener('click', () => document.location.reload());
        nextLevel.parentNode.remove();
    }
	catch (error)
	{
        console.error("Error removing buttons:", error);
    }
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
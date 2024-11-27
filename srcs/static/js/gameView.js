import gameVar from "./var.js";
import brickVar from "./brickout/var.js"
import { SCORE_CANVAS_HEIGHT, SCORE_FONT } from "./const.js";
import { initializeBall } from "./draw.js";
import { newPowerUp, updatePowerUpSelection } from "./powerUp.js";
import { draw } from "./draw.js";
import { resetMatch, checkServer } from "./reset.js";
import { manageAi } from "./ai.js";
import { updateCanvasColor } from "./setting.js";
import { updateDifficultySelection, updateLevelSelection } from "./update.js";
import { listenPlayBtn, listenSettingBtn } from "./listenerSetting.js";
import { initControl } from "./init.js";

export function showGameSelectionView()
{
	gameVar.liveMatch = false;
	initControl();
	history.pushState({ view: 'game'}, '', `?view=solo`);
	const maincontent = document.getElementById('mainContent');
	maincontent.innerHTML = '';
	const gameSelection = document.createElement('div');

	updateImageUrl();

	gameSelection.innerHTML =  `
	<div id="settingView" class="game-selection">
		<h1>Game Selection</h1>
		<div class="container-game">
			<div class="game-row">
				<div class="game-title">
					<h2 id="gameTitle">PONG</h2>
				</div>
				<div class="game-image">
					<img id="gameImage" src="${gameVar.pongUrl}" alt="pongGame">
				</div>
				<div class="game-settings">
					<div id="settingsContainer" class="settings-info">
						<div class="settings-inline">
							<button id="settingBtn1" class="settingsSelect-button">Settings</button>
							<div class="settings-column" id="settings-column">
								<p>Difficulty: <span id="difficultyChoice">Medium</span></p>
								<p>Power-Up: <span id="powerupChoice">❌</span></p>
								<p>Level: <span id="levelSelected">Table Tennis</span></p>
							</div>
						</div>
					</div>
				</div>
				<div class="game-play">
					<button id="playBtn" class="startSelect-button">Play</button>
				</div>
			</div>
			<div class="game-row">
				<div class="game-title2">
					<h2 id="gameTitle2">BRICKOUT</h2>
				</div>
				<div class="game-image">
					<img id="gameImage" src="${gameVar.brickUrl}" alt="brickGame">
				</div>
				<div class="game-settings">
					<div id="settingsContainer" class="settings-info">
						<div class="settings-inline">
							<button id="settingBtn2" class="settingsSelect-button2">Settings</button>
							<div class="settings-column2" id="settings-column2">
								<p>Difficulty: <span id="difficultyChoice2">Medium</span></p>
								<p>Power-Up: <span id="powerupChoice2">❌</span></p>
								<p>Level: <span id="levelSelected2">Classic</span></p>
							</div>
						</div>
					</div>
				</div>
				<div class="game-play">
					<button id="playBtn2" class="startSelect-button">Play</button>
				</div>
			</div>
		</div>
	</div>`;

	maincontent.appendChild(gameSelection);
	gameVar.settingBtn1 = document.getElementById('settingBtn1');
	gameVar.settingBtn2 = document.getElementById('settingBtn2');
	gameVar.playBtn = document.getElementById('playBtn');
	gameVar.playBtn2 = document.getElementById('playBtn2');
	
	listenSettingBtn();
	listenPlayBtn();
}

export function showGameBrickView()
{
	console.log("brickview");
	const mainContent = document.getElementById('mainContent');
	mainContent.innerHTML = '';
	const insertTo = document.createElement('div');
	insertTo.innerHTML = `
	<canvas id="brickoutCanvas"></canvas>
	`;
	mainContent.appendChild(insertTo);
    
	var canvas = document.getElementById("brickoutCanvas");
	if (!canvas)
	{
        console.error("Canvas not found");
        return;
    }
	brickVar.canvas = canvas;
	brickVar.ctx = canvas.getContext("2d");
	canvas.width = brickVar.canvasW;
	canvas.height = brickVar.canvasH;
	canvas.style.width = `${brickVar.canvasW}px`;
    canvas.style.height = `${brickVar.canvasH}px`;

	brickVar.initialize = true;
}

function loadCustomFont()
{
    return new FontFace('fontScore', 'url(static/css/font/scoreboard.ttf)');
}

export function drawScoreBoard()
{

    loadCustomFont().load().then(function(font) 
	{
        document.fonts.add(font);
		const ctx = gameVar.scoreCtx;
		ctx.clearRect(0, 0, gameVar.scoreCanvW, gameVar.scoreCanvH);
		
		ctx.font = '24px fontScore';
		ctx.fillStyle = '#FFFFFF';
		ctx.textAlign = 'center';
		
		const centerX = gameVar.scoreCanvW / 2;
		const leftX = gameVar.scoreCanvW * 0.25;
		const rightX = gameVar.scoreCanvW * 0.75;
		const y = 35;
		if (gameVar.localGame)
		{
			ctx.fillText('Player 1', leftX, y);
			ctx.fillText('Player 2', rightX, y);
		}
		else 
		{
			ctx.fillText('Player', leftX, y);
			ctx.fillText('AI', rightX, y);
		}
		ctx.font = '32px fontScore';
		ctx.fillText(gameVar.playerScore, leftX, y + SCORE_CANVAS_HEIGHT / 2);
		ctx.fillText(gameVar.aiScore, rightX, y + SCORE_CANVAS_HEIGHT / 2);
		ctx.fillText('VS', centerX, y);
		const minutes = Math.floor(gameVar.gameTime / 60);
		const seconds = gameVar.gameTime % 60;
		const time = `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
		ctx.font = '20px fontScore';
		ctx.fillText(time, centerX, y + SCORE_CANVAS_HEIGHT / 2);
	}).catch(function(error)
	{
		console.error("Error on font load", error);
	});
}

export function showGameView()
{
	history.pushState({ view: 'game'}, '', `?view=solo/play`);
	const mainContent = document.getElementById('mainContent');
	mainContent.innerHTML = ``;
	const gameView = document.createElement('div');
	gameView.innerHTML=`
	<div id="gameView" style="display: none;">
		<div id="scoreboard">
			<canvas id="scoreCanvas"></canvas>
		</div>
		<canvas id="myCanvas"></canvas>
		<br><br>
		<div class="button-container">
			<button id="rematchBtn" style="display: none;" disabled>Rematch</button>
			<button id="quitGameBtn" style="display: none;">Return Home</button>
		</div>
	</div>
	`;

	mainContent.appendChild(gameView);

	updateCanvasColor();

	gameVar.rematchBtn = document.getElementById('rematchBtn');	
	gameVar.quitGameBtn = document.getElementById('quitGameBtn');
	gameVar.gameView = document.getElementById('gameView');

	gameVar.gameView.style.display = 'block';

	var canvas = document.getElementById('myCanvas');
	gameVar.ctx = canvas.getContext('2d');
	canvas.width = gameVar.canvasW;
	canvas.height = gameVar.canvasH;

	var scoreCanvas = document.getElementById('scoreCanvas');
	gameVar.scoreCtx = scoreCanvas.getContext('2d');
	scoreCanvas.width = gameVar.scoreCanvW;
	scoreCanvas.height = SCORE_CANVAS_HEIGHT;

	gameVar.gameTime = 0;
    gameVar.gameTimer = setInterval(() =>
	{
        if (gameVar.startTime)
		{
            gameVar.gameTime++;
        }
    }, 1000);

    scoreCanvas.style.marginBottom = '10px';

	startGame();
}
// export function showGameView()
// {
// 	history.pushState({ view: 'game'}, '', `?view=solo/play`);
// 	const mainContent = document.getElementById('mainContent');
// 	mainContent.innerHTML = ``;
// 	const gameView = document.createElement('div');
// 	gameView.innerHTML=`
// 	<div id="gameView" style="display: none;">
// 		<div id="scoreboard">SCORE</div>
// 		<div id="scoreRow">
// 			<span id="player">Player </span>
// 			<span id="playerScore">0</span>
// 			<span id="vs">VS</span>
// 			<span id="aiScore">0</span>
// 			<span id="ai">CPU</span>
// 		</div>
// 		<canvas id="myCanvas"></canvas>
// 		<br><br>
// 		<div class="button-container">
// 			<button id="rematchBtn" style="display: none;" disabled>Rematch</button>
// 			<button id="quitGameBtn" style="display: none;">Quit Game</button>
// 		</div>
// 	</div>
// 	`;

// 	mainContent.appendChild(gameView);

// 	updateCanvasColor();

// 	gameVar.playerScoreElement = document.getElementById('playerScore');
// 	gameVar.aiScoreElement = document.getElementById('aiScore');
// 	gameVar.rematchBtn = document.getElementById('rematchBtn');	
// 	gameVar.quitGameBtn = document.getElementById('quitGameBtn');
// 	gameVar.gameView = document.getElementById('gameView');

// 	gameVar.gameView.style.display = 'block';

// 	var canvas = document.getElementById('myCanvas');
// 	gameVar.ctx = canvas.getContext('2d');
// 	canvas.width = gameVar.canvasW;
// 	canvas.height = gameVar.canvasH;
	// startGame();
// }

export function startGame()
{
	drawScoreBoard();
	initializeBall();
	if (gameVar.powerUpEnable)
	{
		newPowerUp(true, 3000);
		newPowerUp(false, 3000);
	}
	draw();
	manageAi();
}

export function rematchView()
{
	console.log("rematch");
	gameplayView.style.display = 'none';
	quickGameBtn.style.display = 'none';
	startGameBtn.style.display = 'none';

	gameView.style.display = 'block';
	rematchBtn.style.display = 'block';
	rematchBtn.disabled = true;
	quitGameBtn.style.display = 'block';	
	saveScore();
	resetMatch();
	initializeBall();
	if (gameVar.powerUpEnable)
		createPowerUp();
	checkServer();
	manageAi();
	draw();
}

export function saveScore()
{
	const scoreEntry = {
		playerScore: gameVar.playerScore,
		aiscore: gameVar.aiScore
	}
	gameVar.scoreBoard.push(scoreEntry);
}

export function updateImageUrl()
{

	gameVar.pongUrl = "static/css/images/ttLevel.png";
	if (gameVar.football)
		gameVar.pongUrl = "static/css/images/footballLevel.png";
	else if (gameVar.tennis)
		gameVar.pongUrl = "static/css/images/tennisLevel.png";

	gameVar.brickUrl = "static/css/images/brickout.png";
	if (brickVar.castle)
		gameVar.brickUrl = "static/css/images/castleLevel.png";
	else if (brickVar.x)
		gameVar.brickUrl = "static/css/images/xLevel.png";
	else if (brickVar.invader)
		gameVar.brickUrl = 'static/css/images/invadersLevel.png';
}

// export function showGameplayMultiView()
// {
// 	defaultView.style.display = 'none';
// 	playsoloGameBtn.style.display = 'none';

// 	gameplayView.style.display = 'block';
// 	quickGameBtn.style.display = 'none';
// 	startGameBtn.style.display = 'block';
// 	tournamentGameBtn.style.display = 'block'

// 	initEventListenerRoom();
// }

// export function showDefaultView()
// {
// 	gameView.style.display = 'none';
// 	rematchBtn.style.display = 'none';
// 	quitGameBtn.style.display = 'none';
// 	defaultView.style.display = 'block';
// 	playsoloGameBtn.style.display = 'block';
// 	playmultiGameBtn.style.display = 'block';
// }

// export function startGameVieW()
// {
// 	gameplayView.style.display = 'none';
// 	quickGameBtn.style.display = 'none';
// 	startGameBtn.style.display = 'none';
// 	tournamentGameBtn.style.display = 'none';

// 	gameView.style.display = 'block';

// }
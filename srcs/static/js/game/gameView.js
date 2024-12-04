import gameVar from "./var.js";
import brickVar from "./brickout/var.js"
import { initializeBall } from "./draw.js";
import { draw } from "./draw.js";
import { resetMatch, checkServer } from "./reset.js";
import { manageAi } from "./ai.js";
import { updateCanvasColor } from "./setting.js";
import { listenPlayBtn, listenSettingBtn } from "./listenerSetting.js";
import { initControl } from "./init.js";
import { startGame } from "./start.js";
import { listenSettingMultiBtn } from "./listenerSetting.js";
import { listenPlayMultiBtn } from "./listenerSetting.js";


export function showGameSelectionMultiView()
{
	// gameVar.liveMatch = true;
	// initControl();
	// history.pushState({ view: 'game'}, '', `?view=settingMulti`);
	const maincontent = document.getElementById('mainContent');
	maincontent.innerHTML = '';
	const gameSelection = document.createElement('div');

	updateImageUrl();

	gameSelection.innerHTML = `
    <div id="settingView" class="game-selection">
        <h1>Multiplayer</h1>
        <h1>Local Play</h1>
        <div class="container-game2">
            <div class="games-row2">
                <!-- PONG Column -->
                <div class="game-column">
                    <div class="game-title3">
						<div class="title-image-container">
							<img id="gameImage" src="${gameVar.pongUrl}" alt="pongGame">
      		                <h2 id="gameTitle">PONG GAME</h2>
						</div>
                    </div>
                    <div class="game-settings3">
                        <div id="settingsContainer" class="settings-info2">
                            <div class="settings-inline">
                                <button id="settingBtn1" class="settingsSelect-button2">Settings</button>
                                <div class="settings-column2" id="settings-column">
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
                <!-- BRICKOUT Column -->
                <div class="game-column">
                    <div class="game-title3">
						<div class="title-image-container">
							<img id="gameImage" src="${gameVar.brickUrl}" alt="brickGame">
      		                <h2 id="gameTitle">BRICKOUT GAME</h2>
						</div>
                    </div>
                    <div class="game-settings3">
                        <div id="settingsContainer" class="settings-info2">
                            <div class="settings-inline">
                                <button id="settingBtn2" class="settingsSelect-button2">Settings</button>
                                <div class="settings-column2" id="settings-column">
                                    <p>Difficulty: <span id="difficultyChoice">Medium</span></p>
                                    <p>Power-Up: <span id="powerupChoice">❌</span></p>
                                    <p>Level: <span id="levelSelected">Table Tennis</span></p>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="game-play">
                        <button id="playBtn2" class="startSelect-button">Play</button>
                    </div>
                </div>
            </div>
        </div><br>
		<h1>Online Play</h1>
        <div class="container-game2">
            <div class="games-row2">
                <!-- PONG Column -->
                <div class="game-column">
                    <div class="game-title3">
						<div class="title-image-container">
							<img id="gameImage" src="${gameVar.pongUrl}" alt="pongGame">
      		                <h2 id="gameTitle">PONG GAME</h2>
						</div>
                    </div>
                    <div class="game-settings3">
                        <div id="settingsContainer" class="settings-info2">
                            <div class="settings-inline">
                                <button id="settingBtn3" class="settingsSelect-button2">Settings</button>
                                <div class="settings-column2" id="settings-column">
                                    <p>Difficulty: <span id="difficultyChoice">Medium</span></p>
                                    <p>Level: <span id="levelSelected">Table Tennis</span></p>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="game-play2">
                        <button id="playBtn3" class="startSelect-button">Play</button>
                    </div>
                </div>
                <!-- BRICKOUT Column -->
                <div class="game-column">
                    <div class="game-title3">
						<div class="title-image-container">
							<img id="gameImage" src="${gameVar.brickUrl}" alt="brickGame">
      		                <h2 id="gameTitle">BRICKOUT GAME</h2>
						</div>
                    </div>
                    <div class="game-settings3">
                        <div id="settingsContainer" class="settings-info2">
                            <div class="settings-inline">
                                <button id="settingBtn4" class="settingsSelect-button2">Settings</button>
                                <div class="settings-column2" id="settings-column">
                                    <p>Difficulty: <span id="difficultyChoice">Medium</span></p>
                                    <p>Level: <span id="levelSelected">Table Tennis</span></p>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="game-play2">
                        <button id="playBtn4" class="startSelect-button">Play</button>
                    </div>
                </div>
            </div>
        </div>
    </div>`;
 
	maincontent.appendChild(gameSelection);
	gameVar.settingBtn1 = document.getElementById('settingBtn1');
	gameVar.settingBtn2 = document.getElementById('settingBtn2');
	gameVar.settingBtn3 = document.getElementById('settingBtn3');
	gameVar.settingBtn4 = document.getElementById('settingBtn4');
	gameVar.playBtn = document.getElementById('playBtn');
	gameVar.playBtn2 = document.getElementById('playBtn2');
	
	listenSettingMultiBtn();
	listenPlayMultiBtn();
}

export function showGameSelectionView()
{
	gameVar.liveMatch = false;
	initControl();
<<<<<<< HEAD
	history.pushState({ view: 'game'}, '', `?view=solo`);
=======
	// history.pushState({ view: 'game'}, '', `?view=solo`);
>>>>>>> new_user
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



function loadCustomFont()
{
    return new FontFace('fontScore', 'url(/static/css/font/scoreboard-webfont.woff2)');
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
		ctx.fillText(gameVar.playerScore, leftX, y + gameVar.scoreCanvH / 2);
		ctx.fillText(gameVar.aiScore, rightX, y + gameVar.scoreCanvH / 2);
		ctx.fillText('VS', centerX, y);
		const minutes = Math.floor(gameVar.gameTime / 60);
		const seconds = gameVar.gameTime % 60;
		const time = `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
		ctx.font = '20px fontScore';
		ctx.fillText(time, centerX, y + gameVar.scoreCanvH / 2);
	}).catch(function(error)
	{
		console.error("Error on font load", error);
	});
}

export function showGameView()
{
<<<<<<< HEAD
	history.pushState({ view: 'game'}, '', `?view=solo/pong`);
=======
	// history.pushState({ view: 'game'}, '', `?view=solo/pong`);
>>>>>>> new_user
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
	scoreCanvas.height = gameVar.scoreCanvH;

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

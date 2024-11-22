import gameVar from "./var.js";
import { initializeBall } from "./draw.js";
import { createPowerUp } from "./powerUp.js";
import { draw } from "./draw.js";
import { resetMatch, checkServer } from "./reset.js";
import { initEventListenerAi, manageAi } from "./ai.js";
import { initEventListenerRoom } from "./init.js";
import { showSettingView } from "./setting.js";


export function showGameplayMultiView()
{
	defaultView.style.display = 'none';
	playsoloGameBtn.style.display = 'none';

	gameplayView.style.display = 'block';
	quickGameBtn.style.display = 'none';
	startGameBtn.style.display = 'block';
	tournamentGameBtn.style.display = 'block'

	initEventListenerRoom();
}

export function showDefaultView()
{
	gameView.style.display = 'none';
	rematchBtn.style.display = 'none';
	quitGameBtn.style.display = 'none';
	defaultView.style.display = 'block';
	playsoloGameBtn.style.display = 'block';
	playmultiGameBtn.style.display = 'block';
}
export function showGameplaySoloView()
{
	defaultView.style.display = 'none';
	playmultiGameBtn.style.display = 'none';

	const maincontent = document.getElementById('mainContent');

	maincontent.innerHTML = '';

	const gameSelection = document.createElement('div');

	const pongUrl = "static/css/images/classic.png";
	const brickUrl = "static/css/images/brick.png";

	gameSelection.innerHTML =  `<div id="settingView" class="game-selection">
    <h1>Game Selection</h1>
    <div class="container-game">
        <div class="game-row">
            <div class="game-title">
                <h2 id="gameTitle">PONG GAME</h2>
            </div>
            <div class="game-image">
                <img id="gameImage" src="${pongUrl}" alt="pongGame">
            </div>
            <div class="game-settings">
                <div id="settingsContainer" class="settings-info">
					<div class="settings-inline">
						<button id="settingBtn1" class="settingsSelect-button">Settings</button>
						<div class="settings-column">
     	    				<p>Difficulty: <span id="difficultyChoice">Medium</span></p>
							<p>Power-Up: <span id="powerupChoice">✅</span></p>
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
                <h2 id="gameTitle2">BRICK BREAKER</h2>
            </div>
            <div class="game-image">
                <img id="gameImage2" src="${brickUrl}" alt="brickGame">
            </div>
            <div class="game-settings">
                <div id="settingsContainer" class="settings-info">
					<div class="settings-inline">
						<button id="settingBtn2" class="settingsSelect-button2">Settings</button>
						<div class="settings-column">
     	            		<p>Difficulty: <span id="difficultyChoice2">Hard</span></p>
							<p>Power-Up: <span id="powerupChoice2">✅</span></p>
                    		<p>Level: <span id="levelSelected2">Castle</span></p>
                		</div>
					</div>
				</div>
            </div>
            <div class="game-play">
                <button id="playBtn2" class="startSelect-button">Play</button>
            </div>
        </div>
    </div>
</div>`

	maincontent.appendChild(gameSelection);
	gameVar.settingBtn1 = document.getElementById('settingBtn1');
	gameVar.settingBtn2 = document.getElementById('settingBtn2');
	gameVar.playBtn = document.getElementById('playBtn');
	gameVar.playBtn2 = document.getElementById('playBtn2');
	
	gameVar.settingBtn1.addEventListener('click', () =>
	{
		showSettingView(false);
	});

	gameVar.settingBtn2.addEventListener('click', () =>
	{
		showSettingView(false);
	});

	// tournamentGameBtn.style.display = 'block'
	initEventListenerAi();	

}

export function showGameView()
{
	gameplayView.style.display = 'none';
	quickGameBtn.style.display = 'none';
	startGameBtn.style.display = 'none';
	tournamentGameBtn.style.display = 'none'

	gameView.style.display = 'block';
	rematchBtn.style.display = 'block';
	quitGameBtn.style.display = 'block';	
	initializeBall();
	if (gameVar.powerUpEnable)
		createPowerUp();
	draw();
	manageAi();
}

export function startGameVieW()
{
	gameplayView.style.display = 'none';
	quickGameBtn.style.display = 'none';
	startGameBtn.style.display = 'none';
	tournamentGameBtn.style.display = 'none';

	gameView.style.display = 'block';

}

export function rematchView()
{
	console.log("rematch");
	gameplayView.style.display = 'none';
	quickGameBtn.style.display = 'none';
	startGameBtn.style.display = 'none';
	tournamentGameBtn.style.display = 'none'

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
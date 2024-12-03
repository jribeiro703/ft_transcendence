import gameVar from "./var.js";
import { listenSettingMultiBtn } from "./listenerSetting.js";
import { listenPlayMultiBtn } from "./listenerSetting.js";
import { checkSettingLive } from "./setting.js";
import { createNewRoom } from "./room.js";
import { updateImageUrl } from "./update.js";
import { SCORE_CANVAS_HEIGHT } from "./const.js";

export function showGameSelectionMultiView()
{
	const maincontent = document.getElementById('mainContent');
	maincontent.innerHTML = '';
	const gameSelection = document.createElement('div');
	const pongUrl = "/static/css/images/ttLevel.png";
	const brickUrl = "/static/css/images/brickout.png";

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
                                <div class="settings-column2" id="settings-column2">
                                    <p>Difficulty: <span id="difficultyChoice">Medium</span></p>
                                    <p>Power-Up: <span id="powerupChoice">❌</span></p>
                                    <p>Level: <span id="levelSelected">Classic</span></p>
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
							<img id="gameImage" src="${pongUrl}" alt="pongGame">
      		                <h2 id="gameTitle">PONG GAME</h2>
						</div>
                    </div>
                   <div class="game-play2">
                        <button id="playBtn3" class="startSelect-button">Join Lobby</button>
                    </div>
                </div>
                <!-- BRICKOUT Column -->
                <div class="game-column">
                    <div class="game-title3">
						<div class="title-image-container">
							<img id="gameImage" src="${brickUrl}" alt="brickGame">
      		                <h2 id="gameTitle">BRICKOUT GAME</h2>
						</div>
                    </div>
                    <div class="game-play2">
                        <button id="playBtn4" class="startSelect-button">Join Lobby</button>
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
	gameVar.playBtn3 = document.getElementById('playBtn3');
	gameVar.playBtn4 = document.getElementById('playBtn4');
	
	listenSettingMultiBtn();
	listenPlayMultiBtn();
}
export function showLobbyView()
{
	console.log("game: ", gameVar.game);
	let level = null;
	if (gameVar.game == 'pong')
		level = 'TableTennis';
	else if (gameVar.game == 'brickout')
		level = 'Classic';
	const mainContent = document.getElementById("mainContent");

	mainContent.innerHTML = '';

	const roomView = document.createElement('div');

	roomView.innerHTML = `
	<div id="roomView" style="display: none;">
			<div class="container-room">
				<div class="server-list">
					<h2>Room List</h2>
					<div id="noRoomsMessage" style="display: block;">
						No room available for now. Create one !
					</div>
					<div id="roomsContainer"></div>
					<div class="refresh"></div>
					<button id="refreshBtn" class="refresh-button">Refresh</button>
				</div>
				<div class="host-server">
					<h2>Host A Room</h2>
					<h3>Playing as: <strong>Login</strong></h3>
					<div class="settings">
						<button id="settingBtn">Settings</button>
						<div id="setting-container">
							Difficulty: <span id="difficultyChoice">Medium</span><br>
							Level: <span id="levelSelected">${level}</span>
						</div>
					</div>
					<button id="createRoomBtn" class="start-button">Create Room</button>
				</div>
			</div>
		</div>
	</div>
	`;

	mainContent.appendChild(roomView);

	gameVar.createRoomBtn = document.getElementById('createRoomBtn');
	gameVar.roomView = document.getElementById('roomView');
	gameVar.roomsContainer = document.getElementById('roomsContainer');
	gameVar.noRoomsMessage = document.getElementById('noRoomsMessage');
	gameVar.refreshBtn = document.getElementById('refreshBtn');
	gameVar.settingBtn = document.getElementById('settingBtn');
	// gameVar.createRoomName = document.getElementById('createRoomName');

	gameVar.roomView.style.display = 'block';
	gameVar.refreshBtn.style.display = 'block';
	gameVar.settingBtn.style.display = 'block';
	

}
export function showGameMultiView(room = null)
{
	checkSettingLive();

	const mainContent = document.getElementById('mainContent');

	mainContent.innerHTML = '';

	const insertTo = document.createElement('div');

	insertTo.innerHTML = `
	<div id="gameView" style="display: none;">
			<div id="scoreboard">
				<canvas id="scoreCanvas"></canvas>
			</div>
			<canvas id="myCanvas"></canvas>
			<br><br>
			<div class="button-container">
				<button id="rematchBtn" style="display: none;" disabled>Rematch</button>
				<button id="quitGameBtn" style="display: none;">Quit Game</button>
			</div>
		</div>	
	`;

	mainContent.appendChild(insertTo);

	gameVar.gameView = document.getElementById('gameView');
	gameVar.rematchBtn = document.getElementById('rematchBtn');	
	gameVar.quitGameBtn = document.getElementById('quitGameBtn');
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

	createNewRoom();
}
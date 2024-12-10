import gameVar from "./var.js";
import { updateImageUrl } from "./update.js";

export function displayLobbyView(level)
{
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
}

export function displayPongRemote()
{
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
}


export function displayGameSelectionMulti()
{
	console.log("displayGSMV");
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
}
export function displayGameView()
{
	const mainContent = document.getElementById('mainContent');
	mainContent.innerHTML = ``;
	const gameView = document.createElement('div');
	gameView.innerHTML=`
	<div id="gameView" style="display: block;">
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
}

export function displayCanvas()
{
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
}
export function displaySettingMultiView()
{
	const pongUrl = "static/css/images/ttLevel.png";
	const footUrl = "static/css/images/footballLevel.png";
	const tennisUrl = "static/css/images/tennisLevel.png";
	const maincontent = document.getElementById('mainContent');

	maincontent.innerHTML = '';

	const insertTo = document.createElement('div');

	insertTo.innerHTML = `
	<div id="settingView" style="display: block;">
		<Settings
		<div class="container">
			<div class="left-column">
				<p class="gpMode">Difficulty:</p>
				<p id="powerUpSelection" style="display: none;" class="gpMode">Power-Up Activation:</p>
				<p class="gpMode">Level Selection:</p>
			</div>
			<div class="right-column">
				<div>
					<button id="easy" class="level">Easy</button>
					<button id="medium" class="level">Medium</button>
					<button id="hard" class="level">Hard</button>
				</div>
				<div id="btnPowerUp" style="display: none;" class="pu">
					<button id="withPowerUps" class="powerUpBtn">Yes</button>
					<button id="withoutPowerUps" class="powerUpBtn">No</button>
				</div>
				<div class="map-selection">
					<div id="map1" class="mapOption" data-map-name="classicMap">
						<img src="${pongUrl}" alt="classicMap" class="map-image">
						<button id="tableTennis" class="level">Table Tennis</button>
					</div>
					<div id="map2" class="mapOption" data-map-name="classicMap">
						<img src="${footUrl}" alt="footMap1" class="map-image">
						<button id="footLevel" class="level">FootBall</button>
					</div>
					<div id="map3" class="mapOption" data-map-name="clasicMap">
						<img src="${tennisUrl}" alt="customMap1" class="map-image">
						<button id="tennisLevel" class="level">Tennis</button>
					</div>
				</div>
			</div>
		</div>
		<div>
			<button id="saveBtn">Save and Return</button>
		</div>
	</div>`

	maincontent.appendChild(insertTo);
}
export function displaySettingView()
{
	const pongUrl = "static/css/images/ttLevel.png";
	const footUrl = "static/css/images/footballLevel.png";
	const tennisUrl = "static/css/images/tennisLevel.png";
	const classicUrl = "static/css/images/classicPong.png";
	const maincontent = document.getElementById('mainContent');

	maincontent.innerHTML = '';

	const insertTo = document.createElement('div');

	insertTo.innerHTML = `
	<div id="settingView" style="display: block;">
		<Settings
		<div class="container">
			<div class="left-column">
				<p class="gpMode">Difficulty:</p>
				<p id="powerUpSelection" style="display: none;" class="gpMode">Power-Up Activation:</p>
				<p class="gpMode">Level Selection:</p>
			</div>
			<div class="right-column">
				<div>
					<button id="easy" class="level">Easy</button>
					<button id="medium" class="level">Medium</button>
					<button id="hard" class="level">Hard</button>
				</div>
				<div id="btnPowerUp" style="display: none;" class="pu">
					<button id="withPowerUps" class="powerUpBtn">Yes</button>
					<button id="withoutPowerUps" class="powerUpBtn">No</button>
				</div>
				<div class="map-selection">
					<div id="map1" class="mapOption" data-map-name="classicMap">
						<img src="${classicUrl}" alt="classicMap" class="map-image">
						<button id="classicPong" class="level">Classic Pong</button>
					</div>
					<div id="map2" class="mapOption" data-map-name="classicMap">
						<img src="${pongUrl}" alt="footMap1" class="map-image">
						<button id="tableTennis" class="level">Table Tennis</button>
					</div>
					<div id="map3" class="mapOption" data-map-name="clasicMap">
						<img src="${footUrl}" alt="customMap1" class="map-image">
						<button id="footLevel" class="level">Football</button>
					</div>
					<div id="map4" class="mapOption" data-map-name="clasicMap">
						<img src="${tennisUrl}" alt="customMap1" class="map-image">
						<button id="tennisLevel" class="level">Tennis</button>
					</div>
				</div>
			</div>
		</div>
		<div>
			<button id="saveBtn" disabled="true">Save and Return</button>
		</div>
	</div>`

	maincontent.appendChild(insertTo);
}

export function displaySetting(difficulty, powerUp, level)
{
	const settingContain = document.getElementById('settings-column');
	if (!settingContain)
		console.log("error on settingContain");
	settingContain.innerHTML = '';

	const settingItem = document.createElement('div');

	settingItem.innerHTML = `
	<p>Difficulty: <span id="difficultyChoice">${difficulty}</span></p>
	<p>Power-Up: <span id="powerupChoice">${powerUp}</span></p>
	<p>Level: <span id="levelSelected">${level}</span></p>`;

	settingContain.appendChild(settingItem);
}

export function displayGameSelectionSolo()
{
	const maincontent = document.getElementById('mainContent');
	maincontent.innerHTML = '';
	const gameSelection = document.createElement('div');


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
}
export function displayGameBrickView()
{
	const mainContent = document.getElementById('mainContent');
	mainContent.innerHTML = '';
	const insertTo = document.createElement('div');
	insertTo.innerHTML = `
	<div id="scoreboard">
		<canvas id="scoreCanvas"></canvas>
	</div>
	<canvas id="brickoutCanvas"></canvas>
	`;
	mainContent.appendChild(insertTo);
}
export function displayGameBrick2pView()
{
	const mainContent = document.getElementById('mainContent');
	mainContent.innerHTML = '';
	const insertTo = document.createElement('div');
	insertTo.innerHTML = `
	<div id="scoreboard">
		<canvas id="scoreCanvas"></canvas>
	</div>
	<div id="twoPlayerBrick">
		<canvas id="brickoutCanvas"></canvas>
		<canvas id="brickoutCanvas2"></canvas>
	</div>
	`;
	mainContent.appendChild(insertTo);
}
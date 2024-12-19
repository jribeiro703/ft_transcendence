import gameVar from "./var.js";
import { updateImageUrl } from "./update.js";

export function displayLobbyView(level) 
{
  const mainContent = document.getElementById("mainContent");
  mainContent.innerHTML = "";
  const roomView = document.createElement("div");

  roomView.style.width = "100%";

  roomView.innerHTML = `
  <div id="roomView" style="display: none;" class="h-100 d-flex justify-content-center">
      <div class="container-room gap-5">
        <div class="server-list overflow-auto w-50 min-h-200px d-flex align-items-center justify-content-center flex-column">
          <h2>Room List</h2>
          <div id="noRoomsMessage" style="display: flex;" class="text-center justify-content-center">
            No room available for now. Create one !
          </div>
          <div id="roomsContainer" class="flex-column overflow-auto max-h-350px d-flex justify-content-start"></div>
          <div class="refresh"></div>
          <button id="refreshBtn" class="main-btn settingsSelect-button">Refresh</button>
        </div>
        <div class="host-server w-40 d-flex justify-content-spa align-items-center flex-column">
          <h2>Host A Room</h2>
          <h3 class="d-flex gap-4">Playing as: <strong>${gameVar.userName}</strong></h3>
          <div class="settings d-flex justify-content-center w-100 gap-4">
            <button id="settingBtn" class="main-btn">Settings</button>
            <div id="setting-container">
              Difficulty: <span id="difficultyChoice">Medium</span><br>
              Level: <span id="levelSelected">${level}</span>
            </div>
          </div>
          <button id="createRoomBtn" class="main-btn createRoom-button">Create Room</button>
        </div>
      </div>
    </div>
  `;
  mainContent.appendChild(roomView);
}

export function displayPongRemote()
{
  const mainContent = document.getElementById("mainContent");
  mainContent.innerHTML = "";
  const insertTo = document.createElement("div");

  insertTo.innerHTML = `
  <div id="gameView" style="display: none;">
      <div id="scoreboard">
        <canvas id="scoreCanvas"></canvas>
      </div>
      <canvas id="myCanvas"></canvas>
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
  const maincontent = document.getElementById('mainContent');
  maincontent.innerHTML = '';
  const gameSelection = document.createElement('div');
  const pongUrl = "/static/css/images/classicPong.png";
  const brickUrl = "/static/css/images/brickout.png";

  if (!gameVar.pongUrl)
	gameVar.pongUrl = pongUrl;
  if(!gameVar.brickUrl)
	gameVar.brickUrl = brickUrl;

  gameSelection.style.width = "100%";

  gameSelection.innerHTML = `
  <div id="settingView" class="d-flex">
    <div class="container-game no-scrollbar">

        <h1 class="custom-h1">Local Play</h1>

      <div class="game-row">
        <div class="game-image">
          <img id="gameImage" src="${gameVar.pongUrl}" alt="pongGame">
        </div>
        <div class="game-settings">
          <div id="settingsContainer" class="settings-info">
            <div class="settings-inline">
              <button id="settingBtn1" class="main-btn settingsSelect-button">Settings</button>
              <div class="settings-column" id="settings-column">
                <p>Difficulty: <span id="difficultyChoice">Medium</span></p>
                <p>Power-Up: <span id="powerupChoice">❌</span></p>
                <p>Level: <span id="levelSelected">Table Tennis</span></p>
              </div>
            </div>
          </div>
        </div>
        <div class="game-play">
          <button id="playBtn" class="main-btn settingsSelect-button">Play</button>
        </div>
      </div>

      <div class="game-row">
        <div class="game-image">
          <img id="gameImage" src="${gameVar.brickUrl}" alt="brickGame">
        </div>
        <div class="game-settings">
          <div id="settingsContainer" class="settings-info">
            <div class="settings-inline">
              <button id="settingBtn2" class="main-btn settingsSelect-button">Settings</button>
              <div class="settings-column2" id="settings-column2">
                <p>Difficulty: <span id="difficultyChoice2">Medium</span></p>
                <p>Power-Up: <span id="powerupChoice2">❌</span></p>
                <p>Level: <span id="levelSelected2">Classic</span></p>
              </div>
            </div>
          </div>
        </div>
        <div class="game-play">
          <button id="playBtn2" class="main-btn settingsSelect-button">Play</button>
        </div>
      </div>

    <h1 class="custom-h1">Online Play</h1>

      <div class="game-row">
        <div class="game-image">
              <img id="gameImage" src="${pongUrl}" alt="pongGame">
            </div>
                        <button id="playBtn3" class="main-btn settingsSelect-button">Join Lobby</button>
                </div>

      <div class="game-row">
        <div class="game-image">
              <img id="gameImage" src="${brickUrl}" alt="brickGame">
            </div>
                        <button id="playBtn4" class="main-btn settingsSelect-button">Join Lobby</button>
                </div>
    </div>
    </div>`;

  maincontent.appendChild(gameSelection);
}
export function displayGameView()
{
	if(!gameVar.tournament)
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
	else
	{
		const mainContent = document.getElementById('tournamentdiv');
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
}

export function displayCanvas()
{
  const mainContent = document.getElementById("mainContent");

  mainContent.innerHTML = "";

  const insertTo = document.createElement("div");

  // TODO : modifier les style block en flex et bien mettre les flexbox
  insertTo.innerHTML = `
  <div id="gameView" style="display: none;" class="h-100">
    <div id="scoreboard">
      <canvas id="scoreCanvas"></canvas>
    </div>
    <canvas id="myCanvas"></canvas>
    <div class="button-container">
      <button id="rematchBtn" style="display: none;" disabled>Rematch</button>
      <button id="quitGameBtn" style="display: none;">Quit Game</button>
    </div>
  </div>	
  `;

  mainContent.appendChild(insertTo);
}

export function displaySettingView()
{
  const ttUrl = "static/css/images/ttLevel.png";
  const footUrl = "static/css/images/footballLevel.png";
  const tennisUrl = "static/css/images/tennisLevel.png";
  const classicUrl = "static/css/images/classicPong.png";
  const maincontent = document.getElementById('mainContent');

  maincontent.innerHTML = "";

  const insertTo = document.createElement("div");
  insertTo.style.width = "100%";
  insertTo.style.flex = "1 0 0";

  insertTo.innerHTML = `
  <div id="settingView" class="p-2 no-scrollbar d-flex justify-content-center settingsViewOverflow overflow-auto flex-column align-items-center gap-5" style="display: block;">
        <div class="d-flex justify-content-center align-items-center gap-5 flex-wrap">
          <button id="easy" class="settingsBtn btn height-btn level">Easy</button>
          <button id="medium" class="settingsBtn btn height-btn level">Medium</button>
          <button id="hard" class="settingsBtn btn height-btn level">Hard</button>
        </div>
        <div id="btnPowerUp" style="display: block;" class="d-flex justify-content-center align-items-center gap-5 flex-wrap pu">
          <button id="withPowerUps" class="settingsBtn btn custom-btn height-btn powerUpBtn">Power UP</button>
          <button id="withoutPowerUps" class="settingsBtn btn custom-btn height-btn powerUpBtn">No Power UP</button>
        </div>
        <div class="map-selection flex-wrap justify-content-center">
          <div id="map1" class="mapOption mapClic" data-map-name="classicMap">
            <img src="${classicUrl}" id="classicPong" alt="classicMap" class="map-image">
			<p1>Classic Pong</p1>
          </div>
          <div id="map2" class="mapOption mapClic" data-map-name="classicMap">
            <img src="${ttUrl}" id="tableTennis" alt="footMap1" class="map-image">
			<p1>Table tennis</p1>
          </div>
          <div id="map3" class="mapOption mapClic" data-map-name="clasicMap">
            <img src="${footUrl}" id="footLevel" alt="customMap1" class="map-image">
			<p1>Football</p1>
          </div>
          <div id="map4" class="mapOption mapClic" data-map-name="clasicMap">
            <img src="${tennisUrl}" id="tennisLevel" alt="customMap1" class="map-image">
			<p1>Tennis</p1>
          </div>
        </div>
      <button id="saveBtn" class="settingsBtn btn custom-btn height-btn" disabled="true">Save and Return</button>
  </div>`;

  maincontent.appendChild(insertTo);
}

export function displaySetting(difficulty, powerUp, level)
{
	const settingContain = document.getElementById("settings-column");
	if (!settingContain)
		console.log("error on settingContain");
	settingContain.innerHTML = "";

	const settingItem = document.createElement("div");

	settingItem.innerHTML = `
	<p>Difficulty: <span id="difficultyChoice">${difficulty}</span></p>
	<p>Power-Up: <span id="powerupChoice">${powerUp}</span></p>
	<p>Level: <span id="levelSelected">${level}</span></p>`;

	settingContain.appendChild(settingItem);
}


export function displayGameSelectionSolo()
{
  const maincontent = document.getElementById("mainContent");
  maincontent.innerHTML = "";
  const gameSelection = document.createElement("div");

  gameSelection.style.width = "100%";
  gameSelection.style.flex = "1 0 0";

  gameSelection.innerHTML = `
  <div id="settingView" class="d-flex">
    <div class="container-game no-scrollbar">
      <div class="game-row">
        <div class="game-image">
          <img id="gameImage" src="${gameVar.pongUrl}" alt="pongGame">
        </div>
        <div class="game-settings">
          <div id="settingsContainer" class="settings-info">
            <div class="settings-inline">
              <button id="settingBtn1" class="main-btn settingsSelect-button">Settings</button>
              <div class="settings-column" id="settings-column">
                <p>Difficulty: <span id="difficultyChoice">Medium</span></p>
                <p>Power-Up: <span id="powerupChoice">❌</span></p>
                <p>Level: <span id="levelSelected">Table Tennis</span></p>
              </div>
            </div>
          </div>
        </div>
        <div class="game-play">
          <button id="playBtn" class="main-btn settingsSelect-button">Play</button>
        </div>
      </div>
      <div class="game-row">
        <div class="game-image">
          <img id="gameImage" src="${gameVar.brickUrl}" alt="brickGame">
        </div>
        <div class="game-settings">
          <div id="settingsContainer" class="settings-info">
            <div class="settings-inline">
              <button id="settingBtn2" class="main-btn settingsSelect-button">Settings</button>
              <div class="settings-column2" id="settings-column2">
                <p>Difficulty: <span id="difficultyChoice2">Medium</span></p>
                <p>Power-Up: <span id="powerupChoice2">❌</span></p>
                <p>Level: <span id="levelSelected2">Classic</span></p>
              </div>
            </div>
          </div>
        </div>
        <div class="game-play">
          <button id="playBtn2" class="main-btn settingsSelect-button">Play</button>
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
  insertTo.id = 'brickoutContainer';
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

import gameVar from "./var.js";

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
                <div id="settings-column" "class="settings-column">
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
                <div id="settings-column2" class="settings-column2">
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
    insertTo.id = "brickout2pContainer";
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

export function displayPongRemote()
{
    const mainContent = document.getElementById("mainContent");
    mainContent.innerHTML = "";
    const insertTo = document.createElement("div");

    insertTo.innerHTML = `
    <div id="gameView" style="display: block;">
        <div id="scoreboard">
            <canvas id="scoreCanvas"></canvas>
        </div>
        <canvas id="myCanvas"></canvas>
        <br><br>
        <div class="button-container">
            <button id="rematchBtn" class="settingsBtn btn custom-btn height-btn" style="display: none;">Rematch</button>
            <button id="returnLobby" class="settingsBtn btn custom-btn height-btn" style="display: none;">Return Lobby</button>
            <button id="quitGameBtn" class="settingsBtn btn custom-btn height-btn" style="display: none;">Return Home</button>
        </div>
    </div>	
    `;

    mainContent.appendChild(insertTo);
}

export function displayGameView()
{
	if(!gameVar.tournament)
        displayPongRemote();
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
				<button id="rematchBtn" class="settingsBtn btn custom-btn height-btn" style="display: none;">Rematch</button>
				<button id="quitGameBtn" class="settingsBtn btn custom-btn height-btn" style="display: none;">Return Home</button>
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
    <br><br>
    <div class="button-container">
        <button id="rematchBtn" class="settingsBtn btn custom-btn height-btn" style="display: none;">Rematch</button>
        <button id="quitGameBtn" class="settingsBtn btn custom-btn height-btn" style="display: none;">Quit Game</button>
    </div>
    </div>	
    `;

    mainContent.appendChild(insertTo);
}
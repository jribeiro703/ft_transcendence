import gameVar from "./var.js";

export function displayPong()
{
    const mainContent = document.getElementById("mainContent");
    if (!mainContent)
        console.log("error on mainContent");
    mainContent.innerHTML = "";
    const insertTo = document.createElement("div");
    insertTo.innerHTML = `
    <div id="gameView" style="display: block;">
        <div id="scoreboard">
            <canvas id="scoreCanvas"></canvas>
        </div>
        <canvas id="myCanvas"></canvas>
        <div class="button-container" style="margin-top: 50px">
            <button id="rematchBtn" class="primaryBtn w-40" style="display: none;"><span>Rematch</span></button>
            <button id="returnLobby" class="primaryBtn w-40" style="display: none;"><span>Return Lobby</span></button>
            <button id="quitGameBtn" class="primaryBtn w-40" style="display: none;"><span>Quit Game</span></button>
        </div>
    </div>	
    `;
    mainContent.appendChild(insertTo);
}

export function displayGameBrickView()
{
    const mainContent = document.getElementById("mainContent");
    mainContent.innerHTML = "";
    const insertTo = document.createElement("div");
    insertTo.id = "brickoutContainer";
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
    const mainContent = document.getElementById("mainContent");
    mainContent.innerHTML = "";
    const insertTo = document.createElement("div");
    insertTo.id = "brickout2pContainer";
    insertTo.innerHTML = `
    <div id="scoreboard">
        <canvas id="scoreCanvas"></canvas>
    </div>
    <div id="twoPlayerBrick" style="display: flex; gap: 20px; justify-content: center;">
        <canvas id="brickoutCanvas"></canvas>
        <canvas id="brickoutCanvas2"></canvas>
    </div>
    `;
    mainContent.appendChild(insertTo);
}

export function displayGameSelectionSolo()
{
    const maincontent = document.getElementById("mainContent");
    maincontent.innerHTML = "";
    const gameSelection = document.createElement("div");
    const brickUrl = "/static/css/images/brickout.png";
    const blackPongUrl = "/static/css/images/classicPong.png";

    gameSelection.style.width = "100%";
    gameSelection.style.flex = "1 0 0";

    gameSelection.innerHTML = `
    <div id="settingView" class="d-flex gap-3 container-game justify-content-center no-scrollbar flex-row align-items-center w-100">
        <div id="localPlay" class="w-60">
            <div class="game-row gap-3">
                <div class="game-image">
                    <img id="gameImage" src="${gameVar.pongUrl}" alt="pongGame">
                </div>
                <div id="settingsContainer" class="justify-content-center align-items-center d-flex flex-column settings-font-name">
                    <p>PONG</p>
                    <div id="settings-column" class="settings-column settings-font">
                        <p class="fs-settings">Difficulty: <span id="difficultyChoice" class="fs-settings">Medium</span></p>
                        <p>Power-Up: <span id="powerupChoice">❌</span></p>
                        <p>Map: <span id="levelSelected">Table Tennis</span></p>
                    </div>
                </div>
                <div class="width-170 justify-content-center d-flex flex-column gap-2">
                    <button id="settingBtn1" class="primaryBtn"><span>Settings</span></button>
                    <button id="playBtn" class="primaryBtn"><span>Play</span></button>
                </div>
            </div>
        <div class="game-row gap-3">
            <div class="game-image">
                <img id="gameImage" src="${gameVar.brickUrl}" alt="brickGame">
            </div>
            <div id="settingsContainer" class="justify-content-center align-items-center d-flex flex-column settings-font-name">
                <p>BRICKS</p>
                <div id="settings-column2" class="settings-column settings-font">
                <p class="fs-settings">Difficulty: <span id="difficultyChoice2" class="fs-settings">Medium</span></p>
                <p>Power-Up: <span id="powerupChoice2">❌</span></p>
                <p>Map: <span id="levelSelected2">Table Tennis</span></p>
            </div>
        </div>
            <div class="width-170 justify-content-center d-flex flex-column gap-2">
                <button id="settingBtn2" class="primaryBtn"><span>Settings</span></button>
                <button id="playBtn2" class="primaryBtn"><span>Play</span></button>
            </div>
    </div>
    </div>
    </div>`;

    maincontent.appendChild(gameSelection);
}

export function displayGameSelectionMulti()
{
    const maincontent = document.getElementById("mainContent");
    maincontent.innerHTML = "";
    const gameSelection = document.createElement("div");
    const pongUrl = "/static/css/images/classicPong.png";
    const brickUrl = "/static/css/images/brickout.png";
    if (!gameVar.pongUrl)
        gameVar.pongUrl = pongUrl;
    if (!gameVar.brickUrl)
        gameVar.brickUrl = brickUrl;
    gameSelection.style.width = "100%";
    gameSelection.innerHTML = `
    <div id="settingView" class="d-flex gap-3 container-game justify-content-center no-scrollbar flex-row align-items-center w-100">
    <div id="localPlay" class="w-60">
        <h1>Local</h1>
        <div class="game-row gap-3">
        <div class="game-image">
            <img id="gameImage" src="${gameVar.pongUrl}" alt="pongGame">
        </div>
            <div id="settingsContainer" class="justify-content-center align-items-center d-flex flex-column settings-font-name">
                <p>PONG</p>
                <div id="settings-column" class="settings-column settings-font">
                <p class="fs-settings">Difficulty: <span id="difficultyChoice" class="fs-settings">Medium</span></p>
                <p>Power-Up: <span id="powerupChoice">❌</span></p>
                <p>Level: <span id="levelSelected">Table Tennis</span></p>
                </div>
            </div>
        <div class="width-170 justify-content-center d-flex flex-column gap-2">
                <button id="settingBtn1" class="primaryBtn"><span>Settings</span></button>
            <button id="playBtn" class="primaryBtn"><span>Play</span></button>
        </div>
        </div>
        <div class="game-row gap-3">
        <div class="game-image">
            <img id="gameImage" src="${gameVar.brickUrl}" alt="brickGame">
        </div>
            <div id="settingsContainer" class="justify-content-center align-items-center d-flex flex-column settings-font-name">
                <p>BRICKOUT</p>
                <div id="settings-column2" class="settings-column settings-font">
                <p class="fs-settings">Difficulty: <span id="difficultyChoice2" class="fs-settings">Medium</span></p>
                <p>Power-Up: <span id="powerupChoice2">❌</span></p>
                <p>Level: <span id="levelSelected2">Table Tennis</span></p>
                </div>
            </div>
        <div class="width-170 justify-content-center d-flex flex-column gap-2">
                <button id="settingBtn2" class="primaryBtn"><span>Settings</span></button>
            <button id="playBtn2" class="primaryBtn"><span>Play</span></button>
        </div>
        </div>
        </div>
    <div id="onlinePlay" class="w-40">
    <h1>Online</h1>
        <div class="game-row-online">
        <div class="game-image">
                <img id="gameImage" src="${pongUrl}" alt="pongGame">
            </div>
                <button id="playBtn3" class="primaryBtn w-170"><span>Join Lobby</span></button>
            </div>
        <div class="game-row-online">
        <div class="game-image">
            <img id="gameImage" src="${brickUrl}" alt="brickGame">
        </div>
            <button id="playBtn4" class="primaryBtn w-170"><span>Join Lobby</span></button>
        </div>
    </div>
    </div>`;
    maincontent.appendChild(gameSelection);
}

export function displayGameView()
{
    if (!gameVar.tournament)
    {
        displayPong();
    }
    else
    {
        const mainContent = document.getElementById("tournamentdiv");
        mainContent.innerHTML = ``;
        const gameView = document.createElement("div");
        gameView.innerHTML = `
            <div id="gameView" style="display: block;">
                <div id="scoreboard">
                    <canvas id="scoreCanvas"></canvas>
                </div>
                <canvas id="myCanvas"></canvas>
                <br><br>
                <div class="button-container" style="margin-bottom: 10px;">
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

export function displaySetting(difficulty, powerUp, level)
{
    const settingContain = document.getElementById("settings-column");
    if (!settingContain)
        console.log("error on setting-column");
    settingContain.innerHTML = "";
    const settingItem = document.createElement("div");
    settingItem.innerHTML = `
    <p>Difficulty: <span id="difficultyChoice">${difficulty}</span></p>
    <p>Power-Up: <span id="powerupChoice">${powerUp}</span></p>
    <p>Level: <span id="levelSelected">${level}</span></p>`;
    settingContain.appendChild(settingItem);
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
                <div id="roomsContainer" class="flex-column overflow-auto max-h-350px d-flex justify-content-start">
                </div>
                <div class="refresh"></div>
                <button id="refreshBtn" class="primaryBtn w-170"><span>Refresh</span></button>
            </div>
        <div class="host-server w-40 d-flex justify-content-spa align-items-center flex-column">
            <h2>Host A Room</h2>
            <h3 class="d-flex gap-4">
            Playing as: <strong>${gameVar.userName}</strong>
            </h3>
            <div class="settings d-flex justify-content-center w-100 gap-4">
                <button id="settingBtn" class="primaryBtn w-50"><span>Settings</span></button>
                <div id="setting-container">
                    Difficulty: <span id="difficultyChoice">Medium</span>
                    Level: <span id="levelSelected">${level}</span>
                </div>
            </div>
            <button id="createRoomBtn" class="primaryBtn w-50"><span>Create Room</span></button>
        </div>
        </div>
    </div>
    `;
    mainContent.appendChild(roomView);
}



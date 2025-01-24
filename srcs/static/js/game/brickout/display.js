import { checkBtnB } from "./manage.js";

export function displayNextLevel()
{
    const mainContent = document.getElementById("brickoutContainer");
    const btn = document.createElement("div");
    btn.id = "finish";
    btn.innerHTML = `
        <div class="button-container" style="margin-top: 50px">
            <button id="nextLevelBtn" class="primaryBtn w-40 level"><span>Next Level</span></button> 
            <button id="restartLevelBtn" class="primaryBtn w-40 level"><span>Restart Level</span></button> 
            <button id="quitBtn" class="primaryBtn w-40 level"><span>Return Home</span></button>
            </div>
    `;
    mainContent.appendChild(btn);
    checkBtnB("nextLevel");
}

export function displayFinishLive()
{
    const mainContent = document.getElementById("brickoutContainer");
    const btn = document.createElement("div");
    btn.id = "finish";
    btn.innerHTML = `
        <div class="button-container" style="margin-top: 50px">
            <button id="returnLobbyBtn" class="primaryBtn w-40"><span>Return Lobby</span></button> 
            <button id="quitBtn" class="primaryBtn w-40"><span>Return Home</span></button>
        </div>
    `;
    mainContent.appendChild(btn);
    checkBtnB("finish");
}

export function displayFinish()
{
    const mainContent = document.getElementById("brickoutContainer");
    const btn = document.createElement("div");
    btn.id = "finish";
    btn.innerHTML = `
        <div class="button-container" style="margin-top: 50px">
            <button id="restartLevelBtn" class="primaryBtn w-40"><span>Restart Level</span></button> 
            <button id="quitBtn" class="primaryBtn w-40"><span>Return Home</span></button>
        </div>
    `;
    mainContent.appendChild(btn);
    checkBtnB("finish");
}

export function displayLocalRematch()
{
    const finishCheck = document.getElementById("finish");
    if (finishCheck)
        return;
    const mainContent = document.getElementById("brickout2pContainer");
    const btn = document.createElement("div");
    btn.id = "finish";
    btn.innerHTML = `
        <div class="button-container" style="margin-top: 50px">
            <button id="rematchBtn" class="primaryBtn w-40"><span>Rematch</span></button> 
            <button id="quitBtn" class="primaryBtn w-40"><span>Return Home</span></button>
        </div>
    `;
    mainContent.appendChild(btn);
    checkBtnB("localRematch");
}

export function displaySettingViewB()
{
    const level1Url = "static/css/images/brickout.png";
    const level2Url = "static/css/images/castleLevel.png";
    const level3Url = "static/css/images/xLevel.png";
    const level4Url = "static/css/images/invadersLevel.png";
    const maincontent = document.getElementById("mainContent");
    maincontent.innerHTML = "";
    const insertTo = document.createElement("div");
    insertTo.style.width = "100%";
    insertTo.style.flex = "1 0 0";
    insertTo.innerHTML = `
    <div id="settingView" class="p-2 no-scrollbar d-flex justify-content-center settingsViewOverflow overflow-auto flex-column align-items-center gap-4" style="display: block;">
        <div class="d-flex justify-content-center align-items-center gap-4 flex-wrap">
            <button id="easy" class="primaryBtn w-170 level"><span>Easy</span></button>
            <button id="medium" class="primaryBtn w-170 level"><span>Medium</span></button>
            <button id="hard" class="primaryBtn w-170 level"><span>Hard</span></button>
        </div>
        <div id="btnPowerUp" style="display: block;" class="d-flex justify-content-center align-items-center gap-4 flex-wrap">
            <button id="withPowerUps" class="primaryBtn w-170 powerUpBtn"><span>Power UP</span></button>
            <button id="withoutPowerUps" class="primaryBtn w-170 powerUpBtn"><span>No Power</span></button>
        </div>
        <div class="map-selection d-flex gap-4 flex-wrap justify-content-center">
            <div id="map1" class="mapOption mapClic" data-map-name="classicMap">
            <img src="${level1Url}" alt="classicMap" id="classicLevel" class="map-image">
            <p1>Classic Level</p1>
            </div>
            <div id="map2" class="mapOption mapClic" data-map-name="classicMap">
            <img src="${level2Url}" alt="footMap1" id="castleLevel" class="map-image">
            <p1>The Castle</p1>
            </div>
            <div id="map3" class="mapOption mapClic" data-map-name="clasicMap">
            <img src="${level3Url}" alt="customMap1" id="xLevel" class="map-image">
            <p1>X Level</p1>
            </div>
            <div id="map3" class="mapOption mapClic" data-map-name="clasicMap">
            <img src="${level4Url}" alt="customMap1" id="invaderLevel" class="map-image">
            <p1>Space Invader</p1>
            </div>
        </div>
        <button id="saveBtn" class="primaryBtn w-170 level" disabled="true"><span>Save</span></button>
    </div>`;

    maincontent.appendChild(insertTo);
}

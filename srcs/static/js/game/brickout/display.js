import { checkBtnB } from "./manage.js";

export function displayNextLevel()
{
    console.log("display next level ");
    const mainContent = document.getElementById("brickoutContainer");
    const btn = document.createElement('div');
    btn.id = "finish";
    btn.className = "finish";
    btn.innerHTML = `
        <button id="nextLevelBtn" class="settingsBtn btn custom-btn height-btn">Next Level</button> 
        <button id="restartLevelBtn" class="settingsBtn btn custom-btn height-btn">Restart Level</button> 
        <button id="quitBtn" class="settingsBtn btn custom-btn height-btn">Return Home</button>
    `;
    mainContent.appendChild(btn);
    checkBtnB('nextLevel');
}

export function displayFinish()
{
    console.log("display finish");
    const mainContent = document.getElementById("brickoutContainer");
    const btn = document.createElement('div');
    btn.id = "finish";
    btn.className = "finish";
    btn.innerHTML = `
        <button id="restartLevelBtn" class="settingsBtn btn custom-btn height-btn">Restart Level</button>
        <button id="quitBtn" class="settingsBtn btn custom-btn height-btn">Return Home</button>
    `;
    mainContent.appendChild(btn);
    checkBtnB("finish");
}

export function displayLocalRematch()
{
    console.log("display Local");
    const mainContent = document.getElementById("brickout2pContainer");
    const btn = document.createElement('div');
    btn.id = "finish";
    btn.className = "finish";
    btn.innerHTML = `
        <button id="rematchBtn" class="settingsBtn btn custom-btn height-btn">Rematch</button> 
        <button id="quitBtn" class="settingsBtn btn custom-btn height-btn">Return Home</button>
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
    const maincontent = document.getElementById('mainContent');

    maincontent.innerHTML = '';

    const insertTo = document.createElement('div');
    insertTo.style.width = "100%";
    insertTo.style.flex = "1 0 0";

    insertTo.innerHTML = `
    <div id="settingView" class="no-scrollbar d-flex justify-content-center settingsViewOverflow overflow-auto flex-column align-items-center gap-5" style="display: block;">
        <div class="d-flex justify-content-center align-items-center gap-5 flex-wrap">
            <button id="easy" class="settingsBtn btn height-btn level">Easy</button>
            <button id="medium" class="settingsBtn btn height-btn level">Medium</button>
            <button id="hard" class="settingsBtn btn height-btn level" >Hard</button>
        </div>
        <div id="btnPowerUp" style="display: block;" class="d-flex justify-content-center align-items-center gap-5 flex-wrap ">
            <button id="withPowerUps" class="settingsBtn btn custom-btn height-btn powerUpBtn">Power UP</button>
            <button id="withoutPowerUps" class="settingsBtn btn custom-btn height-btn powerUpBtn">No Power UP</button>
        </div>
        <div class="map-selection flex-wrap justify-content-center">
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
        <button id="saveBtn" class="settingsBtn btn custom-btn height-btn" disabled="true">Save and Return</button>
    </div>
    `;

    maincontent.appendChild(insertTo);
}

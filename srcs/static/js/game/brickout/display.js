import { checkBtnB } from "./manage.js";

export function displayNextLevel()
{
  const mainContent = document.getElementById("mainContent");
  const btn = document.createElement('div');
  btn.innerHTML = `
    <div class="finish" id="finish">
      <button id="nextLevelBtn">Next Level</button> 
      <button id="restartLevelBtn">Restart Game</button> 
      <button id="quitBtn">Return Home</button>
    </div>
  `;
  mainContent.appendChild(btn);
  checkBtnB('nextLevel');
}

export function displayFinish()
{
  const mainContent = document.getElementById("mainContent");
  const btn = document.createElement('div');
  btn.innerHTML = `
  <div class="finish id="finish">
    <button id="restartLevelBtn">Restart Game</button> 
    <button id="quitBtn">Return Home</button>
  </div>
  `;
  mainContent.appendChild(btn);
  checkBtnB("finish");
}

export function displayLocalRematch()
{
  const mainContent = document.getElementById("mainContent");
  const btn = document.createElement('div');
  btn.innerHTML = `
  <div class="finish id="finish">
    <button id="rematchBtn">Rematch</button> 
    <button id="quitBtn">Return Home</button>
  </div>
  `;
  mainContent.appendChild(btn);
  checkBtnB("localRematch");	
}
export function displaySettingViewB()
{
  const level1Url = "static/css/images/classicLevel.png";
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
          </div>
          <div id="map2" class="mapOption mapClic" data-map-name="classicMap">
            <img src="${level2Url}" alt="footMap1" id="castleLevel" class="map-image">
          </div>
          <div id="map3" class="mapOption mapClic" data-map-name="clasicMap">
            <img src="${level3Url}" alt="customMap1" id="xLevel" class="map-image">
          </div>
          <div id="map3" class="mapOption mapClic" data-map-name="clasicMap">
            <img src="${level4Url}" alt="customMap1" id="invaderLevel" class="map-image">
          </div>
        </div>
      <button id="saveBtn" class="settingsBtn btn custom-btn height-btn" disabled="true">Save and Return</button>
  </div>`

  maincontent.appendChild(insertTo);
}

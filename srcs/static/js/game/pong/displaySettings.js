export function displaySettingView()
{
    const ttUrl = "static/css/images/ttLevel.png";
    const footUrl = "static/css/images/footballLevel.png";
    const tennisUrl = "static/css/images/tennisLevel.png";
    const classicUrl = "static/css/images/classicPong.png";
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
            <img src="${classicUrl}" id="classicPong" alt="classicMap" class="map-image">
            <p1>Classic Pong</p1>
            </div>
            <div id="map2" class="mapOption mapClic" data-map-name="classicMap">
            <img src="${ttUrl}" id="tableTennis" alt="footMap1" class="map-image">
            <p1>Table Tennis</p1>
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
        <button id="saveBtn" class="primaryBtn w-170 level" disabled="true"><span>Save</span></button>
    </div>`;

    maincontent.appendChild(insertTo);
}

export function displaySetting(difficulty, powerUp, level)
{
    const settingContain = document.getElementById("settings-column");
    if (!settingContain)
    {
        console.log("error on settings-column");
        return;
    }
    settingContain.innerHTML = "";
    const settingItem = document.createElement("div");
    settingItem.innerHTML = `
    <p>Difficulty: <span id="difficultyChoice">${difficulty}</span></p>
    <p>Power-Up: <span id="powerupChoice">${powerUp}</span></p>
    <p>Level: <span id="levelSelected">${level}</span></p>`;
    settingContain.appendChild(settingItem);
}

export function displayLiveSetting(difficulty, level)
{
    const settingContain = document.getElementById("setting-container");
    if (!settingContain)
    {
        console.log("Errror on settings-container");
        return;
    }
    settingContain.innerHTML = "";
    const settingItem = document.createElement("div");
    settingItem.innerHTML = `
	Difficulty: 
	<span id="difficultyChoice">${difficulty}</span><br>
	Level:
	<span id="levelSelected">${level}</span>
	`;
    settingContain.appendChild(settingItem);
}


import gameVar from "./var.js";
import { updateDifficultySelection, updateLevelSelection } from "./update.js";
import { updatePowerUpSelection } from "./powerUp.js";
import { listenSettingDifficulty, listenSettingPU, listenSettingLevel, listenSettingSave} from "./listenerSetting.js"
import { listenSettingMultiSave } from "./listenerSetting.js";
import { displayGameData } from "./room.js";

export function showSettingMultiView(live)
{
	// history.pushState({ view: 'game'}, '', `?view=solo/settings`);
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

	getBtnById();
	addPuBtn(live);

	listenSettingPU();
	listenSettingDifficulty();
	listenSettingLevel();
	listenSettingMultiSave(live);
}
export function showSettingView(live)
{
	// history.pushState({ view: 'game'}, '', `?view=solo/settings`);
	// history.pushState({ page: 'settingView'}, '', `?view=solo/settings`);
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

	getBtnById();
	addPuBtn(live);

	listenSettingPU();
	listenSettingDifficulty();
	listenSettingLevel();
	listenSettingSave(live);
}

export function checkSetting()
{
	if (gameVar.settingsChanged === false)
	{
		updatePowerUpSelection(false); 
		updateDifficultySelection('medium');
		gameVar.difficulty = "medium";
		updateLevelSelection("tableTennis");
		gameVar.currentLevel = 'tableTennis'
	}
	// displayGameData();
}

export function checkSettingLive()
{
	// console.log("stg change live", gameVar.settingsChanged);
	if (gameVar.settingsChanged === false)
	{
		updateDifficultySelection('medium');
		gameVar.difficulty = 'medium';
		updateLevelSelection('tableTennis');
		gameVar.currentLevel = 'tableTennis'
	}
}

export function updateCanvasColor()
{
	let color = null;
	if (gameVar.currentLevel === 'tennisTable')
		color = '#1A1A40';
	if (gameVar.currentLevel === 'football')
		color = '#006400';
	else if (gameVar.currentLevel === 'tennis')
		color = '#D2691E';
   
    const canvas = document.getElementById('myCanvas');
    if (canvas)
	{
        canvas.style.backgroundColor = color;
    }
}

export function updateSetting()
{
	gameVar.settingsChanged = true;
	var difficulty = null;	
	var level = null;
	var powerUp = null;

	if (gameVar.difficulty)
		difficulty = gameVar.difficulty;
	else
	{
		difficulty = 'medium';
		updateDifficultySelection('medium');
	}

	if (gameVar.football)
		level = 'Football';
	else if (gameVar.tennisTable)
		level = 'Table Tennis';
	else if (gameVar.tennis)
		level = 'Tennis';
	else 
	{
		level = 'Table Tennis';
		updateLevelSelection('tableTennis');
	}

	if (gameVar.powerUpEnable)
		powerUp = "✅";
	else
	{
		powerUp = "❌";
		updatePowerUpSelection(false);
	}

	displaySetting(difficulty, powerUp, level);
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

export function updateLiveSetting()
{
	gameVar.settingsChanged = true;

	var difficulty = null;
	var level = null;

	if (gameVar.difficulty)
		difficulty = gameVar.difficulty;
	else
		difficulty = 'medium';

	if (gameVar.currentLevel)
		level = gameVar.currentLevel;

	const settingContain = document.getElementById('setting-container');

	settingContain.innerHTML = '';

	const settingItem = document.createElement('div');

	settingItem.innerHTML = `
	Difficulty: 
	<span id="difficultyChoice">${difficulty}</span><br>
	Level:
	<span id="levelSelected">${level}</span>
	`;

	settingContain.appendChild(settingItem);

}

export function getBtnById()
{
	gameVar.powerUpSelection = document.getElementById('powerUpSelection');
	gameVar.btnPowerUp = document.getElementById('btnPowerUp');
	gameVar.withPowerUp = document.getElementById('withPowerUps');
	gameVar.withoutPowerUp = document.getElementById('withoutPowerUps');
	gameVar.easy = document.getElementById('easy');
	gameVar.medium = document.getElementById('medium');
	gameVar.hard = document.getElementById('hard');
	gameVar.tableTennis = document.getElementById('tableTennis');
	gameVar.footLevel = document.getElementById('footLevel');
	gameVar.tennisLevel = document.getElementById('tennisLevel');
	gameVar.saveBtn = document.getElementById('saveBtn');
}

export function addPuBtn(live)
{
	if(live === false)
	{
		gameVar.powerUpSelection.style.display = 'block';
		gameVar.btnPowerUp.style.display = 'block';
	}
	else
	{
		gameVar.powerUpSelection.style.display = 'none';
		gameVar.btnPowerUp.style.display = 'none';
	}		
}
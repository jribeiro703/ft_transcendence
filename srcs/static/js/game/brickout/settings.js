import brickVar from "./var.js";
import brickVar2 from "./secondBrickout/var.js";
import { updatePowerUpSelectionB } from "./powerUp.js";
import { updateLevelSelectionB } from "./level.js";
import { showGameSelectionView } from "../gameView.js";
import { displayBallB } from "./ball.js";
import { showGameBrickView } from "./game.js";
import { showGameBrickMultiView } from "./game.js";
import { showGameSelectionMultiView } from "../gameView.js";
<<<<<<< HEAD
=======
import { renderPage } from "../../historyManager.js";
>>>>>>> new_user
import gameVar from "../var.js";

export function showSettingViewB(live)
{
	history.pushState({ view: 'game'}, '', `?view=solo/settings`);

	displaySettingB();
	getSettingBtn();

	if(live === false)
	{
		brickVar.powerUpSelection.style.display = 'block';
		brickVar.btnPowerUp.style.display = 'block';
	}
	else
	{
		brickVar.powerUpSelection.style.display = 'none';
		brickVar.btnPowerUp.style.display = 'none';
	}		

	listenSettingPUB();
	listenSettingDifficultyB();
	listenSettingLevelB();

	brickVar.saveBtn.addEventListener('click', () =>
	{
		if (live === true)
		{
			roomMultiView();
			updateLiveSetting();
		}
		else
		{
<<<<<<< HEAD
			showGameSelectionView();
=======
			// showGameSelectionView();
			renderPage("pongGameSolo");
>>>>>>> new_user
			updateSettingB();
		}
	});
}

export function showSettingMultiViewB(live)
{
	history.pushState({ view: 'game'}, '', `?view=solo/settings`);

	displaySettingB();
	getSettingBtn();

	brickVar.powerUpSelection.style.display = 'block';
	brickVar.btnPowerUp.style.display = 'block';

	listenSettingPUB();
	listenSettingDifficultyB();
	listenSettingLevelB();

	brickVar.saveBtn.addEventListener('click', () =>
	{
		// showGameBrickMultiView();
<<<<<<< HEAD
		showGameSelectionMultiView();
=======
		// showGameSelectionMultiView();
		renderPage("pongGameMulti");
>>>>>>> new_user
		updateSettingB();
	});
}
export function updateSettingB()
{
	brickVar.settingChanged = true;
	var difficulty = null;	
	var level = null;
	var powerUp = null;

	if (brickVar.difficulty)
		difficulty = brickVar.difficulty;
	else
	{
		difficulty = 'medium';
		updateDifficultySelectionB('medium');
	}

	if (brickVar.castle)
		level = 'the Castle';
	else if (brickVar.x)
		level = 'X Level';
	else if (brickVar.invader)
		level = 'Space Invader';
	else 
	{
		level = 'Classic';
		updateLevelSelectionB('clasic');
	}

	if (brickVar.powerUpEnable)
		powerUp = "✅";
	else
	{
		powerUp = "❌";
		updatePowerUpSelectionB(false);
	}

	displayUpdateSetting(difficulty, powerUp, level);
}


export function updateDifficultySelectionB(level)
{
	if (level == 'easy')
	{
		console.log("easy mode");
		brickVar.initDx = 2;
		brickVar.initDy = 2;
		brickVar.difficulty = 'easy';
	}
	if (level == 'medium')
	{
		console.log('medium mode');
		brickVar.initDx = 5;
		brickVar.initDy = 5;
		brickVar.difficulty = 'medium';
	}
	if (level == 'hard')
	{
		brickVar.initDx = 7;
		brickVar.initDy = 7;
		console.log('hard mode');
		brickVar.difficulty = 'hard';
	}
	displayBallB();
}


export function updateSettingSelectionForSecond()
{
	brickVar2.initDx = brickVar.initDx;
	brickVar2.initDy = brickVar.initDy;
	brickVar2.currLevel = brickVar.currLevel;
	brickVar2.powerUpEnable = brickVar.powerUpEnable;
	brickVar2.difficulty = brickVar.difficulty;
}
export function displaySettingB()
{
	const level1Url = "static/css/images/classicLevel.png";
	const level2Url = "static/css/images/castleLevel.png";
	const level3Url = "static/css/images/xLevel.png";
	const level4Url = "static/css/images/invadersLevel.png";
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
						<img src="${level1Url}" alt="classicMap" class="map-image">
						<button id="classicLevel" class="level">Classic</button>
					</div>
					<div id="map2" class="mapOption" data-map-name="classicMap">
						<img src="${level2Url}" alt="footMap1" class="map-image">
						<button id="castleLevel" class="level">The Castle</button>
					</div>
					<div id="map3" class="mapOption" data-map-name="clasicMap">
						<img src="${level3Url}" alt="customMap1" class="map-image">
						<button id="xLevel" class="level">X</button>
					</div>
					<div id="map3" class="mapOption" data-map-name="clasicMap">
						<img src="${level4Url}" alt="customMap1" class="map-image">
						<button id="invaderLevel" class="level">Space Invader</button>
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

export function listenSettingPUB()
{

	brickVar.withPowerUp.addEventListener('click', () =>
	{
		brickVar.withPowerUp.classList.add('selected');
		brickVar.withoutPowerUp.classList.remove('selected');
		updatePowerUpSelectionB(true);
	});

	brickVar.withoutPowerUp.addEventListener('click', () => 
	{
		brickVar.withoutPowerUp.classList.add('selected');
		brickVar.withPowerUp.classList.remove('selected');
		updatePowerUpSelectionB(false); 
	});
}

export function listenSettingDifficultyB()
{

	brickVar.easy.addEventListener('click', () => 
	{
		brickVar.easy.classList.add('selected');
		brickVar.medium.classList.remove('selected');
		brickVar.hard.classList.remove('selected');
		updateDifficultySelectionB('easy');
	});
	
	brickVar.medium.addEventListener('click', () => 
	{
		brickVar.easy.classList.remove('selected');
		brickVar.medium.classList.add('selected');
		brickVar.hard.classList.remove('selected');
		updateDifficultySelectionB('medium');
	});

	brickVar.hard.addEventListener('click', () => 
	{
		brickVar.easy.classList.remove('selected');
		brickVar.medium.classList.remove('selected');
		brickVar.hard.classList.add('selected');
		updateDifficultySelectionB('hard');
	});
}

export function listenSettingLevelB()
{
	brickVar.classicLevel.addEventListener('click', () =>
	{
		brickVar.classicLevel.classList.add('selected');
		brickVar.castleLevel.classList.remove('selected');
		brickVar.xLevel.classList.remove('selected');
		brickVar.invaderLevel.classList.remove('selected');
		updateLevelSelectionB('classic');
	});

	brickVar.castleLevel.addEventListener('click', () =>
	{
		brickVar.classicLevel.classList.remove('selected');
		brickVar.castleLevel.classList.add('selected');
		brickVar.xLevel.classList.remove('selected');
		brickVar.invaderLevel.classList.remove('selected');
		updateLevelSelectionB('castle');
	});

	brickVar.xLevel.addEventListener('click', () =>
	{
		brickVar.classicLevel.classList.remove('selected');
		brickVar.castleLevel.classList.remove('selected');
		brickVar.xLevel.classList.add('selected');
		brickVar.invaderLevel.classList.remove('selected');
		updateLevelSelectionB('x');
	});

	brickVar.invaderLevel.addEventListener('click', () =>
	{
		brickVar.classicLevel.classList.remove('selected');
		brickVar.castleLevel.classList.remove('selected');
		brickVar.xLevel.classList.remove('selected');
		brickVar.invaderLevel.classList.add('selected');
		updateLevelSelectionB('invader');
	});
}

export function checkSettingB()
{
	if (brickVar.settingChanged === false)
	{
		updatePowerUpSelectionB(false); 
		updateDifficultySelectionB('medium');
		updateLevelSelectionB('classic')
	}
}	

export function getSettingBtn()
{
	brickVar.powerUpSelection = document.getElementById('powerUpSelection');
	brickVar.btnPowerUp = document.getElementById('btnPowerUp');
	brickVar.withPowerUp = document.getElementById('withPowerUps');
	brickVar.withoutPowerUp = document.getElementById('withoutPowerUps');
	brickVar.easy = document.getElementById('easy');
	brickVar.medium = document.getElementById('medium');
	brickVar.hard = document.getElementById('hard');
	brickVar.saveBtn = document.getElementById('saveBtn');
	brickVar.classicLevel = document.getElementById('classicLevel');
	brickVar.castleLevel = document.getElementById('castleLevel');
	brickVar.xLevel = document.getElementById('xLevel');
	brickVar.invaderLevel = document.getElementById('invaderLevel');
}

export function displayUpdateSetting(difficulty, powerUp, level)
{
	const settingContain = document.getElementById('settings-column2');

	settingContain.innerHTML = '';

	const settingItem = document.createElement('div');

	settingItem.innerHTML = `
	<p>Difficulty: <span id="difficultyChoice2">${difficulty}</span></p>
	<p>Power-Up: <span id="powerupChoice2">${powerUp}</span></p>
	<p>Level: <span id="levelSelected2">${level}</span></p>`;

	settingContain.appendChild(settingItem);
}
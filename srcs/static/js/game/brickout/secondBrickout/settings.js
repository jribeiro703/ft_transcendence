import brickVar2 from "./var.js";
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
export function showSettingViewB(live)
{
	history.pushState({ view: 'game'}, '', `?view=solo/settings`);

	displaySettingB();
	getSettingBtn();

	if(live === false)
	{
		brickVar2.powerUpSelection.style.display = 'block';
		brickVar2.btnPowerUp.style.display = 'block';
	}
	else
	{
		brickVar2.powerUpSelection.style.display = 'none';
		brickVar2.btnPowerUp.style.display = 'none';
	}		

	listenSettingPUB();
	listenSettingDifficultyB();
	listenSettingLevelB();

	brickVar2.saveBtn.addEventListener('click', () =>
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

	brickVar2.powerUpSelection.style.display = 'block';
	brickVar2.btnPowerUp.style.display = 'block';

	listenSettingPUB();
	listenSettingDifficultyB();
	listenSettingLevelB();

	brickVar2.saveBtn.addEventListener('click', () =>
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
	brickVar2.settingChanged = true;
	var difficulty = null;	
	var level = null;
	var powerUp = null;

	if (brickVar2.difficulty)
		difficulty = brickVar2.difficulty;
	else
	{
		difficulty = 'medium';
		updateDifficultySelectionB('medium');
	}

	if (brickVar2.castle)
		level = 'the Castle';
	else if (brickVar2.x)
		level = 'X Level';
	else if (brickVar2.invader)
		level = 'Space Invader';
	else 
	{
		level = 'Classic';
		updateLevelSelectionB('clasic');
	}

	if (brickVar2.powerUpEnable)
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
		brickVar2.initDx = 2;
		brickVar2.initDy = 2;
		brickVar2.difficulty = 'easy';
	}
	if (level == 'medium')
	{
		console.log('medium mode');
		brickVar2.initDx = 5;
		brickVar2.initDy = 5;
		brickVar2.difficulty = 'medium';
	}
	if (level == 'hard')
	{
		brickVar2.initDx = 7;
		brickVar2.initDy = 7;
		console.log('hard mode');
		brickVar2.difficulty = 'hard';
	}
	displayBallB();
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

	brickVar2.withPowerUp.addEventListener('click', () =>
	{
		brickVar2.withPowerUp.classList.add('selected');
		brickVar2.withoutPowerUp.classList.remove('selected');
		updatePowerUpSelectionB(true);
	});

	brickVar2.withoutPowerUp.addEventListener('click', () => 
	{
		brickVar2.withoutPowerUp.classList.add('selected');
		brickVar2.withPowerUp.classList.remove('selected');
		updatePowerUpSelectionB(false); 
	});
}

export function listenSettingDifficultyB()
{

	brickVar2.easy.addEventListener('click', () => 
	{
		brickVar2.easy.classList.add('selected');
		brickVar2.medium.classList.remove('selected');
		brickVar2.hard.classList.remove('selected');
		updateDifficultySelectionB('easy');
	});
	
	brickVar2.medium.addEventListener('click', () => 
	{
		brickVar2.easy.classList.remove('selected');
		brickVar2.medium.classList.add('selected');
		brickVar2.hard.classList.remove('selected');
		updateDifficultySelectionB('medium');
	});

	brickVar2.hard.addEventListener('click', () => 
	{
		brickVar2.easy.classList.remove('selected');
		brickVar2.medium.classList.remove('selected');
		brickVar2.hard.classList.add('selected');
		updateDifficultySelectionB('hard');
	});
}

export function listenSettingLevelB()
{
	brickVar2.classicLevel.addEventListener('click', () =>
	{
		brickVar2.classicLevel.classList.add('selected');
		brickVar2.castleLevel.classList.remove('selected');
		brickVar2.xLevel.classList.remove('selected');
		brickVar2.invaderLevel.classList.remove('selected');
		updateLevelSelectionB('classic');
	});

	brickVar2.castleLevel.addEventListener('click', () =>
	{
		brickVar2.classicLevel.classList.remove('selected');
		brickVar2.castleLevel.classList.add('selected');
		brickVar2.xLevel.classList.remove('selected');
		brickVar2.invaderLevel.classList.remove('selected');
		updateLevelSelectionB('castle');
	});

	brickVar2.xLevel.addEventListener('click', () =>
	{
		brickVar2.classicLevel.classList.remove('selected');
		brickVar2.castleLevel.classList.remove('selected');
		brickVar2.xLevel.classList.add('selected');
		brickVar2.invaderLevel.classList.remove('selected');
		updateLevelSelectionB('x');
	});

	brickVar2.invaderLevel.addEventListener('click', () =>
	{
		brickVar2.classicLevel.classList.remove('selected');
		brickVar2.castleLevel.classList.remove('selected');
		brickVar2.xLevel.classList.remove('selected');
		brickVar2.invaderLevel.classList.add('selected');
		updateLevelSelectionB('invader');
	});
}

export function checkSettingB()
{
	if (brickVar2.settingChanged === false)
	{
		updatePowerUpSelectionB(false); 
		updateDifficultySelectionB('medium');
		updateLevelSelectionB('classic')
	}
}	

export function getSettingBtn()
{
	brickVar2.powerUpSelection = document.getElementById('powerUpSelection');
	brickVar2.btnPowerUp = document.getElementById('btnPowerUp');
	brickVar2.withPowerUp = document.getElementById('withPowerUps');
	brickVar2.withoutPowerUp = document.getElementById('withoutPowerUps');
	brickVar2.easy = document.getElementById('easy');
	brickVar2.medium = document.getElementById('medium');
	brickVar2.hard = document.getElementById('hard');
	brickVar2.saveBtn = document.getElementById('saveBtn');
	brickVar2.classicLevel = document.getElementById('classicLevel');
	brickVar2.castleLevel = document.getElementById('castleLevel');
	brickVar2.xLevel = document.getElementById('xLevel');
	brickVar2.invaderLevel = document.getElementById('invaderLevel');
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
import gameVar from "./var.js";
import { updateDifficultySelection, updateLevelSelection } from "./gameMode.js";
import { updatePowerUpSelection } from "./powerUp.js";
import { roomMultiView } from './init.js'
import { showGameplaySoloView } from "./gameView.js";

export function showSettingView(live)
{

	history.pushState({ view: 'game'}, '', `?view=solo/settings`);
	const pongUrl = "static/css/images/classic.png";
	const brickUrl = "static/css/images/brick.png";
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
					<div id="map2" class="mapOption" data-map-name="customMap1">
						<img src="${brickUrl}" alt="customMap1" class="map-image">
						<button id="bricksLevel" class="level">Brick Level</button>
					</div>
				</div>
			</div>
		</div>
		<div>
			<button id="saveBtn">Save and Return</button>
		</div>
	</div>`

	maincontent.appendChild(insertTo);


	gameVar.powerUpSelection = document.getElementById('powerUpSelection');
	gameVar.btnPowerUp = document.getElementById('btnPowerUp');
	gameVar.withPowerUp = document.getElementById('withPowerUps');
	gameVar.withoutPowerUp = document.getElementById('withoutPowerUps');
	gameVar.easy = document.getElementById('easy');
	gameVar.medium = document.getElementById('medium');
	gameVar.hard = document.getElementById('hard');
	gameVar.tableTennis = document.getElementById('tableTennis');
	gameVar.brickLevel = document.getElementById('bricksLevel');
	gameVar.saveBtn = document.getElementById('saveBtn');

	// gameVar.gameView.style.display = 'none';
	// gameVar.quickGameBtn.style.display = 'none';
	// gameVar.startGameBtn.style.display = 'none';
	// gameVar.playsoloGameBtn.style.display = 'none';
	// gameVar.tournamentGameBtn.style.display = 'none';
	// gameVar.playmultiGameBtn.style.display = 'none';

	// gameVar.defaultView.style.display = 'none';
	// gameVar.roomView.style.display = 'none';
	// gameVar.createRoomBtn.style.display = 'none';
	// gameVar.refreshBtn.style.display = 'none';
	// gameVar.settingBtn.style.display = 'none';

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

	gameVar.withPowerUp.addEventListener('click', () =>
	{
		gameVar.withPowerUp.classList.add('selected');
		gameVar.withoutPowerUp.classList.remove('selected');
		updatePowerUpSelection(true);

	});

	gameVar.withoutPowerUp.addEventListener('click', () => 
	{
		gameVar.withoutPowerUp.classList.add('selected');
		gameVar.withPowerUp.classList.remove('selected');
		updatePowerUpSelection(false); 
	});

	gameVar.easy.addEventListener('click', () => 
	{
		gameVar.easy.classList.add('selected');
		gameVar.medium.classList.remove('selected');
		gameVar.hard.classList.remove('selected');
		updateDifficultySelection('easy');
	});
	
	gameVar.medium.addEventListener('click', () => 
	{
		gameVar.easy.classList.remove('selected');
		gameVar.medium.classList.add('selected');
		gameVar.hard.classList.remove('selected');
		updateDifficultySelection('medium');
	});

	gameVar.hard.addEventListener('click', () => 
	{
		gameVar.easy.classList.remove('selected');
		gameVar.medium.classList.remove('selected');
		gameVar.hard.classList.add('selected');
		updateDifficultySelection('hard');
	});

	gameVar.tableTennis.addEventListener('click', () =>
	{
		gameVar.tableTennis.classList.add('selected');
		gameVar.brickLevel.classList.remove('selected');
		updateLevelSelection('tableTennis');
	});

	gameVar.brickLevel.addEventListener('click', () =>
	{
		gameVar.tableTennis.classList.remove('selected');
		gameVar.brickLevel.classList.add('selected');
		updateLevelSelection('brickLevel');
	});

	gameVar.saveBtn.addEventListener('click', () =>
	{
		if (live === true)
		{
			updateLiveSetting();
			roomMultiView();
		}
		else
		{
			showGameplaySoloView();
			updateSetting();
		}
	});
}

export function updateSetting()
{
	gameVar.settingsChanged = true;
	const difficulty = gameVar.difficulty;
	var level = null;
	var powerUp = null;

	if (gameVar.customMap)
		level = 'Brick Level';
	else
		level = 'Table Tennis';

	if (gameVar.powerUpEnable)
		powerUp = "✅";
	else
		powerUp = "❌";

	const settingContain = document.getElementById('settings-column');

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
	const difficulty = gameVar.difficulty;
	var level = null;

	if (gameVar.customMap)
		level = 'Brick Level';
	else
		level = 'Table Tennis'

	const settingContain = document.getElementById('setting-container');

	settingContain.innerHTML = '';

	const settingItem = document.createElement('div');

	settingItem.innerHTML = `
	Difficulty: 
	<span id="difficultyChoice">${difficulty}</span><br>
	Power-Ups:
	<span id="po
	Level:
	<span id="levelSelected">${level}</span>
	`;

	settingContain.appendChild(settingItem);

}
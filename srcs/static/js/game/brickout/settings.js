import brickVar from "./var.js";
import { updatePowerUpSelectionB as updatePowerUpSelectionFirst} from "./powerUp.js";
import { updateLevelSelectionB as updateLevelSelectionFirst} from "./update.js";
import { updateDifficultySelectionB } from "./update.js";
import { listenSettingPUB } from "./listenerSetting.js";
import { updateDifficultySelectionSB } from "./secondBrickout/update.js";
import { listenSettingDifficultyB } from "./listenerSetting.js";
import { listenSettingLevelB } from "./listenerSetting.js";
import { listenSaveBtnB } from "./save.js";

export function showSettingViewB(info)
{
	brickVar.settingChanged = false;
	brickVar.checkDiff = false;
	brickVar.checkPu = false;
	brickVar.checkLevel = false
	displaySettingB();
	getSettingBtn();

	if(info === 'live')
	{
		brickVar.powerUpSelection.style.display = 'none';
		brickVar.btnPowerUp.style.display = 'none';
	}
	else
	{
		brickVar.powerUpSelection.style.display = 'block';
		brickVar.btnPowerUp.style.display = 'block';
	}		

	listenSettingPUB();
	listenSettingDifficultyB();
	listenSettingLevelB();

	listenSaveBtnB(info);

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
			<button id="saveBtn" disabled="true">Save and Return</button>
		</div>
	</div>`

	maincontent.appendChild(insertTo);
}

export function checkSettingB()
{
	if (brickVar.settingChanged === false)
	{
		console.log("check setting");
		updatePowerUpSelectionFirst(false); 
		updateDifficultySelectionB('medium');
		updateDifficultySelectionSB('medium');
		updateLevelSelectionFirst('classic')
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


// export function showSettingMultiViewB(live)
// {

// 	displaySettingB();
// 	getSettingBtn();

// 	brickVar.powerUpSelection.style.display = 'block';
// 	brickVar.btnPowerUp.style.display = 'block';

// 	listenSettingPUB();
// 	listenSettingDifficultyB();
// 	listenSettingLevelB();

// 	brickVar.saveBtn.addEventListener('click', () =>
// 	{
// 		// showGameBrickMultiView();
// 		showGameSelectionMultiView();
// 		updateSettingB();
// 		brickVar.settingChanged = true;
// 	});
// }
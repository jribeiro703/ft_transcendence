import brickVar from "./var.js";
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
import gameVar from "./var.js";
import { getBtnById, addPuBtn } from "./setting.js";
import { listenSettingPU, listenSettingDifficulty, listenSettingLevel, listenSettingMultiSave, listenSettingSave } from "./listenerSetting.js";

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
	gameVar.liveSettingChanged = true;
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
	listenSettingSave(live);
}
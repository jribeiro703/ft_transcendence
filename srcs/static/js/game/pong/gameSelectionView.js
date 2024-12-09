import gameVar from "./var.js";
import { listenSettingBtn, listenPlayBtn } from "./listenerSetting.js";
import { updateImageUrl } from "./update.js";
import { updateSetting } from "./setting.js";
import { updateSettingB } from "../brickout/update.js";

export function showGameSelectionView() {
  gameVar.liveMatch = false;
  gameVar.localGame = false;
  const maincontent = document.getElementById("mainContent");
  maincontent.innerHTML = "";
  const gameSelection = document.createElement("div");

  gameSelection.style.width = "100%";
  gameSelection.style.flex = "1 0 0";

  updateImageUrl();

  gameSelection.innerHTML = `
	<div id="settingView" class="d-flex">
		<div class="container-game">
			<div class="game-row">
				<div class="game-image">
					<img id="gameImage" src="${gameVar.pongUrl}" alt="pongGame">
				</div>
				<div class="game-settings">
					<div id="settingsContainer" class="settings-info">
						<div class="settings-inline">
							<button id="settingBtn1" class="main-btn settingsSelect-button">Settings</button>
							<div class="settings-column" id="settings-column">
								<p>Difficulty: <span id="difficultyChoice">Medium</span></p>
								<p>Power-Up: <span id="powerupChoice">❌</span></p>
								<p>Level: <span id="levelSelected">Table Tennis</span></p>
							</div>
						</div>
					</div>
				</div>
				<div class="game-play">
					<button id="playBtn" class="main-btn settingsSelect-button">Play</button>
				</div>
			</div>
			<div class="game-row">
				<div class="game-image">
					<img id="gameImage" src="${gameVar.brickUrl}" alt="brickGame">
				</div>
				<div class="game-settings">
					<div id="settingsContainer" class="settings-info">
						<div class="settings-inline">
							<button id="settingBtn2" class="main-btn settingsSelect-button">Settings</button>
							<div class="settings-column2" id="settings-column2">
								<p>Difficulty: <span id="difficultyChoice2">Medium</span></p>
								<p>Power-Up: <span id="powerupChoice2">❌</span></p>
								<p>Level: <span id="levelSelected2">Classic</span></p>
							</div>
						</div>
					</div>
				</div>
				<div class="game-play">
					<button id="playBtn2" class="main-btn settingsSelect-button">Play</button>
				</div>
			</div>
		</div>
	</div>`;

  maincontent.appendChild(gameSelection);
  gameVar.settingBtn1 = document.getElementById("settingBtn1");
  gameVar.settingBtn2 = document.getElementById("settingBtn2");
  gameVar.playBtn = document.getElementById("playBtn");
  gameVar.playBtn2 = document.getElementById("playBtn2");

  updateSetting();
  updateSettingB();
  listenSettingBtn();
  listenPlayBtn();
}

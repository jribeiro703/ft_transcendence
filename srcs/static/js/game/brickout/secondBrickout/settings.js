import brickVar2 from "./var.js";
import {
  updatePowerUpSelectionB,
  updateDifficultySelectionSB,
  updateLevelSelectionB,
} from "./update.js";
import { showGameSelectionMultiView } from "../../pong/gameSelectionView.js";
import {
  listenSettingPUB,
  listenSettingDifficultyB,
  listenSettingLevelB,
} from "./listenerSetting.js";
import { updateSettingB } from "./update.js";
// import { displaySettingViewB } from "./display.js";

// export function showSettingMultiViewB(live)
// {
// 	displaySettingViewB();
// 	getSettingBtn();
//
// 	brickVar2.powerUpSelection.style.display = 'block';
// 	brickVar2.btnPowerUp.style.display = 'block';
//
// 	listenSettingPUB();
// 	listenSettingDifficultyB();
// 	listenSettingLevelB();
//
// 	brickVar2.saveBtn.addEventListener('click', () =>
// 	{
// 		showGameSelectionMultiView();
// 		updateSettingB();
// 	});
// }

export function checkSettingB() {
  if (brickVar2.settingChanged === false) {
    updatePowerUpSelectionB(false);
    updateDifficultySelectionSB("medium");
    updateLevelSelectionB("classic");
  }
}

export function getSettingBtn() {
  brickVar2.powerUpSelection = document.getElementById("powerUpSelection");
  brickVar2.btnPowerUp = document.getElementById("btnPowerUp");
  brickVar2.withPowerUp = document.getElementById("withPowerUps");
  brickVar2.withoutPowerUp = document.getElementById("withoutPowerUps");
  brickVar2.easy = document.getElementById("easy");
  brickVar2.medium = document.getElementById("medium");
  brickVar2.hard = document.getElementById("hard");
  brickVar2.saveBtn = document.getElementById("saveBtn");
  brickVar2.classicLevel = document.getElementById("classicLevel");
  brickVar2.castleLevel = document.getElementById("castleLevel");
  brickVar2.xLevel = document.getElementById("xLevel");
  brickVar2.invaderLevel = document.getElementById("invaderLevel");
}

export function displayUpdateSetting(difficulty, powerUp, level) {
  const settingContain = document.getElementById("settings-column2");

  settingContain.innerHTML = "";

  const settingItem = document.createElement("div");

  settingItem.innerHTML = `
	<p>Difficulty: <span id="difficultyChoice2">${difficulty}</span></p>
	<p>Power-Up: <span id="powerupChoice2">${powerUp}</span></p>
	<p>Map: <span id="levelSelected2">${level}</span></p>`;

  settingContain.appendChild(settingItem);
}

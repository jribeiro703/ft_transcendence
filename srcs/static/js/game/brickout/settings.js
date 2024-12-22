import brickVar from "./var.js";
import { updatePowerUpSelectionB as updatePowerUpSelectionFirst } from "./powerUp.js";
import {
  updateLevelSelectionB,
  updateLevelSelectionB as updateLevelSelectionFirst,
} from "./update.js";
import { updateDifficultySelectionB } from "./update.js";
import { listenSettingPUB } from "./listenerSetting.js";
import { updateDifficultySelectionSB } from "./secondBrickout/update.js";
import { listenSettingDifficultyB } from "./listenerSetting.js";
import { listenSettingLevelB } from "./listenerSetting.js";
import { listenSaveBtnB } from "./save.js";
import { displaySettingViewB } from "./display.js";
import gameVar from "../pong/var.js";

export function showSettingViewB(info) {
  brickVar.settingChanged = false;
  brickVar.checkDiff = false;
  brickVar.checkPu = false;
  brickVar.checkLevel = false;
  displaySettingViewB();
  getSettingBtn();

  brickVar.btnPowerUp.style.display = "block";

  listenSettingPUB();
  listenSettingDifficultyB();
  listenSettingLevelB();

  listenSaveBtnB(info);
}

export function checkSettingB() {
  if (brickVar.settingChanged === false) {
    console.log("check setting");
    updatePowerUpSelectionFirst(false, true);
    updateDifficultySelectionB("medium");
    updateDifficultySelectionSB("medium");
    updateLevelSelectionFirst("classic", true);
  }
}

export function getSettingBtn() {
  brickVar.btnPowerUp = document.getElementById("btnPowerUp");
  brickVar.withPowerUp = document.getElementById("withPowerUps");
  brickVar.withoutPowerUp = document.getElementById("withoutPowerUps");
  brickVar.easy = document.getElementById("easy");
  brickVar.medium = document.getElementById("medium");
  brickVar.hard = document.getElementById("hard");
  brickVar.saveBtn = document.getElementById("saveBtn");
  brickVar.classicLevel = document.getElementById("classicLevel");
  brickVar.castleLevel = document.getElementById("castleLevel");
  brickVar.xLevel = document.getElementById("xLevel");
  brickVar.invaderLevel = document.getElementById("invaderLevel");
}

export function displaySettingB(difficulty, powerUp, level) {
  const settingContain = document.getElementById("settings-column2");

  settingContain.innerHTML = "";

  const settingItem = document.createElement("div");

  settingItem.innerHTML = `
	<p>Difficulty: <span id="difficultyChoice2">${difficulty}</span></p>
	<p>Power-Up: <span id="powerupChoice2">${powerUp}</span></p>
	<p>Map: <span id="levelSelected2">${level}</span></p>`;

  settingContain.appendChild(settingItem);
}
export function updateLiveSettingB() {
  brickVar.settingChanged = true;
  var difficulty = null;
  var level = null;

  console.log("update diff: ", brickVar.difficulty);
  if (brickVar.difficulty) difficulty = brickVar.difficulty;
  else difficulty = "medium";

  console.log("update level: ", brickVar.currLevel);
  if (brickVar.currLevel) level = brickVar.currLevel;
  else level = "classic";

  const settingContain = document.getElementById("setting-container");
  settingContain.innerHTML = "";
  const settingItem = document.createElement("div");
  settingItem.innerHTML = `
	Difficulty: 
	<span id="difficultyChoice">${difficulty}</span><br>
	Map:
	<span id="levelSelected">${level}</span>
	`;
  settingContain.appendChild(settingItem);
}
// export function checkSettingLiveB()
// {
// 	if (brickVar.settingsChanged === false)
// 	{
// 		updateDifficultySelectionB('medium');
// 		updateLevelSelectionB('');
// 	}
// }


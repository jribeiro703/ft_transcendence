import gameVar from "./var.js";
import { listenSettingBtn, listenPlayBtn } from "./listenerSetting.js";
import { updateImageUrl } from "./update.js";
import { displayGameSelectionSolo, displayGameSelectionMulti } from "./display.js";
import { getElementGameSelection } from "./getElement.js";
import { initializeCanvas } from "./canvas.js";
import { listenSettingMultiBtn } from "./listenerSetting.js";
import { updateSetting } from "./setting.js";
import { updateSettingB } from "../brickout/update.js";
import { listenPlayMultiBtn } from "./listenerSetting.js";

export function showGameSelectionView()
{
	gameVar.liveMatch = false;
	gameVar.localGame = false;

	updateImageUrl();
	displayGameSelectionSolo();

	gameVar.settingBtn1 = document.getElementById('settingBtn1');
	gameVar.settingBtn2 = document.getElementById('settingBtn2');
	gameVar.playBtn = document.getElementById('playBtn');
	gameVar.playBtn2 = document.getElementById('playBtn2');

	updateSetting();
	updateSettingB();
	listenSettingBtn();
	listenPlayBtn();
}

export function showGameSelectionMultiView()
{
	console.log("init game selection multi");
	displayGameSelectionMulti();
	getElementGameSelection();

	listenSettingMultiBtn();
	updateSetting();
	updateSettingB();
	listenPlayMultiBtn();
}
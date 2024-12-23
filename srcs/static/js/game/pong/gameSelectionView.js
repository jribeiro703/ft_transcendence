import gameVar from "./var.js";
import { listenSettingBtn, listenPlayBtn } from "./listenerSetting.js";
import { updateImageUrl } from "./update.js";
import { displayGameSelectionSolo, displayGameSelectionMulti, displaySetting } from "./display.js";
import { getElementGameSelection } from "./getElement.js";
import { listenSettingMultiBtn } from "./listenerSetting.js";
import { updateLiveSetting, updateSetting } from "./setting.js";
import { updateSettingB } from "../brickout/update.js";
import { listenPlayMultiBtn } from "./listenerSetting.js";
import { getUserInfos } from "../getUser.js";

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

	listenSettingBtn();
	listenPlayBtn();
	updateSetting();
	updateSettingB();
}

export function showGameSelectionMultiView()
{
	getUserInfos();
	updateImageUrl();
	displayGameSelectionMulti();
	getElementGameSelection();

	listenSettingMultiBtn();
	listenPlayMultiBtn();
	updateSetting();
	updateSettingB();
	updateImageUrl();
}

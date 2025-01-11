import gameVar from "./var.js";
import { listenSettingBtn, listenPlayBtn } from "./listenerSetting.js";
import { updateImageUrl } from "./update.js";
import { displayGameSelectionSolo, displayGameSelectionMulti } from "./display.js";
import { getElementGameSelection } from "./getElement.js";
import { listenSettingMultiBtn } from "./listenerSetting.js";
import { updateSetting } from "./setting.js";
import { updateSettingB } from "../brickout/update.js";
import { listenPlayMultiBtn } from "./listenerSetting.js";
import { getUserInfos } from "../getUser.js";
import { clearAllpongStates } from "./reset.js";
import { clearAllBrickStates } from "../brickout/manage.js";

export function showGameSelectionView()
{
	updateImageUrl();
	displayGameSelectionSolo();

	gameVar.liveMatch = false;
	gameVar.localGame = false;
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
	clearAllpongStates();
	clearAllBrickStates();
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

import gameVar from "./var.js";
import { addPuBtn } from "./setting.js";
import { getBtnById } from "./getElement.js";
import { listenSettingPU, listenSettingDifficulty, listenSettingLevel, listenSettingMultiSave, listenSettingSave } from "./listenerSetting.js";
import { displaySettingView, displaySettingMultiView } from "./display.js";

export function showSettingMultiView(live)
{
	displaySettingMultiView();

	getBtnById();
	addPuBtn(live);

	listenSettingPU();
	listenSettingDifficulty();
	listenSettingLevel();
	listenSettingMultiSave(live);
}

export function showSettingView(info)
{
	gameVar.settingsChanged = false;
	gameVar.checkDiff = false;
	gameVar.checkLevel = false;
	gameVar.checkPu = false;

	displaySettingView();
	getBtnById();
	addPuBtn(info);
	listenSettingPU();
	listenSettingDifficulty();
	listenSettingLevel();
	listenSettingSave(info);
}

export function checkSaveBtn()
{
	if (gameVar.checkPu && gameVar.checkLevel && gameVar.checkDiff)
	{
		const btn = document.getElementById('saveBtn');
		btn.disabled = false;
		gameVar.settingsChanged = true;
	}
}
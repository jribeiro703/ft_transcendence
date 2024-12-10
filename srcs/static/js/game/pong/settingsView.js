import gameVar from "./var.js";
import { addPuBtn } from "./setting.js";
import { getBtnById } from "./getElement.js";
import { listenSettingPU, listenSettingDifficulty, listenSettingLevel, listenSettingMultiSave, listenSettingSave } from "./listenerSetting.js";
import { displaySettingView, displaySettingMultiView } from "./display.js";

export function showSettingMultiView(info)
{
	// displaySettingMultiView();
	displaySettingView();

	getBtnById();
	addPuBtn(info);

	listenSettingPU();
	listenSettingDifficulty();
	listenSettingLevel();
	listenSettingMultiSave(info);
}

export function showSettingView(info)
{
	console.log('on passs setting change a false');
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
	if (!gameVar.liveMatch)
	{
		if (gameVar.checkPu && gameVar.checkLevel && gameVar.checkDiff)
		{
			const btn = document.getElementById('saveBtn');
			btn.disabled = false;
			gameVar.settingsChanged = true;
			console.log("on passe setting change a true");
		}
	}
	else
	{
		if (gameVar.checkLevel && gameVar.checkDiff)
		{
			const btn = document.getElementById('saveBtn');
			btn.disabled = false;
			gameVar.settingsChanged = true;
		}
	
	}
}
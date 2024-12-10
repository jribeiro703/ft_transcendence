import brickVar from "./var.js";
import { updateSettingB } from "./update.js"
import { renderPageGame } from "../HistoryManager.js";

export function listenSaveBtnB(info)
{
	brickVar.saveBtn.addEventListener('click', () =>
	{
		if (info === 'live')
		{
			renderPageGame('brickoutLobby', true);
		}
		else if (info === 'local')
		{
			renderPageGame("gameSelectionMulti", true);
			updateSettingB();
		}
		else
		{
			renderPageGame("gameSelectionSolo", true);
			updateSettingB();
		}
	});
}
export function checkSaveBtn()
{
	console.log("check btn");
	if (brickVar.checkPu && brickVar.checkLevel && brickVar.checkDiff)
	{
		const btn = document.getElementById('saveBtn');
		btn.disabled = false;
		brickVar.settingChanged = true;
	}
}

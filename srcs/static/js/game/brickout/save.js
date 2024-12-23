import brickVar from "./var.js";
import { updateSettingB } from "./update.js"
import { renderPageGame } from "../HistoryManager.js";
import { updateLiveSettingB } from "./settings.js";

export function listenSaveBtnB(info)
{
	brickVar.saveBtn.addEventListener('click', async () =>
	{
		if (info === 'live')
		{
			console.log("saveBtn render and update");
			// await renderPageGame('brickoutLobby', true);
			renderPageGame('brickoutLobby', true);
			updateLiveSettingB();
		}
		else if (info === 'local')
		{
			// await renderPageGame("gameSelectionMulti", true);
			renderPageGame("gameSelectionMulti", true);
			updateSettingB();
		}
		else
		{
			// await renderPageGame("gameSelectionSolo", true);
			renderPageGame("gameSelectionSolo", true);
			updateSettingB();
		}
	});
}
export function checkSaveBtn()
{
	if (brickVar.checkPu && brickVar.checkLevel && brickVar.checkDiff)
	{
		const btn = document.getElementById('saveBtn');
		btn.disabled = false;
		brickVar.settingChanged = true;
	}
}

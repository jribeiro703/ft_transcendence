import brickVar from "./var.js";
import { renderPageGame } from "../HistoryManager.js";
import { updateLiveSettingB } from "./settings.js";

export function listenSaveBtnB(info)
{
	brickVar.saveBtn.addEventListener('click', async () =>
	{
		if (info === 'live')
		{
			renderPageGame('brickoutLobby', true);
			updateLiveSettingB();
		}
		else if (info === 'local')
		{
			renderPageGame("gameSelectionMulti", true);
		}
		else
		{
			renderPageGame("gameSelectionSolo", true);
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

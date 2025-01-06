import { handleNextLevelB, restartLevelB } from "./level.js";
import brickVar2 from "./var.js";
import { renderPageGame } from "../../HistoryManager.js";

export function listenNextLevelBtn()
{
	const nextLevelBtn = document.getElementById("nextLevelBtn");
	const quitBtn = document.getElementById("quitBtn");
	const restartLevelBtn = document.getElementById("restartLevelBtn")
	if (nextLevelBtn)
		nextLevelBtn.addEventListener("click", handleNextLevelB);
	if (restartLevelBtn)
		restartLevelBtn.addEventListener("click", restartLevelB);
	if (quitBtn)
		quitBtn.addEventListener('click', () => renderPageGame("home", true));
}

export function listenFinishBtn()
{
	const quitBtn = document.getElementById("quitBtn");
	const restartLevelBtn = document.getElementById("restartLevelBtn")
	if (restartLevelBtn)
		restartLevelBtn.addEventListener("click", () => restartLevelB);
	if (quitBtn)
		quitBtn.addEventListener('click', () => renderPageGame("home", true));
}


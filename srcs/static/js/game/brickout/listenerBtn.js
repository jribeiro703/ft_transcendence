import { handleNextLevelB, restartLevelB } from "./level.js";
import { clearAllBrickStates } from "./manage.js";
import { renderPageGame } from "../pong/myHistory.js";


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
		quitBtn.addEventListener('click', () => renderPageGame("home"), true);
}


export function listenLocalRematchBtn()
{
	const rematchBtn = document.getElementById('rematchBtn');
	const quitBtn = document.getElementById('quitBtn');
	if (rematchBtn)
	{
		rematchBtn.addEventListener('click', async () => 
		{
			clearAllBrickStates();
			await renderPageGame("playBrickoutLocal", true);
		});
	}
	if (quitBtn)
	{
		quitBtn.addEventListener('click', async () =>
		{
			clearAllBrickStates();
			await renderPageGame("home", true);
		});
	}
}



import { checkBtnB } from "./manage.js";

export function displayNextLevel()
{
	const mainContent = document.getElementById("mainContent");
	const btn = document.createElement('div');
	btn.innerHTML = `
		<div class="nextLevel" id="nextLevel">
			<button id="nextLevelBtn">Next Level</button> 
			<button id="restartLevelBtn">Restart Game</button> 
			<button id="quitBtn">Return Home</button>
		</div>
	`;
	mainContent.appendChild(btn);
	checkBtnB('nextLevel');
}

export function displayFinish()
{
	const mainContent = document.getElementById("mainContent");
	const btn = document.createElement('div');
	btn.innerHTML = `
	<div class="finish id="finish">
		<button id="restartLevelBtn">Restart Game</button> 
		<button id="quitBtn">Return Home</button>
	</div>
	`;
	mainContent.appendChild(btn);
	checkBtnB("finish");
}
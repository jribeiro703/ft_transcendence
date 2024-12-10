import gameVar from "./var.js";
import { checkball } from "./check.js";
import { clearAllpongStates, resetBall } from "./reset.js";
import { renderPageGame } from "./myHistory.js";

export function manageServer()
{
	if (gameVar.currentServer == 'player')
	{
		gameVar.x = gameVar.playerPaddleWidth + gameVar.ballRadius;
		gameVar.y = gameVar.playerPaddleY + gameVar.playerPaddleHeight / 2;
	}
	if (gameVar.currentServer === 'player2')
	{
		gameVar.x = gameVar.canvasW - gameVar.player2PaddleWidth - gameVar.ballRadius;
		gameVar.y = gameVar.player2PaddleY + gameVar.player2PaddleHeight / 2;
	}
	else if (gameVar.currentServer === 'ai')
	{
		gameVar.x = gameVar.canvasW - gameVar.aiPaddleWidth - gameVar.ballRadius;
		gameVar.y = gameVar.aiPaddleY + gameVar.aiPaddleHeight / 2;
	}
	if (gameVar.liveMatch)
		checkball();
}
export function checkServer()
{
	if (gameVar.scoreBoard.length % 2 == 0)
	{
		gameVar.currentServer = 'player';
		gameVar.aiServe = false;
		resetBall('player');
	}
	else
	{
		gameVar.currentServer = 'ai';
		gameVar.aiServe = true;
		resetBall('ai');
	}
}
export function addBtn()
{
	const mainContent = document.getElementById("mainContent");
	const btn = document.createElement('div');
	btn.innerHTML = `
	<div class="finish id="finish">
		<button id="returnLobbyBtn" class="">Return Lobby</button> 
		<button id="quitBtn">Return Home</button>
	</div>
	`;
	mainContent.appendChild(btn);
	const returnLobbtyBtn = document.getElementById("returnLobbyBtn");
	const quitBtn = document.getElementById("quitBtn");
		if (returnLobbtyBtn)
		{
			returnLobbtyBtn.addEventListener("click", () =>
			{
				gameVar.liveMatch = true;
				gameVar.game = 'pong';
				clearAllpongStates();
				renderPageGame("pongLobby", true);
			});
		}
		if (quitBtn)
		{
			quitBtn.addEventListener('click', () => 
			{
				gameVar.liveMatch = false;
				clearAllpongStates();
				renderPageGame("home", true);
			});

		}

}
import gameVar from "./var.js";
import { checkball } from "./check.js";
import { resetBall } from "./reset.js";

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

// export function addBtn()
// {
// 	console.log("add btn");
// 	let mainContent = document.getElementById("gameView");
// 	if (!mainContent)
// 	{
// 		console.log("error on btn container");
// 		return ;
// 	}
// 	const btn = document.createElement('div');
// 	btn.innerHTML = `
// 	<div class="finish" id="finish">
// 		<button id="returnLobby">Return Lobby</button> 
// 		<button id="quitBtn">Return Home</button>
// 	</div>
// 	`;
// 	mainContent.appendChild(btn);
// 	const returnLobby = document.getElementById("returnLobby");
// 	const quitBtn = document.getElementById("quitBtn");
// 	if (returnLobby)
// 	{
// 		returnLobby.addEventListener('click', () =>
// 		{

// 			console.log("returnlobby");
// 			gameVar.liveMatch = true;
// 			gameVar.game = 'pong';
// 			resetLiveMatch();
// 			renderPageGame("pongLobby", true);
// 		});
// 	}
// 	else
// 	{
// 		console.log("errr on returnlobby");
// 	}
// 	if (quitBtn)
// 	{
// 		quitBtn.addEventListener('click', () => 
// 		{
// 			clearAllpongStates();
// 			renderPageGame("home", true);
// 		});
// 	}
// }
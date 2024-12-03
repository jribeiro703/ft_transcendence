import gameVar from "./var.js";
import { listenBtn } from "./reset.js";
import { WIN_SCORE, GAP_SCORE } from "./const.js";

export function saveScore()
{
	const scoreEntry = {
		playerScore: gameVar.playerScore,
		aiscore: gameVar.aiScore
	}
	gameVar.scoreBoard.push(scoreEntry);
}
export function checkScore()
{
	console.log("check score");
	if ((gameVar.playerScore >= WIN_SCORE || gameVar.aiScore >= WIN_SCORE) && Math.abs(gameVar.playerScore - gameVar.aiScore) >= GAP_SCORE)
	{
		gameVar.matchOver = true;
		gameVar.startTime = false;
		gameVar.rematchBtn.style.display = 'block';
		gameVar.quitGameBtn.style.display = 'block';
		gameVar.rematchBtn.disabled = false;
		gameVar.rematchBtn.style.cursor = false ? "pointer" : "not-allowed";
		cancelAnimationFrame(gameVar.animationFrame);
		sendScore();
		listenBtn();
	}	
}

export function sendScore()
{
	console.log("we send =>");
	console.log("name player1"); // string
	console.log("name player2"); // string
	console.log("score player : ", gameVar.playerScore); // int
	console.log("score opponent : ", gameVar.aiScore); // int 
	console.log("game time : ", gameVar.gameTime); // int
	console.log("Difficulty : ",gameVar.difficulty); // string = 'easy' || 'medium' || 'hard'
	console.log("PowerUp active : ", gameVar.powerUpEnable); // boolean
	console.log("Level : ", gameVar.currentLevel);  // string = 'tableTennis' || 'Football' || 'tennis' ( maybe an other : 'classic')
}
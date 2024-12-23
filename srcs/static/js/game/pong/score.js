import gameVar from "./var.js";
import { listenBtn } from "./reset.js";
import { WIN_SCORE, GAP_SCORE } from "./const.js";
import { fetchAuthData } from "../../user/fetchData.js";


export async function sendScore()
{
	manageScore();
    const body = {
        username_one: gameVar.userName,
        username_two: gameVar.opponentName,
        score_one : gameVar.playerScore,
        score_two : gameVar.aiScore,
        time_played : gameVar.gameTime,
        difficulty : gameVar.difficulty,
        powerup : gameVar.powerUpEnable,
        level : gameVar.currentLevel,
		winner: gameVar.winner,
    }
    const responseObject = await fetchAuthData("/game/create/", "POST", body);
	console.log("score: responseObj: ", responseObject);

    if (responseObject.status === 201) {
        console.log("Game successfully");
    } else {
        console.log("Game failed");
    }
}

export function manageScore()
{
	if (gameVar.localGame)
	{
		gameVar.opponentName = 'player2';
	}
	if (gameVar.playerScore > gameVar.aiScore)
		gameVar.winnner = gameVar.userName;
	else
		gameVar.winner = gameVar.opponentName;
}

export function checkScore()
{
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

// export function sendScore()
// {
// 	console.log("we send =>");
// 	console.log("name player1"); // string
// 	console.log("name player2"); // string
// 	console.log("score player : ", gameVar.playerScore); // int
// 	console.log("score opponent : ", gameVar.aiScore); // int 
// 	console.log("game time : ", gameVar.gameTime); // int
// 	console.log("Difficulty : ",gameVar.difficulty); // string = 'easy' || 'medium' || 'hard'
// 	console.log("PowerUp active : ", gameVar.powerUpEnable); // boolean
// 	console.log("Level : ", gameVar.currentLevel);  // string = 'tableTennis' || 'Football' || 'tennis' ( maybe an other : 'classic')
// }
function loadCustomFont()
{
    return new FontFace('fontScore', 'url(/static/css/font/scoreboard-webfont.woff2)');
}
export function drawScoreBoardLive()
{
	loadCustomFont().load().then(function(font) 
	{
		document.fonts.add(font);
		const ctx = gameVar.scoreCtx;
		if (ctx)
		{
			ctx.clearRect(0, 0, gameVar.scoreCanvW, gameVar.scoreCanvH);
		
			ctx.font = '24px fontScore';
			ctx.fillStyle = '#FFFFFF';
			ctx.textAlign = 'center';
			
			const centerX = gameVar.scoreCanvW / 2;
			const leftX = gameVar.scoreCanvW * 0.25;
			const rightX = gameVar.scoreCanvW * 0.75;
			const y = 35;
			
			ctx.fillText(gameVar.userName, leftX, y);
			ctx.fillText(gameVar.opponentName, rightX, y);

			ctx.font = '32px fontScore';
			ctx.fillText(gameVar.playerScore, leftX, y + gameVar.scoreCanvH / 2);
			ctx.fillText(gameVar.aiScore, rightX, y + gameVar.scoreCanvH / 2);
			ctx.fillText('VS', centerX, y);
			const minutes = Math.floor(gameVar.gameTime / 60);
			const seconds = gameVar.gameTime % 60;
			const time = `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
			ctx.font = '20px fontScore';
			ctx.fillText(time, centerX, y + gameVar.scoreCanvH / 2);
		}
	}).catch(function(error)
	{
		console.error("Error on font load", error);
	});
}
export function drawScoreBoard()
{
    loadCustomFont().load().then(function(font) 
	{
        document.fonts.add(font);
		const ctx = gameVar.scoreCtx;
		if (ctx)
		{
			ctx.clearRect(0, 0, gameVar.scoreCanvW, gameVar.scoreCanvH);
		
			ctx.font = '24px fontScore';
			ctx.fillStyle = '#FFFFFF';
			ctx.textAlign = 'center';
			
			const centerX = gameVar.scoreCanvW / 2;
			const leftX = gameVar.scoreCanvW * 0.25;
			const rightX = gameVar.scoreCanvW * 0.75;
			const y = 35;
			if (gameVar.localGame)
			{
				ctx.fillText(gameVar.userName, leftX, y);
				ctx.fillText('Player 2', rightX, y);
			}
			else
			{
				ctx.fillText('Player 1', leftX, y);
				ctx.fillText('AI', rightX, y);
			}
			ctx.font = '32px fontScore';
			ctx.fillText(gameVar.playerScore, leftX, y + gameVar.scoreCanvH / 2);
			ctx.fillText(gameVar.aiScore, rightX, y + gameVar.scoreCanvH / 2);
			ctx.fillText('VS', centerX, y);
			const minutes = Math.floor(gameVar.gameTime / 60);
			const seconds = gameVar.gameTime % 60;
			const time = `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
			ctx.font = '20px fontScore';
			ctx.fillText(time, centerX, y + gameVar.scoreCanvH / 2);
		}
	}).catch(function(error)
	{
		console.error("Error on font load", error);
	});
}
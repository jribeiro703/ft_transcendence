import gameVar from "../pong/var.js";
import brickVar from "./var.js";
import brickVar2 from "./secondBrickout/var.js";
import { addBtnB } from "./manage.js";
import { fetchAuthData } from "../../user/fetchData.js";
import { sendScoreSubmit } from "../pong/network.js";

function loadCustomFont() {
  return new FontFace(
    "fontScore",
    "url(/static/css/font/scoreboard-webfont.woff2)",
  );
}
export function chechOpponentRemote() {
  let display = false;
  let display2 = false;
  const waiting = setInterval(() => {
    if (gameVar.playerIdx === 1 || brickVar.playerIdx === 1) {
      if (brickVar.playerLives === 0 || brickVar.finishLevel) {
        if (!display) {
          display = true;
          drawScoreBoardBRemote();
          brickVar.ctx.clearRect(0, 0, brickVar.canvasW, brickVar.canvasH);
          brickVar.ctx.font = "bold 24px fontScore";
          brickVar.ctx.fillStyle = "#66a5e8";
          brickVar.ctx.textAlign = "left";
          brickVar.ctx.fillText(
            "Waiting for opponent to finish...",
            brickVar.canvasW / 4,
            brickVar.canvasH / 2 - 100,
          );
          brickVar.ctx.fillText(
            "Your final score :",
            brickVar.canvasW / 4,
            brickVar.canvasH / 2,
          );
          brickVar.ctx.fillText(
            brickVar.score,
            brickVar.canvasW / 4 + 250,
            brickVar.canvasH / 2,
          );
        } else drawScoreBoardBRemote();
      }
      if (brickVar.opponentLives === 0 || isP2Finish()) {
        clearInterval(waiting);
        compareScoreRemote();
        addBtnB();
        if (!gameVar.scoreSubmit) {
          sendScoreB();
          gameVar.scoreSubmit = true;
          sendScoreSubmit(gameVar.scoreSubmit);
        }
      }
    }
    if (gameVar.playerIdx === 2 || brickVar.playerIdx === 2) {
      if (brickVar.opponentLives === 0 || brickVar2.finishLevel) {
        if (!display2) {
          display2 = true;
          drawScoreBoardBRemote();
          brickVar.ctx.clearRect(0, 0, brickVar.canvasW, brickVar.canvasH);
          brickVar.ctx.font = "bold 24px fontScore";
          brickVar.ctx.fillStyle = "#66a5e8";
          brickVar.ctx.textAlign = "left";
          brickVar.ctx.fillText(
            "Waiting for opponent to finish...",
            brickVar.canvasW / 4,
            brickVar.canvasH / 2 - 100,
          );
          brickVar.ctx.fillText(
            "Your final score :",
            brickVar.canvasW / 4,
            brickVar.canvasH / 2,
          );
          brickVar.ctx.fillText(
            brickVar.score,
            brickVar.canvasW / 4 + 250,
            brickVar.canvasH / 2,
          );
        } else drawScoreBoardBRemote();
      }
      if (brickVar.playerLives === 0 || isP1Finish()) {
        clearInterval(waiting);
        compareScoreRemote();
        addBtnB();
      }
    }
  }, 1000);
}

export function isP2Finish() {
  if (brickVar.totalBrick === brickVar.opponentScore) {
    brickVar.win = true;
    return true;
  } else return false;
}
export function isP1Finish() {
  if (brickVar.totalBrick === brickVar.playerScore) {
    brickVar.win = true;
    return true;
  } else return false;
}

export function chechOpponent() {
  let display = false;
  if (gameVar.localGame) {
    const waiting = setInterval(() => {
      if (
        (brickVar2.startTime === true || brickVar2.gameTime < 1) &&
        !brickVar2.finishLevel
      ) {
        if (!display) {
          display = true;
          drawScoreBoardB();
          brickVar.ctx.clearRect(0, 0, brickVar.canvasW, brickVar.canvasH);
          brickVar.ctx.font = "bold 24px fontScore";
          brickVar.ctx.fillStyle = "#66a5e8";
          brickVar.ctx.textAlign = "left";
          brickVar.ctx.fillText(
            "Waiting for opponent to finish...",
            brickVar.canvasW / 4,
            brickVar.canvasH / 2 - 100,
          );
          brickVar.ctx.fillText(
            "Your final score :",
            brickVar.canvasW / 4,
            brickVar.canvasH / 2,
          );
          brickVar.ctx.fillText(
            brickVar.score,
            brickVar.canvasW / 4 + 250,
            brickVar.canvasH / 2,
          );
        } else drawScoreBoardB();
      } else {
        if (brickVar2.gameTime > 2) {
          clearInterval(waiting);
          compareScore();
        }
      }
    }, 1000);
  }
}

export function compareScoreRemote() {
  brickVar.ctx.clearRect(0, 0, brickVar.canvasW, brickVar.canvasH);
  loadCustomFont()
    .load()
    .then(function (font) {
      document.fonts.add(font);
      brickVar.ctx.font = "bold 24px fontScore";
      brickVar.ctx.fillStyle = "#66a5e8";
      brickVar.ctx.textAlign = "left";
      if (
        brickVar.playerScore > brickVar.opponentScore ||
        brickVar.playerLives > brickVar.opponentLives
      ) {
        if (gameVar.playerIdx === 1 || brickVar.playerIdx === 1)
          displayScoreP1Win(true);
        if (gameVar.playerIdx === 2 || brickVar.playerIdx === 2) {
          brickVar.ctx.fillText(
            "Too Bad ! You lose...",
            brickVar.canvasW / 4,
            brickVar.canvasH / 2 - 100,
          );
          brickVar.ctx.fillText(
            "Your score : ",
            brickVar.canvasW / 4,
            brickVar.canvasH / 2,
          );
          brickVar.ctx.fillText(
            brickVar.opponentScore,
            brickVar.canvasW / 4 + 200,
            brickVar.canvasH / 2,
          );
          brickVar.ctx.fillText(
            "Your opponent has score : ",
            brickVar.canvasW / 4,
            brickVar.canvasH / 2 + 50,
          );
          brickVar.ctx.fillText(
            brickVar.playerScore,
            brickVar.canvasW / 4 + 380,
            brickVar.canvasH / 2 + 50,
          );
          if (brickVar.opponentLives > 0) {
            brickVar.ctx.fillText(
              "You've still : ",
              brickVar.canvasW / 4,
              brickVar.canvasH / 2 + 100,
            );
            brickVar.ctx.fillText(
              brickVar.opponentLives,
              brickVar.canvasW / 4 + 200,
              brickVar.canvasH / 2 + 100,
            );
            brickVar.ctx.fillText(
              "lives !",
              brickVar.canvasW / 4 + 230,
              brickVar.canvasH / 2 + 100,
            );
          } else
            brickVar.ctx.fillText(
              "You've no more lives",
              brickVar.canvasW / 4,
              brickVar.canvasH / 2 + 100,
            );
        }
      } else if (
        brickVar.opponentScore > brickVar.playerScore ||
        brickVar.opponentLives > brickVar.playerLives
      ) {
        if (gameVar.playerIdx === 2 || brickVar.playerIdx === 2)
          displayScoreP1Win(false);
        if (gameVar.playerIdx === 1 || brickVar.playerIdx === 1) {
          brickVar.ctx.fillText(
            "Too Bad ! You lose...",
            brickVar.canvasW / 4,
            brickVar.canvasH / 2 - 100,
          );
          brickVar.ctx.fillText(
            "Your score : ",
            brickVar.canvasW / 4,
            brickVar.canvasH / 2,
          );
          brickVar.ctx.fillText(
            brickVar.playerScore,
            brickVar.canvasW / 4 + 200,
            brickVar.canvasH / 2,
          );
          brickVar.ctx.fillText(
            "Your opponent has score : ",
            brickVar.canvasW / 4,
            brickVar.canvasH / 2 + 50,
          );
          brickVar.ctx.fillText(
            brickVar.opponentScore,
            brickVar.canvasW / 4 + 380,
            brickVar.canvasH / 2 + 50,
          );
          if (brickVar.playerLives > 0) {
            brickVar.ctx.fillText(
              "You've still : ",
              brickVar.canvasW / 4,
              brickVar.canvasH / 2 + 100,
            );
            brickVar.ctx.fillText(
              brickVar.playerLives,
              brickVar.canvasW / 4 + 200,
              brickVar.canvasH / 2 + 100,
            );
            brickVar.ctx.fillText(
              "lives !",
              brickVar.canvasW / 4 + 230,
              brickVar.canvasH / 2 + 100,
            );
          } else
            brickVar.ctx.fillText(
              "You've no more lives",
              brickVar.canvasW / 4,
              brickVar.canvasH / 2 + 100,
            );
        }
      } else displayEqualScore();
    })
    .catch(function (error) {
      console.error("Error on font load", error);
    });
}
export function compareScore() {
  brickVar.ctx.clearRect(0, 0, brickVar.canvasW, brickVar.canvasH);
  brickVar2.ctx.clearRect(0, 0, brickVar2.canvasW, brickVar2.canvasH);
  loadCustomFont()
    .load()
    .then(function (font) {
      document.fonts.add(font);
      if (brickVar.score > brickVar2.score) displayScoreP1Win();
      else if (brickVar.score < brickVar2.score) displayScoreP1Loose();
      else displayEqualScore();
    })
    .catch(function (error) {
      console.error("Error on font load", error);
    });

  if (
    (brickVar.lives === 0 || brickVar.finishLevel) &&
    (brickVar2.lives === 0 || brickVar2.finishLevel)
  )
    addBtnB();
}

function displayEqualScore() {
  brickVar.ctx.font = "bold 24px fontScore";
  brickVar.ctx.fillStyle = "#66a5e8";
  brickVar.ctx.textAlign = "left";
  brickVar.ctx.fillText(
    "DRAW !",
    brickVar.canvasW / 4,
    brickVar.canvasH / 2 - 100,
  );
  brickVar.ctx.fillText(
    "Your score : ",
    brickVar.canvasW / 4,
    brickVar.canvasH / 2,
  );
  brickVar.ctx.fillText(
    "Your opponent has score : ",
    brickVar.canvasW / 4,
    brickVar.canvasH / 2 + 50,
  );
  if (gameVar.liveMatch) {
    brickVar.ctx.fillText(
      brickVar.playerScore,
      brickVar.canvasW / 4 + 200,
      brickVar.canvasH / 2,
    );
    brickVar.ctx.fillText(
      brickVar.opponentScore,
      brickVar.canvasW / 4 + 380,
      brickVar.canvasH / 2 + 50,
    );
  } else {
    brickVar.ctx.fillText(
      brickVar.score,
      brickVar.canvasW / 4 + 200,
      brickVar.canvasH / 2,
    );
    brickVar.ctx.fillText(
      brickVar2.score,
      brickVar.canvasW / 4 + 380,
      brickVar.canvasH / 2 + 50,
    );
  }
  if (gameVar.localGame) {
    brickVar2.ctx.font = "bold 24px fontScore";
    brickVar2.ctx.fillStyle = "#66a5e8";
    brickVar2.ctx.textAlign = "left";
    brickVar2.ctx.fillText(
      "DRAW !",
      brickVar.canvasW / 4,
      brickVar.canvasH / 2 - 100,
    );
    brickVar2.ctx.fillText(
      "Your score : ",
      brickVar.canvasW / 4,
      brickVar.canvasH / 2,
    );
    brickVar2.ctx.fillText(
      brickVar2.score,
      brickVar.canvasW / 4 + 200,
      brickVar.canvasH / 2,
    );
    brickVar2.ctx.fillText(
      "Your opponent has score : ",
      brickVar2.canvasW / 4,
      brickVar2.canvasH / 2 + 50,
    );
    brickVar2.ctx.fillText(
      brickVar.score,
      brickVar2.canvasW / 4 + 380,
      brickVar2.canvasH / 2 + 50,
    );
  }
}

function displayScoreP1Win(player1)
{
	brickVar.ctx.font = 'bold 24px fontScore';
	brickVar.ctx.fillStyle = '#66a5e8';
	brickVar.ctx.textAlign = 'left';
	brickVar.ctx.fillText("Congratulations ! You've defeat your opponent...", brickVar.canvasW / 4 - 100, (brickVar.canvasH / 2) - 100);
	brickVar.ctx.fillText("Your score : ", brickVar.canvasW / 4, brickVar.canvasH / 2);
	brickVar.ctx.fillText("Your opponent has score : ", brickVar.canvasW / 4, brickVar.canvasH / 2 + 50);

	if (gameVar.liveMatch)
	{
		brickVar.ctx.fillText("You've still : ", brickVar.canvasW / 4, brickVar.canvasH / 2 + 100);
		brickVar.ctx.fillText("lives !", brickVar.canvasW / 4 + 230, brickVar.canvasH / 2 + 100);

		if (player1 === true)
		{
			brickVar.ctx.fillText(brickVar.playerScore, brickVar.canvasW / 4 + 200, brickVar.canvasH / 2)
			brickVar.ctx.fillText(brickVar.opponentScore, brickVar.canvasW / 4 + 380, brickVar.canvasH / 2 + 50);
			brickVar.ctx.fillText(brickVar.playerLives, brickVar.canvasW / 4 + 200, brickVar.canvasH / 2 + 100);
		}
		else
		{
			brickVar.ctx.fillText(brickVar.opponentScore, brickVar.canvasW / 4 + 200, brickVar.canvasH / 2)
			brickVar.ctx.fillText(brickVar.playerScore, brickVar.canvasW / 4 + 380, brickVar.canvasH / 2 + 50);
			brickVar.ctx.fillText(brickVar.opponentLives, brickVar.canvasW / 4 + 200, brickVar.canvasH / 2 + 100);
		}
	}
	else
	{
		brickVar.ctx.fillText(brickVar.score, brickVar.canvasW / 4 + 200, brickVar.canvasH / 2)
		brickVar.ctx.fillText(brickVar2.score, brickVar.canvasW / 4 + 380, brickVar.canvasH / 2 + 50);
	}
	if (gameVar.localGame)
	{
		brickVar2.ctx.font = 'bold 24px fontScore';
		brickVar2.ctx.fillStyle = '#66a5e8';
		brickVar2.ctx.textAlign = 'left';
		brickVar2.ctx.fillText("Too Bad ! You lose...", brickVar.canvasW / 4, (brickVar.canvasH / 2) - 100);
		brickVar2.ctx.fillText("Your score : ", brickVar.canvasW / 4, brickVar.canvasH / 2);
		brickVar2.ctx.fillText(brickVar2.score, brickVar.canvasW / 4 + 200, brickVar.canvasH / 2);
		brickVar2.ctx.fillText("Your opponent has score : ", brickVar2.canvasW / 4, brickVar2.canvasH / 2 + 50);
		brickVar2.ctx.fillText(brickVar.score, brickVar2.canvasW / 4 + 380, brickVar2.canvasH / 2 + 50);
	}
}

function displayScoreP1Loose() {
  if (gameVar.localGame) {
    brickVar2.ctx.font = "bold 24px fontScore";
    brickVar2.ctx.fillStyle = "#66a5e8";
    brickVar2.ctx.textAlign = "left";
    brickVar2.ctx.fillText(
      "Congratulations ! You've defeat your opponent...",
      brickVar2.canvasW / 4 - 100,
      brickVar2.canvasH / 2 - 100,
    );
    brickVar2.ctx.fillText(
      "Your score : ",
      brickVar2.canvasW / 4,
      brickVar2.canvasH / 2,
    );
    brickVar2.ctx.fillText(
      brickVar2.score,
      brickVar2.canvasW / 4 + 200,
      brickVar2.canvasH / 2,
    );
    brickVar2.ctx.fillText(
      "Your opponent has score : ",
      brickVar2.canvasW / 4,
      brickVar2.canvasH / 2 + 50,
    );
    brickVar2.ctx.fillText(
      brickVar.score,
      brickVar2.canvasW / 4 + 380,
      brickVar2.canvasH / 2 + 50,
    );
  }
  brickVar.ctx.font = "bold 24px fontScore";
  brickVar.ctx.fillStyle = "#66a5e8";
  brickVar.ctx.textAlign = "left";
  brickVar.ctx.fillText(
    "Too Bad ! You lose...",
    brickVar.canvasW / 4,
    brickVar.canvasH / 2 - 100,
  );
  brickVar.ctx.fillText(
    "Your score : ",
    brickVar.canvasW / 4,
    brickVar.canvasH / 2,
  );
  brickVar.ctx.fillText(
    "Your opponent has score : ",
    brickVar.canvasW / 4,
    brickVar.canvasH / 2 + 50,
  );
  if (gameVar.liveMatch) {
    brickVar.ctx.fillText(
      brickVar.playerScore,
      brickVar.canvasW / 4 + 200,
      brickVar.canvasH / 2,
    );
    brickVar.ctx.fillText(
      brickVar.opponentScore,
      brickVar.canvasW / 4 + 380,
      brickVar.canvasH / 2 + 50,
    );
  } else {
    brickVar.ctx.fillText(
      brickVar.score,
      brickVar.canvasW / 4 + 200,
      brickVar.canvasH / 2,
    );
    brickVar.ctx.fillText(
      brickVar2.score,
      brickVar.canvasW / 4 + 380,
      brickVar.canvasH / 2 + 50,
    );
  }
}

export function checkInterval() {
  if (brickVar.gameTimer) {
    clearInterval(brickVar.gameTimer);
    brickVar.gameTimer = null;
  }
  if (brickVar2.gameTimer) {
    clearInterval(brickVar2.gameTimer);
    brickVar2.gameTimer = null;
  }
}

export function checkFrame() {
  if (brickVar.anim) {
    cancelAnimationFrame(brickVar.anim);
    brickVar.anim = null;
  }
  if (brickVar2.anim) {
    cancelAnimationFrame(brickVar2.anim);
    brickVar2.anim = null;
  }
}

export function drawScoreBoardBRemote() {
  if (!brickVar.scoreCtx || !brickVar.ctx) {
    console.log("Error on ctx");
    return;
  }
  loadCustomFont()
    .load()
    .then(function (font) {
      document.fonts.add(font);
      const ctx = brickVar.scoreCtx;
      ctx.clearRect(0, 0, brickVar.scoreCanvW, brickVar.scoreCanvH + 100);
      ctx.font = "24px fontScore";
      ctx.fillStyle = "white";
      ctx.textAlign = "center";
      const centerX = brickVar.scoreCanvW / 2;
      const leftX = brickVar.scoreCanvW * 0.25;
      const rightX = brickVar.scoreCanvW * 0.75;
      const y = 35;
      ctx.fillText(gameVar.userName, leftX - 5, y);
      ctx.fillText(gameVar.opponentName, rightX + 15, y);
      ctx.fillText("Score", leftX - 15, y + 60);
      ctx.fillText("Lives", leftX - 15, y + 100);
      ctx.fillText("Score", rightX, y + 60);
      ctx.fillText("Lives", rightX, y + 100);
      ctx.fillText(brickVar.playerScore, leftX + 45, y + 60);
      ctx.fillText(brickVar.playerLives, leftX + 45, y + 100);
      ctx.fillText(brickVar.opponentScore, rightX + 60, y + 60);
      ctx.fillText(brickVar.opponentLives, rightX + 60, y + 100);
      ctx.font = "32px fontScore";
      ctx.fillText("VS", centerX, brickVar.scoreCanvH / 2);
    })
    .catch(function (error) {
      console.error("Error on font load", error);
    });
}

export function drawScoreBoardB() {
  if (!brickVar.scoreCtx || !brickVar.ctx) {
    console.log("Error on ctx1");
    return;
  }
  loadCustomFont()
    .load()
    .then(function (font) {
      document.fonts.add(font);
      const ctx = brickVar.scoreCtx;
      ctx.clearRect(0, 0, brickVar.scoreCanvW, brickVar.scoreCanvH + 100);
      ctx.font = "24px fontScore";
      ctx.fillStyle = "white";
      ctx.textAlign = "center";
      const centerX = brickVar.scoreCanvW / 2;
      const leftX = brickVar.scoreCanvW * 0.25;
      const rightX = brickVar.scoreCanvW * 0.75;
      const y = 35;
      if (gameVar.game == "brickout2p") {
        if (gameVar.localGame) {
          ctx.fillText(gameVar.userName, leftX - 5, y);
          ctx.fillText("Player 2", rightX + 15, y);
        } else {
          ctx.fillText("Player 1", leftX - 5, y);
          ctx.fillText("Player 2", rightX + 15, y);
        }
        ctx.fillText("Score", leftX - 15, y + 60);
        ctx.fillText("Lives", leftX - 15, y + 100);
        ctx.fillText("Score", rightX, y + 60);
        ctx.fillText("Lives", rightX, y + 100);
        ctx.fillText(brickVar.score, leftX + 45, y + 60);
        ctx.fillText(brickVar.lives, leftX + 45, y + 100);
        ctx.fillText(brickVar2.score, rightX + 60, y + 60);
        ctx.fillText(brickVar2.lives, rightX + 60, y + 100);
        ctx.font = "32px fontScore";
        ctx.fillText("VS", centerX, brickVar.scoreCanvH / 2);
        const minutes = Math.floor(brickVar.gameTime / 60);
        const seconds = brickVar.gameTime % 60;
        const time = `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
        ctx.font = "20px fontScore";
        ctx.fillText(time, leftX - 10, y + brickVar.scoreCanvH + 45);
        const minutes2 = Math.floor(brickVar2.gameTime / 60);
        const seconds2 = brickVar2.gameTime % 60;
        const time2 = `${minutes2}:${seconds2 < 10 ? "0" : ""}${seconds2}`;
        ctx.font = "20px fontScore";
        ctx.fillText(time2, rightX + 10, y + brickVar.scoreCanvH + 45);
      } else {
        ctx.font = "32px fontScore";
        ctx.fillText("Score", leftX, y);
        ctx.fillText("Lives", rightX, y);
        ctx.fillText(brickVar.score, leftX, y + brickVar.scoreCanvH / 2);
        ctx.fillText(brickVar.lives, rightX, y + brickVar.scoreCanvH / 2);
        ctx.fillText(brickVar.score, leftX, y + brickVar.scoreCanvH / 2);
        ctx.fillText(brickVar.lives, rightX, y + brickVar.scoreCanvH / 2);
        const minutes = Math.floor(brickVar.gameTime / 60);
        const seconds = brickVar.gameTime % 60;
        const time = `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
        ctx.font = "20px fontScore";
        ctx.fillText(time, centerX, y + brickVar.scoreCanvH / 2);
      }
    })
    .catch(function (error) {
      console.error("Error on font load", error);
    });
}

export async function sendScoreB() {
  if ((await manageScoreB()) === false) {
    return;
  } else {
    const body = {
      username_one: gameVar.userName,
      username_two: gameVar.opponentName,
      score_one: brickVar.playerScore,
      score_two: brickVar.opponentScore,
      time_played: brickVar.gameTime,
      difficulty: brickVar.difficulty,
      powerup: brickVar.powerUpEnable,
      level: brickVar.currLevel,
      winner: gameVar.winner,
    };
    const responseObject = await fetchAuthData("/game/create/", "POST", body);

    if (responseObject.status === 201)
      console.log("Sending game score successfully");
  }
}

async function manageScoreB() {
  if (brickVar.playerScore > brickVar.opponentScore)
    gameVar.winner = gameVar.userName;
  else if (brickVar.playerScore < brickVar.opponentScore)
    gameVar.winner = gameVar.opponentName;
  else if (brickVar.playerScore === brickVar.opponentScore) {
    if (brickVar.playerLives > brickVar.opponentLives)
      gameVar.winner = gameVar.userName;
    else if (brickVar.playerLives < brickVar.opponentLives)
      gameVar.winner = gameVar.opponentName;
    else {
      return false;
    }
  }
  const nicknameResponse = await fetchAuthData(
    `/user/get-id/?nickname=${gameVar.winner}`,
  );
  gameVar.winner = nicknameResponse.data.id;

  if (brickVar.difficulty === "easy") brickVar.difficulty = "EASY";
  else if (brickVar.difficulty === "medium") brickVar.difficulty = "MEDIUM";
  else if (brickVar.difficulty === "hard") brickVar.difficulty = "HARD";

  if (brickVar.currLevel === "classic") brickVar.currLevel = "CLASSIC";
  else if (brickVar.currLevel === "castle") brickVar.currLevel = "TABLETENNIS";
  else if (brickVar.currLevel === "x") brickVar.currLevel = "FOOTBALL";
  else if (brickVar.currLevel === "tennis") brickVar.currLevel = "TENNIS";
  return true;
}

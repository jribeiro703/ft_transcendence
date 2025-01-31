import brickVar from "./var.js";
import brickVar2 from "./secondBrickout/var.js";
import gameVar from "../pong/var.js";
import { updateLevelSelectionB as updateLevelSelectionBFirst } from "./update.js";
import { updateLevelSelectionB as updateLevelSelectionBSecond } from "./secondBrickout/update.js";
import { updatePowerUpSelectionB as updatePowerUpSelectionBFirst } from "./powerUp.js";
import { updatePowerUpSelectionB as updatePowerUpSelectionBSecond } from "./secondBrickout/update.js";
import {
  displayNextLevel,
  displayFinish,
  displayLocalRematch,
} from "./display.js";
import {
  listenFinishBtn,
  listenNextLevelBtn,
  listenLocalRematchBtn,
} from "./listenerBtn.js";
import { chechOpponent, chechOpponentRemote } from "./score.js";
import { addImageB, handleNextLevelB, restartLevelB } from "./level.js";
import { updateDifficultySelectionB } from "./update.js";
import { updateDifficultySelectionSB } from "./secondBrickout/update.js";
import { resetBallB } from "./ball.js";
import { renderPageGame } from "../HistoryManager.js";
import { sendScoreInfoB } from "../pong/network.js";
import { displayFinishLive } from "./display.js";

export function manageCollisionB() {
  if (
    brickVar.x + brickVar.dx > brickVar.canvasW - brickVar.ballRadius ||
    brickVar.x + brickVar.dx < brickVar.ballRadius
  )
    brickVar.dx = -brickVar.dx;
  if (brickVar.y + brickVar.dy < brickVar.ballRadius)
    brickVar.dy = -brickVar.dy;
  else if (brickVar.y + brickVar.dy > brickVar.canvasH - brickVar.ballRadius) {
    if (
      brickVar.x + brickVar.ballRadius > brickVar.paddleX &&
      brickVar.x - brickVar.ballRadius < brickVar.paddleX + brickVar.paddleWidth
    ) {
      let hitPos = (brickVar.x - brickVar.paddleX) / brickVar.paddleWidth;
      const BASE_ANGLE = Math.PI / 2;
      let MAX_ANGLE_DEVIATION;
      if (hitPos < 0.15 || hitPos > 0.85) MAX_ANGLE_DEVIATION = Math.PI / 2.5;
      else if (hitPos < 0.3 || hitPos > 0.7) MAX_ANGLE_DEVIATION = Math.PI / 3;
      else MAX_ANGLE_DEVIATION = Math.PI / 4;
      const currentSpeed = brickVar.powerUpActive
        ? Math.sqrt(brickVar.dx * brickVar.dx + brickVar.dy * brickVar.dy)
        : brickVar.initDx;
      if (hitPos < 0.5) {
        let angle = BASE_ANGLE - (0.5 - hitPos) * 2 * MAX_ANGLE_DEVIATION;
        brickVar.dx = -Math.abs(currentSpeed * Math.cos(angle));
      } else {
        let angle = BASE_ANGLE + (hitPos - 0.5) * 2 * MAX_ANGLE_DEVIATION;
        brickVar.dx = Math.abs(currentSpeed * Math.cos(angle));
      }
      brickVar.dy = -currentSpeed * Math.sin(BASE_ANGLE);
      brickVar.y =
        brickVar.canvasH - brickVar.paddleHeight - brickVar.ballRadius - 1;
    } else loseLives();
  }
}

export function manageMoveB() {
  if (brickVar.leftPressed && brickVar.paddleX > 0) {
    brickVar.paddleX -= brickVar.paddleSpeed;
  } else if (
    brickVar.rightPressed &&
    brickVar.paddleX < brickVar.canvasW - brickVar.paddleWidth
  ) {
    brickVar.paddleX += brickVar.paddleSpeed;
  }
}

export function loseLives() {
  if (gameVar.liveMatch) loseLivesRemote();
  else {
    brickVar.lives--;
    if (brickVar.lives === 0) {
      brickVar.ctx.clearRect(0, 0, brickVar.canvasW, brickVar.canvasH);
      brickVar.loose = true;
      brickVar.startTime = false;
      if (!gameVar.localGame) addImageB("/static/css/images/nooo.png");
      if (gameVar.localGame) chechOpponent();
      else addBtnB();
    } else resetBallB();
  }
}
export function loseLivesRemote() {
  if (gameVar.playerIdx === 1 || brickVar.playerIdx === 1) {
    brickVar.playerLives--;
    sendScoreInfoB(
      gameVar.gameSocket,
      1,
      brickVar.playerScore,
      brickVar.playerLives,
    );
    if (brickVar.playerLives === 0) {
      brickVar.loose = true;
      brickVar.startTime = false;
      chechOpponentRemote();
    } else {
      resetBallB();
    }
  }
  if (gameVar.playerIdx === 2 || brickVar.playerIdx === 2) {
    brickVar.opponentLives--;
    sendScoreInfoB(
      gameVar.gameSocket,
      2,
      brickVar.opponentScore,
      brickVar.opponentLives,
    );
    if (brickVar.opponentLives === 0) {
      brickVar.loose = true;
      brickVar2.startTime = false;
      chechOpponentRemote();
    } else resetBallB();
  }
}

export function addBtnB() {
  if (!gameVar.localGame) {
    if (!gameVar.liveMatch) {
      if (brickVar.finishLevel && !brickVar.finish) displayNextLevel();
      else displayFinish();
    } else displayFinishLive();
  } else displayLocalRematch();
}

export function checkBtnB(status) {
  if (status === "nextLevel") listenNextLevelBtn();
  else if (status === "finish") listenFinishBtn();
  else if (status === "localRematch") listenLocalRematchBtn();
}

export function clearBtnB(nextLevel) {
  const finish = document.getElementById("finish");
  try {
    const nextLevelBtn = null;
    if (nextLevel) nextLevelBtn = document.getElementById("nextLevelBtn");
    const quitBtn = document.getElementById("quitBtn");
    const restartLevelBtn = document.getElementById("restartLevelBtn");
    if (nextLevelBtn)
      nextLevelBtn.removeEventListener("click", handleNextLevelB);
    if (restartLevelBtn)
      restartLevelBtn.removeEventListener("click", restartLevelB);
    if (quitBtn)
      quitBtn.addEventListener("click", () => renderPageGame("home"), true);
    finish.parentNode.remove();
  } catch (error) {
    console.error("Error removing buttons:", error);
  }
}

export function clearBrickVar() {
  resetTimeFrame();
  brickVar.initialize = false;
  brickVar2.initialize = false;
  brickVar.finishLevel = false;
  brickVar2.finishLevel = false;
  brickVar.gameStart = false;
  brickVar2.gameStart = false;
  brickVar.startTime = false;
  brickVar2.startTime = false;
  brickVar.score = 0;
  brickVar2.score = 0;
  brickVar.lives = 5;
  brickVar2.lives = 5;
  brickVar.initGame = false;
  brickVar2.initGame = false;
  brickVar.playerIdx = 0;
}

export function clearAllBrickStates() {
  resetTimeFrame();
  updateDifficultySelectionB("medium", true);
  updateLevelSelectionBFirst("classic", true);
  updatePowerUpSelectionBFirst(false, true);
  updateDifficultySelectionSB("medium");
  updateLevelSelectionBSecond("classic");
  updatePowerUpSelectionBSecond(false);
  brickVar.initialize = false;
  brickVar2.initialize = false;
  brickVar.finishLevel = false;
  brickVar2.finishLevel = false;
  brickVar.gameStart = false;
  brickVar2.gameStart = false;
  brickVar.startTime = false;
  brickVar2.startTime = false;
  brickVar.score = 0;
  brickVar2.score = 0;
  brickVar.lives = 5;
  brickVar2.lives = 5;
  brickVar.initGame = false;
  brickVar2.initGame = false;
  brickVar.playerIdx = 0;
}

function resetTimeFrame() {
  if (brickVar.anim) {
    cancelAnimationFrame(brickVar.anim);
    brickVar.anim = null;
  }
  if (brickVar2.anim) {
    cancelAnimationFrame(brickVar2.anim);
    brickVar2.anim = null;
  }
  if (brickVar.gameTimer) {
    clearInterval(brickVar.gameTimer);
    brickVar.gameTimer = null;
  }
  if (brickVar2.gameTimer) {
    clearInterval(brickVar2.gameTimer);
    brickVar2.gameTimer = null;
  }
}

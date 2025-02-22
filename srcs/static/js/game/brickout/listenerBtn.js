import brickVar from "./var.js";
import brickVar2 from "./secondBrickout/var.js";
import { handleNextLevelB, restartLevelB } from "./level.js";
import { renderPageGame } from "../HistoryManager.js";
import { resetMatchB as resetMatchFirst } from "./reset.js";
import { resetMatchB as resetMatchSecond } from "./secondBrickout/reset.js";

export function listenNextLevelBtn() {
  const nextLevelBtn = document.getElementById("nextLevelBtn");
  const quitBtn = document.getElementById("quitBtn");
  const restartLevelBtn = document.getElementById("restartLevelBtn");
  if (nextLevelBtn) {
    nextLevelBtn.addEventListener("click", () => {
      handleNextLevelB();
    });
  }

  if (restartLevelBtn) {
    restartLevelBtn.addEventListener("click", () => {
      restartLevelB();
    });
  }
  if (quitBtn) {
    quitBtn.addEventListener("click", () => {
      resetMatchFirst();
      renderPageGame("home", true);
    });
  }
}

export function listenFinishBtn() {
  const quitBtn = document.getElementById("quitBtn");
  const restartLevelBtn = document.getElementById("restartLevelBtn");
  const returnLobbyBtn = document.getElementById("returnLobbyBtn");
  if (returnLobbyBtn) {
    returnLobbyBtn.addEventListener("click", () => {
      resetLiveMatch();
      resetMatchFirst();
      clearBtnB();
      renderPageGame("brickoutLobby", true);
    });
  }
  if (restartLevelBtn) {
    restartLevelBtn.addEventListener("click", () => {
      resetMatchFirst();
      renderPageGame("playBrickout", true);
    });
  }

  if (quitBtn) {
    quitBtn.addEventListener("click", () => {
      resetMatchFirst();
      resetLiveMatch();
      renderPageGame("home", true);
    });
  }
}

export function clearAllGameStates() {
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
}

export function listenLocalRematchBtn() {
  const rematchBtn = document.getElementById("rematchBtn");
  const quitBtn = document.getElementById("quitBtn");
  if (rematchBtn) {
    rematchBtn.addEventListener("click", () => {
      resetMatchFirst();
      resetMatchSecond();
      renderPageGame("playBrickoutLocal", true);
    });
  }
  if (quitBtn) {
    quitBtn.addEventListener("click", () => {
      resetMatchFirst();
      resetMatchSecond();
      renderPageGame("home", true);
    });
  }
}

import gameVar from "./pong/var.js";
import brickVar from "./brickout/var.js";
import { showGameSelectionView } from "./pong/gameSelectionView.js";
import { showGameSelectionMultiView } from "./pong/gameSelectionView.js";
import { showSettingView } from "./pong/settingsView.js";
import { showGameRoom, showGameView } from "./pong/gameView.js";
import { renderHomePage } from "../renderHomePage.js";
import {
  updateDifficultySelection,
  updateLevelSelection,
} from "./pong/update.js";
import { updatePowerUpSelection } from "./pong/powerUp.js";
import {
  updateDifficultySelectionB,
  updateLevelSelectionB,
} from "./brickout/update.js";
import { updatePowerUpSelectionB } from "./brickout/powerUp.js";
import { showSettingViewB } from "./brickout/settings.js";
import { clearAllBrickStates } from "./brickout/manage.js";
import { sendGameData } from "./pong/network.js";
import { isAuthenticated } from "../user/isAuthenticated.js";
import { updateUserAvatar } from "../user/tools.js";
import { showGameBrickView } from "./brickout/gameView.js";
import { showGameBrickLocalView } from "./brickout/gameView.js";
import { initLobbyPongView, initLobbyBrickoutView } from "./pong/init.js";
import { showPongRemote } from "./pong/gameViewMulti.js";
import { clearAllpongStates } from "./pong/reset.js";
import { showBrickoutRemote } from "./pong/gameViewMulti.js";
import { showGameRoomB } from "./pong/gameView.js";
import { changeTheme } from "../livechat/livechat.js";
import { renderPage } from "../user/historyManager.js";

const pongGamePages = {
  gameSelectionSolo: showGameSelectionView,

  pongSetting: (params) => showSettingView(params),
  playPong: showGameView,

  brickoutSetting: (params) => showSettingViewB(params),
  playBrickout: showGameBrickView,

  gameSelectionMulti: showGameSelectionMultiView,

  playPongLocal: showGameView,
  playTournamentLocal: showGameView,
  playBrickoutLocal: showGameBrickLocalView,

  pongLobby: initLobbyPongView,
  brickoutLobby: initLobbyBrickoutView,

  playPongRemote: showPongRemote,
  playPongRemoteSecondP: showGameRoom,
  playBrickoutRemote: showBrickoutRemote,
  playBrickoutRemoteSecondP: showGameRoomB,
};

const multiplayerPages = new Map([
  ["gameSelectionMulti", showGameSelectionMultiView],
  ["playPongLocal", showGameView],
  ["playBrickoutLocal", showGameBrickLocalView],
  ["pongLobby", initLobbyPongView],
  ["brickoutLobby", initLobbyBrickoutView],
  ["playPongRemote", showPongRemote],
  ["playPongRemoteSecondP", showGameRoom],
  ["playBrickoutRemote", showBrickoutRemote],
  ["playBrickoutRemoteSecondP", showGameRoomB],
]);

export function isMultiplayerPage(pageKey) {
  const exist = multiplayerPages.has(pageKey);
  return exist ? true : false;
}

export function isGameplayPage(page) {
  return [
    "#playPong",
    "#playBrickout",
    "#pongLobby",
    "#brickoutLobby",
    "#playPongLocal",
    "#playBrickoutLocal",
    "#playPongRemote",
    "#playPongRemoteSecondP",
    "#playBrickoutRemote",
    "#playBrickoutRemoteSecondP",
    "#playTournamentLocal",
  ].includes(page);
}

export function isGamePage(page) {
  return [
    "#gameSelectionSolo",
    "#pongSetting",
    "#brickoutSetting",
    "#playPong",
    "#playBrickout",
    "#gameSelectionMulti",
    "#pongLobby",
    "#brickoutLobby",
    "#playPongLocal",
    "#playBrickoutLocal",
    "#playPongRemote",
    "#playPongRemoteSecondP",
    "#playBrickoutRemote",
    "#playBrickoutRemoteSecondP",
    "#playTournamentLocal",
  ].includes(page);
}

export function isTournamentPage(page) {
  return ["#playTournamentLocal", "#tournament"].includes(page);
}

export function isGamePageChat(page) {
  return [
    "#playBrickoutRemote",
    "#playBrickoutRemoteSecondP",
    "#playPongRemote",
    "#playPongRemoteSecondP",
  ].includes(page);
}

export async function renderPageGame(
  page,
  updateHistory = true,
  params = null,
) {
  const authenticated = await isAuthenticated();
  await updateUserAvatar(authenticated);

  if (!authenticated && isMultiplayerPage(page)) renderPageGame("home", true);

  let renderFunction = pongGamePages[page];
  const lastPage = sessionStorage.getItem("lastPage");
  const isRefresh = lastPage === page;
  if (params !== null) {
    sessionStorage.setItem(
      "pageParams",
      typeof params === "string" ? params : JSON.stringify(params),
    );
  }

  if (!renderFunction) {
    history.replaceState({ page: "home", params: params }, "home", "#home");
    renderFunction = renderHomePage;
  } else {
    if (updateHistory) {
      const historyMethod = isRefresh ? "replaceState" : "pushState";
      history[historyMethod](
        {
          page: page,
          params: params || sessionStorage.getItem("pageParams"),
        },
        page,
        `#${page}`,
      );
    }
  }
  sessionStorage.setItem("lastPage", page);

  if (params === null && history.state && history.state.params !== undefined) {
    params = history.state.params;
  }
  await renderFunction(params);
}

window.addEventListener("popstate", async (event) => {
  if (event.state) {
    const page = event.state.page;
    const params = event.state.params;
    clearAllpongStates();
    clearAllBrickStates();
    if (isGamePage(window.location.hash) && gameVar.liveMatch) {
      gameVar.clientLeft = true;
      sendGameData(
        gameVar.gameSocket,
        gameVar.gameStart,
        gameVar.currentLevel,
        gameVar.startTime,
        gameVar.clientLeft,
      );
    } else {
      renderPageGame(page, false, params);
    }
  }
});

window.addEventListener("beforeunload", () => {
  sessionStorage.setItem(
    "gameState",
    JSON.stringify({
      save: gameVar.saveSetting,

      difficulty: gameVar.difficulty,
      level: gameVar.currentLevel,
      puEnable: gameVar.powerUpEnable,
      theme: gameVar.currentTheme,

      difficultyB: brickVar.difficulty,
      levelB: brickVar.currLevel,
      puEnableB: brickVar.powerUpEnable,
    }),
  );
});

window.addEventListener("load", () => {
  const savedState = sessionStorage.getItem("gameState");
  if (savedState) {
    const gameState = JSON.parse(savedState);
    loadSetting(gameState);
  }
  const currentHash = window.location.hash.slice(1) || "home";
  const currentState = history.state || {};
  sessionStorage.setItem("lastPage", currentHash);
  if (
    currentHash === "gameSelectionSolo" ||
    currentHash === "gameSelectionMulti"
  ) {
    if (gameVar.saveSetting) {
      updateDifficultySelection(gameVar.difficulty);
      updateLevelSelection(gameVar.currentLevel);
      updatePowerUpSelection(gameVar.powerUpEnable, true);
      updateDifficultySelectionB(brickVar.difficulty, true);
      updateLevelSelectionB(brickVar.currLevel, true);
      updatePowerUpSelectionB(brickVar.powerUpEnable, true);
    }
  } else if (
    currentHash === "playPong" ||
    currentHash === "playBrickout" ||
    currentHash === "playPongLocal" ||
    currentHash === "playBrickoutLocal" ||
    currentHash === "playPongRemote" ||
    currentHash === "playPongRemoteSecondP" ||
    currentHash === "playBrickoutRemote" ||
    currentHash === "playBrickoutRemoteSecondP" ||
    currentHash === "pongLobby" ||
    currentHash === "brickoutLobby"
  ) {
    clearAllpongStates();
    clearAllBrickStates();
    renderPage("home");
    return;
  } else {
    renderPageGame(currentHash, false, currentState.params || false);
  }
});

function loadSetting(gameState) {
  gameVar.saveSetting = gameState.save;
  gameVar.difficulty = gameState.difficulty;
  gameVar.currentLevel = gameState.level;
  gameVar.powerUpEnable = gameState.puEnable;
  brickVar.difficulty = gameState.difficultyB;
  brickVar.currLevel = gameState.levelB;
  brickVar.powerUpEnable = gameState.puEnableB;
  gameVar.currentTheme = gameState.theme;
  changeTheme(gameVar.currentTheme);
}

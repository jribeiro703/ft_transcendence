// initializeTournamentGame.js

import gameVar from "../game/pong/var.js";
import { SCORE_CANVAS_HEIGHT } from "../game/pong/const.js";

export function initializeCanvasAndScore() {
    var canvas = document.getElementById('game-board');
    if (!canvas) {
        console.error("Canvas element 'game-board' not found.");
        return;
    }
    gameVar.ctx = canvas.getContext('2d');
    canvas.width = gameVar.canvasW;
    canvas.height = gameVar.canvasH;

    var scoreCanvas = document.getElementById('scoreCanvas');
    if (!scoreCanvas) {
        console.error("Canvas element 'scoreCanvas' not found.");
        return;
    }
    gameVar.scoreCtx = scoreCanvas.getContext('2d');
    scoreCanvas.width = gameVar.scoreCanvW;
    scoreCanvas.height = SCORE_CANVAS_HEIGHT;

    gameVar.gameTime = 0;
    gameVar.gameTimer = setInterval(() => {
        if (gameVar.startTime) {
            gameVar.gameTime++;
        }
    }, 1000);

    scoreCanvas.style.marginBottom = '10px';
}

export function initializeLobbySocket() {
	const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
	const lobbySocket = new WebSocket(protocol + '//' + window.location.host + '/ws/pong/check_rooms/');

	lobbySocket.onopen = function(e) {
		console.log('Lobby socket opened');
		gameVar.lobbySocket = lobbySocket;
	};

	lobbySocket.onmessage = function(e) {
		const data = JSON.parse(e.data);
		console.log("Lobby data: ", data);
		// Handle lobby messages
	};

	lobbySocket.onerror = function(e) {
		console.error('Lobby socket error:', e);
	};

	lobbySocket.onclose = function(e) {
		console.error('Lobby socket closed unexpectedly code : ', e.code, 'reason', e.reason);
	};
}

export function joinRoom(roomName) {
	const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
	const gameSocket = new WebSocket(protocol + '//' + window.location.host + `/ws/pong/${roomName}/`);

	gameSocket.onopen = function(e) {
		console.log('Game socket opened');
		gameVar.gameSocket = gameSocket;
		try {
			gameSocket.send(JSON.stringify({ type: 'join_room' }));
			if (gameVar.playerIdx == 1) {
				waitingPlayer();
			}
			if (gameVar.playerIdx == 2) {
				sendPlayerData(gameVar.gameSocket, gameVar.playerReady);
				updateSettingLive();
			}
		} catch (error) {
			console.error("error on send message: ", error);
		}
	};

	gameSocket.onmessage = function(e) {
		const data = JSON.parse(e.data);
		console.log("Game data: ", data);
		// Handle game messages
	};

	gameSocket.onerror = function(e) {
		console.error('Game socket error:', e);
	};

	gameSocket.onclose = function(e) {
		console.error('Game socket closed unexpectedly code : ', e.code, 'reason', e.reason);
	};
}

export function initializeGameVariables(difficulty, currentLevel) {
	gameVar.gameReady = false;
	gameVar.difficulty = difficulty;
	gameVar.currentLevel = currentLevel;
	gameVar.playerReady = false;
}

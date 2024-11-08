import gameVar from './var.js';
import { BALL_RADIUS } from './const.js';
import { keyUpHandler, keyDownHandler, manageMove, startBall } from './input.js';
import { initializeBall, initDraw, drawPowerUp } from './draw.js';
import { createPowerUP, collectPowerUp } from './powerUp.js';
import { resetBall } from './reset.js';
import { checkForExistingRooms, joinRoom } from './room.js';
import { sendBallData, sendPaddleData } from './network.js';

document.addEventListener('DOMContentLoaded', function() {
	const link = document.createElement('link');
	link.rel = 'stylesheet';
	link.href = 'static/css/style.css';
	link.type = 'text/css';

	document.head.appendChild(link);

	const quickGameBtn = document.getElementById('quickGameBtn');
	gameVar.defaultView = document.getElementById('defaultView');
	gameVar.gameView = document.getElementById('gameView');
	gameVar.playerScoreElement = document.getElementById('playerScore');
	gameVar.aiScoreElement = document.getElementById('aiScore');
	var canvas = document.getElementById('myCanvas');
	gameVar.ctx = canvas.getContext('2d');

	canvas.width = 780;
	canvas.height = 420;

	let isFirstPlayer = false;
	let roomName = null;
	let gameSocket = null;

	quickGameBtn.addEventListener('click', () => {
		showGameView();
		history.pushState({ view: 'game' }, '', '?view=game');
	});
	document.addEventListener("keydown", (e) => keyDownHandler(e, isFirstPlayer), false);
	document.addEventListener("keyup", (e) => keyUpHandler(e, isFirstPlayer), false);
	document.addEventListener("keydown", startBall, false);

	// window.addEventListener('popstate', function(event) {
	// 	if (!window.location.search.includes('room')) {
	// 		const urlParams = new URLSearchParams(window.location.search);
	// 		const room = urlParams.get('room');
	// 		if (room) {
	// 			showLobbyView();
	// 		}
	// 	} else {
	// 		showLobbyView();
	// 	}
	// });

	window.addEventListener('popstate', function(event) {
		if (event.state && event.state.view === 'game') {
			const urlParams = new URLSearchParams(window.location.search);
			const room = urlParams.get('room');
			if (room) {
				showGameView(room);
			} else {
				showGameView();
			}
		} else {
			showLobbyView();
		}
	});

	function showGameView(room = null) {
		defaultView.style.display = 'none';
		gameView.style.display = 'block';
		initializeBall();
		createPowerUP();
		if (room) {
			joinRoom(room, setGameSocket, setIsFirstPlayer);
		} else {
			checkForExistingRooms((room) => joinRoom(room, setGameSocket, setIsFirstPlayer));
		}
		draw();
	}

	function showLobbyView() {
		defaultView.style.display = 'block';
		gameView.style.display = 'none';
		if (gameSocket) {
			gameSocket.close();
		}
		cancelAnimationFrame(gameVar.animationFrame);
	}

	function setGameSocket(socket) {
		gameSocket = socket;
	}

	function setIsFirstPlayer(value) {
		isFirstPlayer = value;
	}

	function draw() {
		gameVar.ctx.clearRect(0, 0, canvas.width, canvas.height);
		initDraw();
		drawPowerUp();
		collectPowerUp();
		if (gameVar.gameStart) {
			if (isFirstPlayer) {
				gameVar.x += gameVar.dx;
				gameVar.y += gameVar.dy;

				if (gameVar.y + gameVar.dy > canvas.height - BALL_RADIUS || gameVar.y + gameVar.dy < BALL_RADIUS) {
					gameVar.dy = -gameVar.dy;
				}
				if (gameVar.x - BALL_RADIUS < gameVar.playerPaddleWidth && gameVar.y > gameVar.playerPaddleX && gameVar.y < gameVar.playerPaddleX + gameVar.playerPaddleHeight) {
					gameVar.dx = -gameVar.dx;
				} else if (gameVar.x + BALL_RADIUS > canvas.width - gameVar.aiPaddleWidth && gameVar.y > gameVar.aiPaddleX && gameVar.y < gameVar.aiPaddleX + gameVar.aiPaddleHeight) {
					gameVar.dx = -gameVar.dx;
					gameVar.x = canvas.width - gameVar.aiPaddleWidth - BALL_RADIUS;
				} else if (gameVar.x < 0) {
					resetBall('ai');
				} else if (gameVar.x > canvas.width) {
					resetBall('player');
				}
			}
		} else {
			if (isFirstPlayer) {
				gameVar.x = gameVar.playerPaddleWidth + BALL_RADIUS;
				gameVar.y = gameVar.playerPaddleX + gameVar.playerPaddleHeight / 2;
			} else {
				gameVar.x = canvas.width - gameVar.aiPaddleWidth - BALL_RADIUS;
				gameVar.y = gameVar.aiPaddleX + gameVar.aiPaddleHeight / 2;
			}
			sendBallData(gameVar.x, gameVar.y, gameSocket);
			if (isFirstPlayer) {
				sendPaddleData(gameVar.playerPaddleX, gameSocket);
			} else {
				sendPaddleData(gameVar.aiPaddleX, gameSocket);
			}
		}
		manageMove(isFirstPlayer);
		gameVar.animationFrame = requestAnimationFrame(draw);
	}

	const observer = new MutationObserver(() => {
		canvas.width = canvas.clientWidth;
		canvas.height = canvas.clientHeight;
	});

	observer.observe(canvas, { attributes: true, attributeFilter: ['style'] });

	draw();
});
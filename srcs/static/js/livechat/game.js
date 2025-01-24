import gameVar from '../game/pong/var.js';
import { isGamePageChat } from '../game/HistoryManager.js';
import { formatTimestamp, getColorForClientId, toggleChat } from "./utils.js";
import { initializeTooltip } from "./tooltip.js";

export let gameChatSocket = null;

document.addEventListener('DOMContentLoaded', function () {
	const swordsButton = document.getElementById('swordsButton');
	const gameChat = document.getElementById('gamechat');

	swordsButton.addEventListener('click', function () {
		const currentPage = window.location.hash || '';
		if (isGamePageChat(currentPage)) {
			document.getElementById('gamechat').classList.remove('d-none');
			document.getElementById('chat-log').classList.add('d-none');
			document.getElementById('friendlist').classList.add('d-none');
			document.getElementById('onlinelist').classList.add('d-none');
			document.getElementById('notificationlist').classList.add('d-none');

			if (!gameChatSocket) {
				gameChat.innerHTML = '';
				// Connect to game chat websocket if in a game room
				if (gameVar.gameSocket && gameVar.gameSocket.url) {
					const roomMatch = gameVar.gameSocket.url.match(/ws\/pong\/room_(\d+)/);
					if (roomMatch && roomMatch[1]) {
						const roomNumber = roomMatch[1];
						// Create new gamechat websocket with same room number
						gameChatSocket = initializeGameChatSocket(roomNumber);
					}
				}
			}
		} else {
			// Regular chat view
			document.getElementById('chat-log').classList.remove('d-none');
			document.getElementById('gamechat').classList.add('d-none');
			document.getElementById('friendlist').classList.add('d-none');
			document.getElementById('onlinelist').classList.add('d-none');
			document.getElementById('notificationlist').classList.add('d-none');
		}
	});
});

export function initializeGameChatSocket(roomNumber) {
	gameChatSocket = new WebSocket(
		`wss://${window.location.host}/ws/livechat/room_${roomNumber}/`
	);

	gameChatSocket.onmessage = function (e) {
		const data = JSON.parse(e.data);
		createGameMessageComponents(data);
	};

	gameChatSocket.onopen = function () {
		console.log('Game chat socket connected for room:', roomNumber);
	};

	gameChatSocket.onerror = function (error) {
		console.error('Game chat socket error:', error);
	};

	gameChatSocket.onclose = function () {
		console.log("Game chat socket closed.");
	};

	return gameChatSocket;
}

function createGameMessageComponents(data) {
	const message = data.message;
	const clientId = data.client_id;
	const timestamp = data.timestamp;
	const gameChat = document.querySelector("#gamechat");
	const formattedTime = formatTimestamp(timestamp);
	const clientIdColor = getColorForClientId(clientId);

	const messageElement = document.createElement("div");
	const timeSpan = document.createElement("span");
	timeSpan.textContent = `[${formattedTime}] `;
	timeSpan.style.color = clientIdColor;

	const nicknameSpan = document.createElement("span");
	nicknameSpan.textContent = `${clientId}: `;
	nicknameSpan.style.color = clientIdColor;
	nicknameSpan.style.cursor = 'pointer';

	initializeTooltip(nicknameSpan, clientId);

	const messageText = document.createElement("span");
	messageText.textContent = message;

	messageElement.appendChild(timeSpan);
	messageElement.appendChild(nicknameSpan);
	messageElement.appendChild(messageText);

	gameChat.prepend(messageElement);
	gameChat.scrollTop = gameChat.scrollHeight;
}

document.addEventListener('multiplayerGame', function (e) {
	if (e.detail.multiplayer_game) {
		if (document.querySelector("[data-chat-icon]").innerHTML.includes("chat-icon-fill")) {
			toggleChat();
		}
		document.getElementById('swordsButton').click();
	}
});

export function closeGameChat() {
	if (!document.querySelector("#gamechat").classList.contains('d-none')) {
		document.getElementById('bubbleButton').click();
	}

	if (gameChatSocket) {
		gameChatSocket.close();
		gameChatSocket = null;
	}

	const GameChatDiv = document.getElementById('gamechat');
	const spans = GameChatDiv.querySelectorAll('span');
	spans.forEach(span => span.remove());
}
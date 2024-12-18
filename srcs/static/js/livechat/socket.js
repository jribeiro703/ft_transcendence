import { fetchAuthData } from '../user/fetchData.js';
import { formatTimestamp, getColorForClientId, isClientBlocked } from "./utils.js";
import { initializeTooltip } from "./tooltip.js";
import { showToast } from '../user/tools.js';

export let chatSocket = new WebSocket(
	"wss://" + window.location.host + "/ws/livechat/",
);

async function createMessageComponents(data) {
	console.log(data);
	const message = data.message;
	const clientId = data.client_id;
	const timestamp = data.timestamp;
	const chatLog = document.querySelector("#chat-log");
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
	const blocked = await isClientBlocked(clientId);
	if (blocked) {
		messageElement.classList.add("d-none");
	}
	chatLog.prepend(messageElement);
	chatLog.scrollTop = chatLog.scrollHeight;
}

const socketHandlers = {
	onMessage: function (e) {
		const data = JSON.parse(e.data);
		createMessageComponents(data);
	},

	onOpen: async function () {
		try {
			const response = await fetchAuthData('/user/check-auth/');

			if (response.status === 401) {
				console.error('Authentication required');
				return;
			}

			const token = localStorage.getItem('access_token');
			chatSocket.send(JSON.stringify({
				type: 'authenticate',
				token: token
			}));

			console.log('Chat socket connected and authenticated');
		} catch (error) {
			console.error('Error authenticating chat socket:', error);
			showToast("Error connecting to chat", "error");
		}
	},

	onClose: function () {
		// console.log("Chat socket closed unexpectedly");
	}
};

export function initializeChatSocket(socket) {
	socket.onmessage = socketHandlers.onMessage;
	socket.onopen = socketHandlers.onOpen;
	socket.onclose = socketHandlers.onClose;
	socket.onerror = socketHandlers.onError;
	return socket;
};

export function reloadChatSocket() {
	if (chatSocket) {
		chatSocket.close();
	}

	chatSocket = new WebSocket(
		"wss://" + window.location.host + "/ws/livechat/",
	);

	initializeChatSocket(chatSocket);
};

document.addEventListener('otpVerificationSuccess', function (e) {
	if (e.detail.reload_chat) {
		reloadChatSocket();
	}
});

initializeChatSocket(chatSocket);
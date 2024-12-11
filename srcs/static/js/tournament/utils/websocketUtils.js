// tournament/utils/websocketUtils.js

export function createWebSocketConnection(url, action, onMessageCallback, onErrorCallback, onCloseCallback) {
	const socket = new WebSocket(url);

	socket.onopen = function () {
		// console.log("WebSocket connection established");
		socket.send(JSON.stringify({ action: action }));
	};

	socket.onmessage = function (event) {
		// console.log("Message received from server:", event.data);

		try {
			const data = JSON.parse(event.data);
			onMessageCallback(data);
		} catch (e) {
			console.error("Failed to process message:", e);
		}
	};

	socket.onerror = function (error) {
		console.error("WebSocket error:", error);
		if (onErrorCallback) {
			onErrorCallback(error);
		}
	};

	socket.onclose = function () {
		console.log("WebSocket connection closed");
		if (onCloseCallback) {
			onCloseCallback();
		}
	};

	return socket;
}

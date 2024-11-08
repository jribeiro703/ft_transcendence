export function sendBallData(x, y, socket) {
	if (socket && socket.readyState == WebSocket.OPEN) {
		const data = {
			type: 'ball_data',
			x: x,
			y: y
		};
		socket.send(JSON.stringify(data));
	}
}

export function sendPaddleData(paddle_x, socket) {
	if (socket && socket.readyState == WebSocket.OPEN) {
		const data = {
			type: 'paddle_data',
			paddle_x: paddle_x,
		};
		socket.send(JSON.stringify(data));
	}
}
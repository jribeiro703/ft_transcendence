import gameVar from "./var.js";

export function sendBallData(x, y, dx, dy, socket)
{
	if (socket && socket.readyState == WebSocket.OPEN)
	{
		const data =
		{
			type: 'ball_data',
			x: x,
			y: y,
			dx: dx,
			dy: dy,
		};
		socket.send(JSON.stringify(data));
	}
}

export function sendPaddleData(paddle_y, socket, playerIdx)
{
	if (socket && socket.readyState == WebSocket.OPEN)
		{
			const data =
			{
				type: 'paddle_data',
				paddle_y: paddle_y,
				player: playerIdx
			};
		socket.send(JSON.stringify(data));
	}
}
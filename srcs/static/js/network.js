import gameVar from "./var.js";

export function sendBallData(x, y, socket)
{
	if (socket && socket.readyState == WebSocket.OPEN)
	{
		const data =
		{
			type: 'ball_data',
			x: x,
			y: y,
			timestamp: Date.now(),
		};
		socket.send(JSON.stringify(data));
	}
}

export function sendDirectionData(dx, dy, socket)
{
	if (socket && socket.readyState == WebSocket.OPEN)
	{
		const data =
		{
			type: 'direction_data',
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
				playerIdx: playerIdx,
			};
		socket.send(JSON.stringify(data));
	}
	else
		console.log("Error websocket");
}

export function sendPlayerData(socket, playerReady, currentServer)
{
	if (socket && socket.readyState == WebSocket.OPEN)
	{
		const data = 
		{
			type: 'player_data',
			playerReady: playerReady,
			currentServer: currentServer,
		};
		socket.send(JSON.stringify(data));
	}
}

export function sendGameData(socket, gameStart, gameReady, animationFrame)
{
	if (socket && socket.readyState == WebSocket.OPEN)
	{
		const data = 
		{
			type: 'game_data',
			gameStart: gameStart,
			gameReady: gameReady,
			animationFrame: animationFrame,
		};
		socket.send(JSON.stringify(data));
	}
}
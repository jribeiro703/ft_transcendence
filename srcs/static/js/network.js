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

export function sendDirectionData(dx, dy, initDx, initDy, socket)
{
	if (socket && socket.readyState == WebSocket.OPEN)
	{
		const data =
		{
			type: 'direction_data',
			dx: dx,
			dy: dy,
			initDx: initDx,
			initDy: initDy,
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

export function sendGameData(socket, gameStart, gameReady, difficulty, currentLevel)
{
	if (gameVar.playerIdx === 1)
		console.log("1 send gameData ");
	if (gameVar.playerIdx === 2)
		console.log("2 send gameData ");
	if (socket && socket.readyState == WebSocket.OPEN)
	{
		const data = 
		{
			type: 'game_data',
			gameStart: gameStart,
			gameReady: gameReady,
			difficulty: difficulty,
			currentLevel: currentLevel,
		};
		socket.send(JSON.stringify(data));
		console.log("send game data ok");
	}
}


export function sendRoomData(socket, idx, name, nbPlayer, status)
{
	if (socket && socket.readyState == WebSocket.OPEN)
	{
		const data =
		{
			type: 'room_data',
			idx: idx,
			name: name,
			nbPlayer: nbPlayer,
			status: status,
		};
		socket.send(JSON.stringify(data));
	}
}
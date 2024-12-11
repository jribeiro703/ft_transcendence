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
	else
		console.log("Error websocket");

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

export function sendPlayerData(socket, playerReady)
{
	if (socket && socket.readyState == WebSocket.OPEN)
	{
		const data = 
		{
			type: 'player_data',
			playerReady: playerReady,
		};
		socket.send(JSON.stringify(data));
	}
	else
		console.log("Error websocket");
}

export function sendGameData(socket, gameStart, currentServer, startTime, clientLeft)
{
	if (socket && socket.readyState == WebSocket.OPEN)
	{
		const data = 
		{
			type: 'game_data',
			gameStart: gameStart,
			currentServer: currentServer,
			startTime: startTime,
			clientLeft: clientLeft,
		};
		socket.send(JSON.stringify(data));
	}
	else
		console.log("Error websocket");
}

export function sendSettingData(socket, gameReady, difficulty, currentLevel)
{
	if (socket && socket.readyState == WebSocket.OPEN)
	{
		const data = 
		{
			type: 'setting_data',
			gameReady: gameReady,
			difficulty: difficulty,
			currentLevel: currentLevel,
		};
		socket.send(JSON.stringify(data));
	}
	else
		console.log("Error websocket");
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
	else
		console.log("Error websocket");
}

export function sendPlayerRoomData(socket, userid)
{
	if (socket && socket.readyState == WebSocket.OPEN)
	{
		const data =
		{
			type: 'player_room_data',
			userid: userid,
		};
		socket.send(JSON.stringify(data));
	}
	else
		console.log("Error websocket");
}


export function sendScoreInfo(socket, idx, name1, name2, score1, score2)
{
	if (socket && socket.readyState == WebSocket.OPEN)
	{
		const data =
		{
			type: 'score_info_data',
			idx: idx,
			name1: name1,
			name2: name2,
			score1: score1,
			score2: score2,
		};
		socket.send(JSON.stringify(data));
	}
	else
		console.log("Error websocket");
}
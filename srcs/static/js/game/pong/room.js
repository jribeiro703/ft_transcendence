import gameVar from './var.js';
import { sendPlayerData, sendPlayerRoomData, sendSettingData } from './network.js';
import { drawLive } from './draw.js';
import { initializeBall } from './ball.js';
import { updateCanvasColor } from './update.js';
import { drawScoreBoard } from './score.js';
import { renderPageGame } from '../HistoryManager.js';
import { fetchAuthData } from '../../user/fetchData.js';

export async function createNewRoom(joinRoomCallback)
{
	const roomName = `room_${Math.floor(Math.random() * 10000)}`;
	gameVar.playerIdx = 1;
	gameVar.isFirstPlayer = true;
	joinRoom(roomName);

}

export function waitingPlayer()
{
	const waitingINterval = setInterval(() =>
	{
		console.log("player ready in waiting: ", gameVar.playerReady);
		if(!gameVar.playerReady)
		{
			gameVar.ctx.font = '40px Arial';
			gameVar.ctx.fillStyle = '#455F78';
			gameVar.ctx.fillText("Waiting for opponent...", gameVar.canvasW / 4, gameVar.canvasH / 2);
			gameVar.ctx.strokeStyle = '#1F2E4D'; 
			gameVar.ctx.lineWidth = 1;
			gameVar.ctx.strokeText("Waiting for opponent...", gameVar.canvasW / 4, gameVar.canvasH / 2);
			sendSettingData(gameVar.lobbySocket, gameVar.gameReady, gameVar.difficulty, gameVar.currentLevel);
		}
		else
		{
			gameVar.gameReady = true;
			clearInterval(waitingINterval);
			sendSettingData(gameVar.gameSocket, gameVar.gameReady, gameVar.difficulty, gameVar.currentLevel);
			startLiveGame();
		}
	}, 2000);

}

export function startLiveGame()
{
	initializeBall();
	updateCanvasColor();
	drawLive();
}

export async function joinRoom(roomName)
{
	const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
	const gameSocket = new WebSocket(protocol + '//' + window.location.host + `/ws/pong/${roomName}/`);

	const response = await fetchAuthData('/user/private/')
	if (response.status == 200)
	{
		const userid = response.data.id;
		sendPlayerRoomData(gameSocket, userid);
	}
	else
	{
		console.log("error on fetch");
	}
	gameSocket.onopen = function(e)
	{
		console.log('Game socket opened');
		try
		{
			gameSocket.send(JSON.stringify({ type: 'join_room' }));
			gameVar.gameSocket = gameSocket;
			if (gameVar.playerIdx == 1)
			{
				waitingPlayer();
			}
			if (gameVar.playerIdx == 2)
			{
				sendPlayerData(gameVar.gameSocket, gameVar.playerReady);
				updateSettingLive();
			}
		}
		catch (error)
		{
			console.error("error on send message: ", error);
		}
	};

	gameSocket.onmessage = function(e)
	{
		try
		{
			const data = JSON.parse(e.data);
			if (data.type !== 'ball_data' && data.type !== 'paddle_data' && data.type !== 'direction_data')
				console.log("data: ", data);
			if (data.type === 'ping')
			{
				gameSocket.send(JSON.stringify({ type: 'pong' }));
			}
			else if (data.type == 'client_left')
			{
				gameVar.clientLeft = true;
				if (gameSocket && gameSocket.readyState === WebSocket.OPEN)
				{
					gameSocket.send(JSON.stringify({
            		type: 'room_deleted',
            		room_name: roomName
        		}));
				}
			}
			else if (data.type == 'ball_data')
			{
				gameVar.x = data.ball_data.x;
				gameVar.y = data.ball_data.y;
			} 
			else if (data.type == 'direction_data')
			{
				gameVar.dx = data.direction_data.dx;
				gameVar.dy = data.direction_data.dy;
				gameVar.init_dx = data.direction_data.initDx;
				gameVar.init_dy = data.direction_data.initDy;
			}
			else if (data.type == 'paddle_data') 
			{
				if (data.paddle_data.playerIdx == 1)
				{
					gameVar.playerPaddleY = data.paddle_data.paddle_y;
				}
				if(data.paddle_data.playerIdx == 2)
				{
					gameVar.player2PaddleY = data.paddle_data.paddle_y;
				}
			} 
			else if (data.type == 'player_data')
			{
				gameVar.playerReady = data.player_data.playerReady;
			}
			else if (data.type == 'game_data')
			{
				gameVar.gameStart = data.game_data.gameStart;
				gameVar.currentServer = data.game_data.currentServer;
				gameVar.startTime = data.game_data.startTime;
				gameVar.clientLeft = data.game_data.clientLeft;
			}
			else if (data.type == 'setting_data')
			{
				gameVar.gameReady = data.setting_data.gameReady;
				gameVar.difficulty = data.setting_data.difficulty;
				gameVar.currentLevel = data.setting_data.currentLevel;
			}
		}
		catch (error)
		{
			console.error("error process message", error);
		}
	};

	gameSocket.onerror = function(e)
	{
		console.error('Game socket error:', e);
	};

	gameSocket.onclose = function(e)
	{
		console.error('Game socket closed unexpectedly code : ', e.code, 'reason', e.reason);
	};
}

export function delRooms()
{
	while (gameVar.rooms.length > 0)
		gameVar.rooms.pop();
}
export function updateRoomInfo(index, difficulty, level)
{
    const room = gameVar.rooms.find(room => room.idx === index);

    if (room)
	{
		room.difficulty = difficulty;
		room.level = level;
    } 
}
export function addRoom(index, roomName, status, nbplayer, difficulty = null, level = null)
{
    if (!gameVar.rooms.some(room => room.name === roomName))
	{
        gameVar.rooms.push(
		{
            idx: index,      
            name: roomName,
			players: nbplayer,
			difficulty: difficulty,
			level: level,
            status: status
        });
    }
}

export function updateRoomList()
{
	gameVar.roomsContainer.innerHTML = '';
	gameVar.rooms.forEach(room =>
	{
		if (room.idx === null || room.idx === undefined)
			return ;

		gameVar.noRoomsMessage.style.display = 'none';
		const roomItem = document.createElement('div');
		roomItem.className = 'server-item';

		roomItem.innerHTML = `
            <div class="room-header">
                <span class="room-name">${room.name}</span>
                <button class="joinRoomBtn" ${room.status === 'Started' ? 'disabled' : ''}>Join</button>
            </div>
            <div class="room-info">
                <span class="room-players">Players: ${room.players}/2</span>
                <span class="room-difficulty">Difficulty: ${room.difficulty}</span>
                <span class="room-level">Level: ${room.level}</span>
                <span class="room-status">Status: ${room.status}</span>
            </div>
        `;

		const joinBtn = roomItem.querySelector('.joinRoomBtn');
		joinBtn.addEventListener('click', () =>
		{
			gameVar.playerIdx = 2;
			gameVar.playerReady = true;
			renderPageGame('playPongRemoteSecondP', true);
			joinRoom(room.name); 
		});

		gameVar.roomsContainer.appendChild(roomItem);
	})
}

export function updateSettingLive()
{
	const waitingInterval = setInterval(() =>
	{
		if(gameVar.currentLevel === null || gameVar.difficulty === null)
		{
			console.log("waiting for setting");
		}
		else
		{
			updateCanvasColor();
			drawScoreBoard();
			initializeBall();
			drawLive();
			clearInterval(waitingInterval);
		}
	}, 2000);
}
export function checkRoom(rooms)
{
    if (rooms && Array.isArray(rooms)) 
	{
        gameVar.rooms = gameVar.rooms.filter(room => rooms.includes(room.name));
        updateRoomList();
    }
}
export function roomNetwork()
{
	const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
	const tempSocket = new WebSocket(protocol + '//' + window.location.host + '/ws/pong/check_rooms/');
	gameVar.lobbySocket = tempSocket;
	var idx = 0;
	gameVar.refreshBtn.addEventListener('click', () =>
	{
		tempSocket.send(JSON.stringify({type: 'lobbyView'}));
		updateRoomList();
	});

	tempSocket.onopen = function(e)
	{
		tempSocket.send(JSON.stringify({type: 'lobbyView'}));
	};

	tempSocket.onmessage = function(e)
	{
		const data = JSON.parse(e.data);
		if (data.type === 'looks_rooms')
		{
			if (data.rooms)
			{
				idx = gameVar.rooms.length;

				data.rooms.forEach(roomName => 
				{
					checkRoom(data.rooms);	
					const roomExists = gameVar.rooms.some(room => room.name === roomName);
				
					if (!roomExists)
					{
						addRoom(idx, roomName, 'Waiting for opponent', 1);
						idx++;
					}
    			});
			}
		}
		if (data.type == 'norooms')
		{
			delRooms();
			gameVar.noRoomsMessage.style.display = 'block';
			updateRoomList();
		}
		if (data.type === 'ping')
		{
			tempSocket.send(JSON.stringify({ type: 'pong' }));
		}
		if (data.type === 'setting_data')
		{
			idx--;
			updateRoomInfo(idx, data.setting_data.difficulty, data.setting_data.currentLevel);
			updateRoomList();
		}
	}
	tempSocket.onerror = function(event)
	{
    	console.error("WebSocket error observed:", event);
	};

	tempSocket.onclose = function(event)
	{
    	console.log("WebSocket closed:", event);
	};
}


import gameVar from './var.js';
import { sendBallData, sendGameData, sendPaddleData, sendPlayerData, sendRoomData } from './network.js';
import { draw2, initializeBall } from './draw.js';
import { showGameplayMultiView } from './gameView.js';

export function createNewRoom(joinRoomCallback)

{
	console.log("createnewroom");
	const roomName = `room_${Math.floor(Math.random() * 10000)}`;
	gameVar.playerIdx = 1;
	gameVar.playerReady = true;
	gameVar.isFirstPlayer = true;
	joinRoom(roomName);
}

export function joinRoom(roomName)
{
	console.log("join room call back");
	const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
	const gameSocket = new WebSocket(protocol + '//' + window.location.host + `/ws/pong/${roomName}/`);

	gameSocket.onopen = function(e)
	{
		console.log('Game socket opened');
		try
		{
			gameSocket.send(JSON.stringify({ type: 'join_room' }));
			gameVar.gameSocket = gameSocket;
			history.pushState({ view: 'game', room: roomName }, '', `?view=multi&room=${roomName}`);
			initializeBall();
			draw2();
		}
		catch (error)
		{
			console.error("erreur send message", error);
		}
	};

	gameSocket.onmessage = function(e)
	{
		try
		{
			const data = JSON.parse(e.data);
			if (data.type === 'ping')
			{
				gameSocket.send(JSON.stringify({ type: 'pong' }));
				console.log('Pong envoyé en réponse');
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
				console.log("playerDataonmsg");
				gameVar.playerReady = data.player_data.playerReady;
				gameVar.currentServer = data.player_data.currentServer;
			}
			else if (data.type == 'game_data')
			{
				console.log("gameDataonmsg");
				gameVar.gameStart = data.game_data.gameStart;
				gameVar.gameReady = data.game_data.gameReady;
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
export function displayRoomInfo()
{
	console.log("rooms : ", gameVar.rooms);
}

export function updateRoomInfo(index, roomName, playerCount, roomStatus)
{
    const room = gameVar.rooms.find(room => room.idx === index);

    if (room)
	{
        room.name = roomName || room.name; 
        room.players = playerCount;
        room.status = roomStatus;
    } 
}


export function addRoom(index, roomName, status)
{
    if (!gameVar.rooms.some(room => room.name === roomName))
	{
        gameVar.rooms.push(
		{
            idx: index,      
            name: roomName,
            status: status
        });
    }
}

export function updateRoomList()
{
	console.log("updateRooomList");
	console.log("gameRoom: ", gameVar.rooms);
	gameVar.noRoomsMessage.style.display = 'none';
	gameVar.roomsContainer.style.display = 'block';

	gameVar.roomsContainer.innerHTML = '';

	gameVar.rooms.forEach(room =>
	{
		if (room.idx === null || room.idx === undefined)
			return ;

		const roomItem = document.createElement('div');
		roomItem.className = 'server-item';

		roomItem.innerHTML = `
			<span class="room-name">${room.name}</span>
			<span class="room-players">${room.players}/2</span>
			<span class="room-status">${room.status}</span>
			<button class="joinRoomBtn" ${room.status} === 'Started' ? 'disabled' : ''}>Join</button>
		`;

		const joinBtn = roomItem.querySelector('.joinRoomBtn');
		joinBtn.addEventListener('click', () =>
		{
			gameVar.noRoomsMessage.style.display = 'none';
			gameVar.roomsContainer.style.display = 'none';
			gameVar.roomView.style.display = 'none';
			gameVar.createRoomBtn.style.display = 'none';
			gameVar.refreshBtn.style.display = 'none';
			gameVar.gameView.style.display = 'block';
			console.log("roomName : ", room.name);
			gameVar.playerIdx = 2;
			gameVar.playerReady = true;
			joinRoom(room.name); 
		});

		gameVar.roomsContainer.appendChild(roomItem);
	})
}


// export function checkForExistingRooms(joinRoomCallback)
// {
// 	const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
// 	const tempSocket = new WebSocket(protocol + '//' + window.location.host + '/ws/pong/check_rooms/');

// 	tempSocket.onopen = function(e)
// 	{
// 		console.log('Temporary socket opened');
// 		tempSocket.send(JSON.stringify({ type: 'check_rooms' }));
// 	};

// 	tempSocket.onmessage = function(e)
// 	{
// 		const data = JSON.parse(e.data);
// 		if (data.type === 'available_rooms' && data.rooms.length > 0)
// 		{
// 			console.log("join room call backkkkkk");
// 			const roomName = data.rooms[0];
// 			joinRoomCallback(roomName);
// 			gameVar.playerIdx = 2;
// 			// // gameVar.playerReady = true;
// 			// const player = gameVar.players.find(player => player.idx === gameVar.playerIdx)
// 			// if (player)
// 			// 	player.ready = true;
// 			console.log("started 2");
			
// 		}
// 		else
// 		{
// 			console.log("createnewroooom");
// 			const newRoom = createNewRoom(joinRoomCallback);
// 			gameVar.playerIdx = 1;
// 			// gameVar.playerReady = true;
// 			// gameVar.isFirstPlayer = true;
// 			// const player = gameVar.players.find(player => player.idx === gameVar.playerIdx);
// 			// if (player)
// 				// player.ready = true;
// 			console.log("waiting 1");
			

// 		}
// 		tempSocket.close();
// 	};

// 	tempSocket.onerror = function(e)
// 	{
// 		console.error('Temporary socket error:', e);
// 		createNewRoom(joinRoomCallback);
// 		tempSocket.close();
// 	};

// 	tempSocket.onclose = function(e)
// 	{
// 		console.log('Temporary socket closed');
// 	};
// }
// else if (data.type == 'room_data')
			// {
			// 	updateRoomInfo(data.room_data.idx, data.room_data.name, data.room_data.nbPlayer, data.room_data.status);
			// }
			// else if (data.type == 'room_joined')
			// {
			// 	console.log(`Joined room: ${data.room_name}`);
			// } 
			// else if (data.type == 'client_joined')
			// {
			// 	console.log(data.message);
			// } 
			// else if (data.type == 'client_left')
			// {
			// 	gameVar.playerReady = false;
			// 	gameSocket.send(JSON.stringify({ type: 'room_deleted'}));
			// 	sendPlayerData(gameVar.gameSocket, gameVar.playerReady, gameVar.currentServer);
			// }
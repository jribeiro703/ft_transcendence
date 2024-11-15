import gameVar from './var.js';
import { sendBallData, sendPaddleData, sendPlayerData, sendRoomData } from './network.js';
import { draw2, initializeBall } from './draw.js';
import { showGameplayMultiView } from './gameView.js';

export function checkForExistingRooms(joinRoomCallback)
{
	const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
	const tempSocket = new WebSocket(protocol + '//' + window.location.host + '/ws/pong/check_rooms/');

	tempSocket.onopen = function(e)
	{
		console.log('Temporary socket opened');
		tempSocket.send(JSON.stringify({ type: 'check_rooms' }));
	};

	tempSocket.onmessage = function(e)
	{
		const data = JSON.parse(e.data);
		if (data.type === 'available_rooms' && data.rooms.length > 0)
		{
			console.log("join room call backkkkkk");
			const roomName = data.rooms[0];
			joinRoomCallback(roomName);
			gameVar.playerIdx = 2;
			// gameVar.playerReady = true;
			const player = gameVar.players.find(player => player.idx === gameVar.playerIdx)
			if (player)
				player.ready = true;
			console.log("started 2");
			
		}
		else
		{
			console.log("createnewroooom");
			const newRoom = createNewRoom(joinRoomCallback);
			gameVar.playerIdx = 1;
			// gameVar.playerReady = true;
			// gameVar.isFirstPlayer = true;
			const player = gameVar.players.find(player => player.idx === gameVar.playerIdx);
			if (player)
				player.ready = true;
			console.log("waiting 1");
			

		}
		tempSocket.close();
	};

	tempSocket.onerror = function(e)
	{
		console.error('Temporary socket error:', e);
		createNewRoom(joinRoomCallback);
		tempSocket.close();
	};

	tempSocket.onclose = function(e)
	{
		console.log('Temporary socket closed');
	};
}

function createNewRoom(joinRoomCallback)
{
	// console.log("createnewroom2");
	const roomName = `room_${Math.floor(Math.random() * 10000)}`;
	joinRoomCallback(roomName);
	return (roomName);
}



export function joinRoom(roomName, setGameSocket, setIsFirstPlayer)
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
			setGameSocket(gameSocket);
			history.pushState({ view: 'game', room: roomName }, '', `?view=game&room=${roomName}`);
			initializeBall();
			let idx = gameVar.rooms.length + 1;
			addRoom(idx, roomName, 'waiting');
			if (gameVar.playerIdx == 1)
				sendRoomData(gameSocket, idx, roomName, 1, 'waiting');
			else if (gameVar.playerIdx == 2)
				sendRoomData(gameSocket, idx, roomName, 2, 'started');
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
			console.log("message recu : ", data);
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
				gameVar.playerReady = data.player_data.playerReady;
				gameVar.currentServer = data.player_data.currentServer;
			}
			else if (data.type == 'game_data')
			{
				gameVar.gameStart = data.player_data.gameStart;
				gameVar.animationFrame = data.player_data.animationFrame;
			}
			else if (data.type == 'room_data')
			{
				updateRoomInfo(data.room_data.idx, data.room_data.name, data.room_data.nbPlayer, data.room_data.status);
			}
			else if (data.type == 'room_joined')
			{
				console.log(`Joined room: ${data.room_name}`);
			} 
			else if (data.type == 'client_joined')
			{
				console.log(data.message);
			} 
			else if (data.type == 'client_left')
			{
				gameVar.playerReady = false;
				sendPlayerData(gameVar.gameSocket, gameVar.playerReady, gameVar.currentServer);
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
		gameVar.playerReady = false;
		// sendPlayerData(gameVar.gameSocket, gameVar.playerReady, gameVar.currenServer);
		console.error('Game socket closed unexpectedly code : ', e.code, 'reason', e.reason);
	};
}


export function displayRoomInfo()
{
	console.log("rooms : ", gameVar.rooms);
}

export function addRoom(idx, status = null)
{
	const newRoom = { idx, players: 1, status };
	gameVar.rooms.push(newRoom);
}

export function updateRoomInfo(idx, name = null, players = null, status = null)
{
	const room = gameVar.rooms.find(room => room.idx === idx)
	if (room)
	{
		if (name !== null)
			room.name = name;
		if (players !== null)
			room.players = players;
		if (status !== null)
			room.status = status;
		return (room);
	}
	return (null);
}

export function getRoom(idx)
{
	return (gameVar.rooms.find(room => room.idx === idx) || null);
}

export function updateRoomList()
{
	if (gameVar.rooms.length === 1)
	{
		gameVar.noRoomsMessage.style.display = 'block';
		gameVar.roomsContainer.style.display = 'none';
	}
	else
	{
		gameVar.noRoomsMessage.style.display = 'none';
		gameVar.roomsContainer.style.display = 'block';

		gameVar.roomsContainer.innerHTML = '';

		gameVar.rooms.forEach(room =>
		{
			const roomItem = document.createElement('div');
            roomItem.className = 'server-item';

            roomItem.innerHTML = `
                <span class="room-name">${room.name}</span>
                <span class="room-players">${room.players}/2</span>
                <span class="room-status">${room.status}</span>
                <button class="joinRoomBtn" ${room.status === 'Started' ? 'disabled' : ''}>Join</button>
            `;

            const joinBtn = roomItem.querySelector('.joinRoomBtn');
            joinBtn.addEventListener('click', () => joinRoom(room.name)); // Utiliser room.name ici	

			gameVar.roomsContainer.appendChild(roomItem);
		})

	}
}

export function refreshRoomList()
{
    const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
    const tempSocket = new WebSocket(protocol + '//' + window.location.host + '/ws/pong/check_rooms/');

    tempSocket.onopen = () => {
        console.log('Temporary socket opened for refreshing rooms');
        tempSocket.send(JSON.stringify({ type: 'check_rooms' }));
    };

    tempSocket.onmessage = (e) => {
        const data = JSON.parse(e.data);
        if (data.type === 'available_rooms') {
            updateRoomListFromServer(data.rooms);
        } else {
            console.error('Unexpected message type:', data.type);
        }
        tempSocket.close();
    };

    tempSocket.onerror = (e) => {
        console.error('Temporary socket error while refreshing:', e);
        tempSocket.close();
    };

    tempSocket.onclose = () => {
        console.log('Temporary socket closed after refreshing');
    };
}


function updateRoomListFromServer(rooms) {
    // Réinitialise la liste des salles locales
    gameVar.rooms = rooms.map((room, idx) => ({
        idx: idx + 1,
        name: room.name,
        players: room.nbPlayer,
        status: room.status,
    }));

    // Rafraîchit l'affichage des salles
    updateRoomList();
}
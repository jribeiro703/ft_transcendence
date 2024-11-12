import gameVar from './var.js';
import isFirstPlayer from './var.js';
import { sendBallData, sendPaddleData, sendPlayerData } from './network.js';
import { draw2, initializeBall } from './draw.js';


export function checkForExistingRooms(joinRoomCallback) {
	const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
	const tempSocket = new WebSocket(protocol + '//' + window.location.host + '/ws/pong/check_rooms/');

	tempSocket.onopen = function(e) {
		console.log('Temporary socket opened');
		tempSocket.send(JSON.stringify({ type: 'check_rooms' }));
	};

	tempSocket.onmessage = function(e) {
		const data = JSON.parse(e.data);
		if (data.type === 'available_rooms' && data.rooms.length > 0)
		{
			const roomName = data.rooms[0];
			joinRoomCallback(roomName);
			gameVar.playerIdx = 2;
			// gameVar.playerReady = true;
			const player = gameVar.players.find(player => player.idx === gameVar.playerIdx)
			if (player)
				player.ready = true;
			console.log("started 2");
			updateRoomInfo(roomName, "2/2", "started");
		}
		else
		{
			const newRoom = createNewRoom(joinRoomCallback);
			gameVar.playerIdx = 1;
			// gameVar.playerReady = true;
			// gameVar.isFirstPlayer = true;
			const player = gameVar.players.find(player => player.idx === gameVar.playerIdx);
			if (player)
				player.ready = true;
			console.log("waiting 1");
			updateRoomInfo(newRoom, "1/2", "waiting");
		}
		tempSocket.close();
	};

	tempSocket.onerror = function(e) {
		console.error('Temporary socket error:', e);
		createNewRoom(joinRoomCallback);
		tempSocket.close();
	};

	tempSocket.onclose = function(e) {
		console.log('Temporary socket closed');
	};
}

function createNewRoom(joinRoomCallback)
{
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
		gameSocket.send(JSON.stringify({ type: 'join_room' }));
		setGameSocket(gameSocket);
		history.pushState({ view: 'game', room: roomName }, '', `?view=game&room=${roomName}`);
		initializeBall();
		draw2();

	};

	gameSocket.onmessage = function(e)
	{
		const data = JSON.parse(e.data);
		// console.log("message recu : ", data);
		if (data.type == 'ball_data')
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
			sendPlayerData(gameVar.gameSocket, gameVar.playerReady, gameVar.currenServer);
		}
	};

	gameSocket.onerror = function(e)
	{

		console.error('Game socket error:', e);
	};

	gameSocket.onclose = function(e)
	{
		gameVar.playerReady = false;
		sendPlayerData(gameVar.gameSocket, gameVar.playerReady, gameVar.currenServer);
		console.error('Game socket closed unexpectedly');
	};
}


export function updateRoomInfo(players, status)
{
	let name = gameVar.createRoomName.placeHolder;
	console.log(name);
    gameVar.room1name.textContent = name;
    gameVar.room1players.textContent = players;
    gameVar.room1status.textContent = status;
}
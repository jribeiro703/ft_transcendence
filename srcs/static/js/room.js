import gameVar from './var.js';
import isFirstPlayer from './var.js';
import { sendBallData, sendPaddleData } from './network.js';
import { draw2 } from './draw.js';

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
			console.log("joinnn room : ", roomName);
			gameVar.player2Ready = true;
			gameVar.playerIdx = 2;
		}
		else
		{
			console.log("creationnnnn room");
			createNewRoom(joinRoomCallback);
			gameVar.playerReady = true;
			gameVar.playerIdx = 1;

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
	console.log("create new room");
	const roomName = `room_${Math.floor(Math.random() * 10000)}`;
	joinRoomCallback(roomName);
	// if (!gameVar.rooms[roomName])
	// 	gameVar.rooms[roomName] = new Set();
	// gameVar.rooms[roomName].add(gameVar.playerIdx);
	// console.log(`Utilisateur ${gameVar.playerIdx} a rejoint la salle ${roomName}`);

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
		draw2();
	};

	gameSocket.onmessage = function(e)
	{
		const data = JSON.parse(e.data);
		console.log("messsage recu: ", data);
		if (data.type == 'ball_data')
		{
			// console.log("reception des infos");
			gameVar.x = data.ball_data.x;
			// console.log("data.x :", data.ball_data.x);
			gameVar.y = data.ball_data.y;
			gameVar.dx = data.ball_data.dx;
			gameVar.dy = data.ball_data.dy;
		} 
		else if (data.type == 'paddle_data') 
		{
			if (data.paddle_data.player == 1)
			{
				gameVar.playerPaddleY = data.paddle_data.paddle_y;
			}
			else if(data.paddle_data.player == 2)
			{
				gameVar.player2PaddleY = data.paddle_data.paddle_y;
			}
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
			console.log(data.message);
			
		}
	};

	gameSocket.onerror = function(e) {
		console.error('Game socket error:', e);
	};

	gameSocket.onclose = function(e) {
		console.error('Game socket closed unexpectedly');
	};
}
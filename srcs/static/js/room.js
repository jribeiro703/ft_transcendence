import gameVar from './var.js';
import isFirstPlayer from './var.js';

export function checkForExistingRooms(joinRoomCallback) {
	const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
	const tempSocket = new WebSocket(protocol + '//' + window.location.host + '/ws/pong/check_rooms/');

	tempSocket.onopen = function(e) {
		console.log('Temporary socket opened');
		tempSocket.send(JSON.stringify({ type: 'check_rooms' }));
	};

	tempSocket.onmessage = function(e) {
		const data = JSON.parse(e.data);
		if (data.type === 'available_rooms' && data.rooms.length > 0) {
			const roomName = data.rooms[0];
			joinRoomCallback(roomName);
		} else {
			createNewRoom(joinRoomCallback);
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

function createNewRoom(joinRoomCallback) {
	const roomName = `room_${Math.floor(Math.random() * 10000)}`;
	joinRoomCallback(roomName);
}

export function joinRoom(roomName, setGameSocket, setIsFirstPlayer) {
	const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
	const gameSocket = new WebSocket(protocol + '//' + window.location.host + `/ws/pong/${roomName}/`);

	gameSocket.onopen = function(e) {
		console.log('Game socket opened');
		gameSocket.send(JSON.stringify({ type: 'join_room' }));
		setGameSocket(gameSocket);
		history.pushState({ view: 'game', room: roomName }, '', `?view=game&room=${roomName}`);
	};

	gameSocket.onmessage = function(e) {
		const data = JSON.parse(e.data);
		if (data.type == 'ball_data') {
			gameVar.x = data.ball_data.x;
			gameVar.y = data.ball_data.y;
		} else if (data.type == 'paddle_data') {
			if (data.paddle_data.paddle_x !== undefined) {
				if (isFirstPlayer) {
					gameVar.aiPaddleX = data.paddle_data.paddle_x;
				} else {
					gameVar.playerPaddleX = data.paddle_data.paddle_x;
				}
			}
		} else if (data.type == 'room_joined') {
			console.log(`Joined room: ${data.room_name}`);
			if (data.room_name.endsWith('_1')) {
				setIsFirstPlayer(true);
			}
		} else if (data.type == 'client_joined') {
			console.log(data.message);
		} else if (data.type == 'client_left') {
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
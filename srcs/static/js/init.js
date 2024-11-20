import gameVar from "./var.js";
import { showGameView, showGameplaySoloView, showGameplayMultiView, showDefaultView, rematchView } from "./gameView.js";
import { keyDownHandler, keyUpHandler, startBall, startBallAi } from "./input.js";
import { createPowerUp, updatePowerUpSelection } from "./powerUp.js";
import { updateLevelSelection, updateMapSelection } from "./gameMode.js";
import { initializeBall, draw2, draw} from "./draw.js";
import { addRoom, checkForExistingRooms, createNewRoom, displayRoomInfo, joinRoom, refreshRoomList, updateRoomInfo, updateRoomList } from "./room.js";

export function initGameVar()
{
	gameVar.defaultView = document.getElementById('defaultView');
	gameVar.gameplayView = document.getElementById('gameplayView');
	gameVar.gameView = document.getElementById('gameView');
	gameVar.startGameBtn = document.getElementById('startGameBtn');
	gameVar.quickGameBtn = document.getElementById('quickGameBtn');
	gameVar.playsoloGameBtn = document.getElementById('playsoloGameBtn');
	gameVar.playmultiGameBtn = document.getElementById('playmultiGameBtn');
	gameVar.tournamentGameBtn = document.getElementById('tournamentGameBtn');
	gameVar.createRoomBtn = document.getElementById('createRoomBtn');
	gameVar.rematchBtn = document.getElementById('rematchBtn');	
	gameVar.quitGameBtn = document.getElementById('quitGameBtn');
	gameVar.roomView = document.getElementById('roomView');
	gameVar.createRoomNameInput = document.getElementById('createRoomName')
	gameVar.roomsContainer = document.getElementById('roomsContainer');
	gameVar.noRoomsMessage = document.getElementById('noRoomsMessage');
	gameVar.refreshBtn = document.getElementById('refreshBtn');

	gameVar.withPowerUp = document.getElementById('withPowerUps');
	gameVar.withoutPowerUp = document.getElementById('withoutPowerUps');
	gameVar.easy = document.getElementById('easy');
	gameVar.medium = document.getElementById('medium');
	gameVar.hard = document.getElementById('hard');
	gameVar.tableTennis = document.getElementById('tableTennis');
	gameVar.brickLevel = document.getElementById('bricksLevel');
	gameVar.playerScoreElement = document.getElementById('playerScore');
	gameVar.aiScoreElement = document.getElementById('aiScore');

	gameVar.room1name = document.getElementById('room1-name');
	gameVar.room1players = document.getElementById('room1-players');
	gameVar.room1status = document.getElementById('room1-status');
	gameVar.joinRoom1Btn = document.getElementById('joinRoom1Btn');

	gameVar.room2name = document.getElementById('room2-name');
	gameVar.room2players = document.getElementById('room2-players');
	gameVar.room2status = document.getElementById('room2-status');
	gameVar.joinRoom2Btn = document.getElementById('joinRoom2Btn');

	gameVar.room3name = document.getElementById('room3-name');
	gameVar.room3players = document.getElementById('room3-players');
	gameVar.room3status = document.getElementById('room3-status');
	gameVar.joinRoom3Btn = document.getElementById('joinRoom3Btn');

	gameVar.room4name = document.getElementById('room4-name');
	gameVar.room4players = document.getElementById('room4-players');
	gameVar.room4status = document.getElementById('room4-status');
	gameVar.joinRoom4Btn = document.getElementById('joinRoom4Btn');

	gameVar.room5name = document.getElementById('room5-name');
	gameVar.room5players = document.getElementById('room5-players');
	gameVar.room5status = document.getElementById('room5-status');
	gameVar.joinRoom5Btn = document.getElementById('joinRoom5Btn');

	gameVar.createRoomName = document.getElementById('createRoomName');

}

export function initEventListener()
{

	gameVar.quitGameBtn.addEventListener('click', showDefaultView);
	gameVar.playsoloGameBtn.addEventListener('click', showGameplaySoloView);
	gameVar.playmultiGameBtn.addEventListener('click', roomMultiView);

	gameVar.withoutPowerUp.classList.add('selected');
	gameVar.medium.classList.add('selected');
	gameVar.tableTennis.classList.add('selected');

	gameVar.withPowerUp.addEventListener('click', () =>
	{
		gameVar.withPowerUp.classList.add('selected');
		gameVar.withoutPowerUp.classList.remove('selected');
		updatePowerUpSelection(true);
	});

	gameVar.withoutPowerUp.addEventListener('click', () => 
	{
		gameVar.withoutPowerUp.classList.add('selected');
		gameVar.withPowerUp.classList.remove('selected');
		updatePowerUpSelection(false); 
	});

	gameVar.easy.addEventListener('click', () => 
	{
		gameVar.easy.classList.add('selected');
		gameVar.medium.classList.remove('selected');
		gameVar.hard.classList.remove('selected');
		updateLevelSelection('easy');
	});
	
	gameVar.medium.addEventListener('click', () => 
	{
		gameVar.easy.classList.remove('selected');
		gameVar.medium.classList.add('selected');
		gameVar.hard.classList.remove('selected');
		updateLevelSelection('medium');
	});

	gameVar.hard.addEventListener('click', () => 
	{
		gameVar.easy.classList.remove('selected');
		gameVar.medium.classList.remove('selected');
		gameVar.hard.classList.add('selected');
		updateLevelSelection('hard');
	});

	gameVar.tableTennis.addEventListener('click', () =>
	{
		gameVar.tableTennis.classList.add('selected');
		gameVar.brickLevel.classList.remove('selected');
		updateMapSelection('tableTennis');
	});

	gameVar.brickLevel.addEventListener('click', () =>
	{
		gameVar.tableTennis.classList.remove('selected');
		gameVar.brickLevel.classList.add('selected');
		updateMapSelection('brickLevel');
	})
}


export function checkRoom()
{

}

export function initEventListenerRoom()
{
	document.addEventListener("keydown", (e) => keyDownHandler(e, gameVar.isFirstPlayer), false);
	document.addEventListener("keyup", (e) => keyUpHandler(e, gameVar.isFirstPlayer), false);
	document.addEventListener("keydown", startBall, false);

	gameVar.refreshBtn.addEventListener('click', () =>
	{
		checkRoom();
		// displayRoomInfo();
		// refreshRoomList();
		updateRoomList();

	});

	gameVar.createRoomBtn.addEventListener('click', () => 
	{
		console.log("createRoombtn");
		showGameViewRoom();
		// history.pushState({ view: 'game' }, '', '?view=game');
	});

	// window.addEventListener('popstate', function(event)
	// {
	// 	if (event.state && event.state.view == 'game')
	// 	{
	// 		const urlParams = new URLSearchParams(window.location.search);
	// 		const room = urlParams.get('room');
	// 		if (room)
	// 		{
	// 			console.log("event popstate");
	// 			showGameViewRoom(room);
	// 			console.log("room");
	// 		}
	// 		else
	// 			console.log("no room");
	// 	}
	// 	else
	// 		showLobbyView();
	// });
}

function delRoom(name)
{
	console.log("name of room ", name);
	displayRoomInfo();
	gameVar.rooms = gameVar.rooms.filter(room => room.name !== name);
	console.log("Rooms after deletion: ", gameVar.rooms);
	updateRoomList();
	displayRoomInfo();
}

function roomMultiView()
{
	const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
	const tempSocket = new WebSocket(protocol + '//' + window.location.host + '/ws/pong/check_rooms/');

	tempSocket.onopen = function(e)
	{
		console.log('Temporary socket opened');
		console.log("on send lobbyView :");
		tempSocket.send(JSON.stringify({type: 'lobbyView'}));

		// console.log("on send roomdeleted :");
		// tempSocket.send(JSON.stringify({type: 'room_deleted'}));
	};

	tempSocket.onmessage = function(e)
	{
		const data = JSON.parse(e.data);
		console.log(data);
		if (data.type === 'looks_rooms')
		{
			console.log("look rooooooms");
			console.log("room : ", data.rooms)
			if (data.rooms)
			{
				let idx = 1;
				data.rooms.forEach(roomName => {
					addRoom(idx, 'Waiting');
					updateRoomInfo(idx, roomName, 1, "waitingg");
					idx++;
				});
			}
		}
		if (data.type === 'room_deleted')
		{
			console.log("on message deleted");
			console.log(data);
			// delRoom(data.room_name);
		}
		if (data.type === 'ping')
		{
			tempSocket.send(JSON.stringify({ type: 'pong' }));
		}
	}

	tempSocket.onerror = function(event)
	{
    	console.error("WebSocket error observed:", event);
	};

	tempSocket.onclose = function(event)
	{
    	console.log("WebSocket closeddddd:", event);
	};


	

	console.log("roomView");
	gameVar.gameplayView.style.display = 'none';
	gameVar.gameView.style.display = 'none';
	gameVar.quickGameBtn.style.display = 'none';
	gameVar.startGameBtn.style.display = 'none';
	gameVar.playsoloGameBtn.style.display = 'none';
	gameVar.tournamentGameBtn.style.display = 'none';
	gameVar.playmultiGameBtn.style.display = 'none';

	gameVar.defaultView.style.display = 'none';
	gameVar.roomView.style.display = 'block';
	gameVar.createRoomBtn.style.display = 'block';
	gameVar.refreshBtn.style.display = 'block';
	gameVar.gameplayView.style.display = 'none';
	initEventListenerRoom();
	history.pushState({ view: 'game' }, '', '?view=multi');
	gameVar.liveMatch = true;
}

function showGameViewRoom(room = null)
{
	console.log("showGameviewRoom");
	gameVar.defaultView.style.display = 'none';
	gameVar.gameplayView.style.display = 'none';
	gameVar.gameView.style.display = 'block';
	gameVar.quickGameBtn.style.display = 'none';
	gameVar.startGameBtn.style.display = 'none';
	gameVar.tournamentGameBtn.style.display = 'none';
	gameVar.createRoomBtn.style.display = 'none';
	gameVar.roomView.style.display = 'none';
	
	// gameVar.liveMatch = true;
	// if (gameVar.powerUpActive)
	// 	createPowerUp();		
	// if (room)
	// {
	// 	console.log("joi rooom");
	// 	joinRoom(room, setGameSocket, setIsFirstPlayer);
	// }
	// else
	// {
		console.log("existingggggg rooom");
		// checkForExistingRooms((room) => joinRoom(room, setGameSocket, setIsFirstPlayer));
		createNewRoom();
	// }
}

function showLobbyView()
{
	gameVar.defaultView.style.display = 'block';
	gameVar.gameView.style.display = 'none';
	if (gameVar.gameSocket)
	{
		gameVar.gameSocket.close();
	}
	cancelAnimationFrame(gameVar.animationFrame);
}

function setGameSocket(socket)
{
	gameVar.gameSocket = socket;
}

function setIsFirstPlayer(value)
{
	gameVar.isFirstPlayer = value;
}






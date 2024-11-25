import gameVar from "./var.js";
import { showGameView, showGameplaySoloView, showGameplayMultiView, showDefaultView, rematchView } from "./gameView.js";
import { keyDownHandler, keyUpHandler, startBall, startBallAi } from "./input.js";
import { addRoom, delRooms, createNewRoom, displayRoomInfo, joinRoom, updateRoomInfo, updateRoomList } from "./room.js";
import { showSettingView } from "./setting.js";

export function initGameVar()
{
	// gameVar.defaultView = document.getElementById('defaultView');
	gameVar.settingView = document.getElementById('settingView');
	gameVar.gameView = document.getElementById('gameView');
	gameVar.startGameBtn = document.getElementById('startGameBtn');
	gameVar.quickGameBtn = document.getElementById('quickGameBtn');
	gameVar.playsoloGameBtn = document.getElementById('playsoloGameBtn');
	gameVar.playmultiGameBtn = document.getElementById('playmultiGameBtn');
	gameVar.tournamentGameBtn = document.getElementById('tournamentGameBtn');
	gameVar.createRoomBtn = document.getElementById('createRoomBtn');
	// gameVar.rematchBtn = document.getElementById('rematchBtn');	
	// gameVar.quitGameBtn = document.getElementById('quitGameBtn');
	gameVar.roomView = document.getElementById('roomView');
	gameVar.createRoomNameInput = document.getElementById('createRoomName')
	gameVar.roomsContainer = document.getElementById('roomsContainer');
	gameVar.noRoomsMessage = document.getElementById('noRoomsMessage');
	gameVar.refreshBtn = document.getElementById('refreshBtn');
	gameVar.settingBtn = document.getElementById('settingBtn');
	gameVar.createRoomName = document.getElementById('createRoomName');

}


function removeEventListeners()
{
    document.removeEventListener("keydown", keyDownHandler);
    document.removeEventListener("keyup", keyUpHandler);
    document.removeEventListener("keydown", startBall);
}

export function initEventListener()
{

	removeEventListeners();

	gameVar.playsoloGameBtn.addEventListener('click', showGameplaySoloView);
	gameVar.playmultiGameBtn.addEventListener('click', roomMultiView);

	document.addEventListener("keydown", (e) => {
        if (e.code === "Space")
		{
            startBallAi(e);
        }
    });

    document.addEventListener("keydown", (e) => {
        if (e.code === "ArrowUp" || e.code === "ArrowDown")
		{
            keyDownHandler(e);
        }
    });

    document.addEventListener("keyup", (e) => {
        if (e.code === "ArrowUp" || e.code === "ArrowDown")
		{
            keyUpHandler(e);
        }
    });

}


export function initEventListenerRoom()
{
	document.addEventListener("keydown", (e) => keyDownHandler(e, gameVar.isFirstPlayer), false);
	document.addEventListener("keyup", (e) => keyUpHandler(e, gameVar.isFirstPlayer), false);
	document.addEventListener("keydown", startBall, false);

	gameVar.createRoomBtn.addEventListener('click', () => 
	{
		console.log("createRoombtn");
		showGameViewRoom();
	});
	gameVar.settingBtn.addEventListener('click', () =>
	{
		console.log("setting");
		showSettingView(true);
	});
}

function checkRoom(rooms)
{
	console.log("checkRoom");
    if (rooms && Array.isArray(rooms)) 
	{
        gameVar.rooms = gameVar.rooms.filter(room => rooms.includes(room.name));
        updateRoomList();
    }
}

export function roomMultiView()
{
	const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
	const tempSocket = new WebSocket(protocol + '//' + window.location.host + '/ws/pong/check_rooms/');

	gameVar.refreshBtn.addEventListener('click', () =>
	{
		tempSocket.send(JSON.stringify({ type: 'lobbyView'}));
		updateRoomList();

	});

	tempSocket.onopen = function(e)
	{
		console.log('Temporary socket opened');
		console.log("on send lobbyView :");
		tempSocket.send(JSON.stringify({type: 'lobbyView'}));
	};

	tempSocket.onmessage = function(e)
	{
		const data = JSON.parse(e.data);
		console.log("data: ", data);
		if (data.type === 'looks_rooms')
		{
			if (data.rooms)
			{
				let idx = gameVar.rooms.length;
				data.rooms.forEach(roomName => 
				{
					checkRoom(data.rooms);	
					const roomExists = gameVar.rooms.some(room => room.name === roomName);
					if (!roomExists)
					{
						addRoom(idx, roomName, 'Wait');
						updateRoomInfo(idx, roomName, 1, "waiting");
						idx++;
					}
    			});
				updateRoomList();	
			}
		}
		if (data.type == 'norooms')
		{
			delRooms();
			updateRoomList();
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
	gameVar.settingView.style.display = 'none';
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
	gameVar.settingBtn.style.display = 'block';
	initEventListenerRoom();
	history.pushState({ view: 'game' }, '', '?view=multi');
	gameVar.liveMatch = true;
}

function showGameViewRoom(room = null)
{
	gameVar.defaultView.style.display = 'none';
	gameVar.settingView.style.display = 'none';
	gameVar.gameView.style.display = 'block';
	gameVar.quickGameBtn.style.display = 'none';
	gameVar.startGameBtn.style.display = 'none';
	gameVar.tournamentGameBtn.style.display = 'none';
	gameVar.createRoomBtn.style.display = 'none';
	gameVar.roomView.style.display = 'none';
	
	createNewRoom();
}






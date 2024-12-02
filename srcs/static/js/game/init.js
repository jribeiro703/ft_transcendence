import gameVar from "./var.js";
import { showGameSelectionView } from "./gameView.js";
import { keyDownHandler, keyUpHandler, startBallLive, startBall } from "./input.js";
import { addRoom, delRooms, createNewRoom, updateRoomInfo, updateRoomList } from "./room.js";
import { showSettingView } from "./setting.js";
import { checkSettingLive } from "./setting.js";
import { SCORE_CANVAS_HEIGHT } from "./const.js";
import { showGameSelectionMultiView } from "./gameView.js";
import { renderPage } from "../historyManager.js";

export function initGameVar()
{
	gameVar.playsoloGameBtn = document.getElementById('playsoloGameBtn');
	gameVar.playmultiGameBtn = document.getElementById('playmultiGameBtn');
}

function removeEventListeners()
{
    document.removeEventListener("keydown", keyDownHandler);
    document.removeEventListener("keyup", keyUpHandler);
    document.removeEventListener("keydown", startBallLive);
    document.removeEventListener("keydown", startBall);
}

export function initEventListener()
{
	removeEventListeners();
	gameVar.playsoloGameBtn.addEventListener('click', showGameSelectionView);
	gameVar.playmultiGameBtn.addEventListener('click', roomMultiView);
	// gameVar.playmultiGameBtn.addEventListener('click', showGameSelectionMultiView);
}

export function initControlLive()
{
	document.addEventListener("keydown", (e) => {
        if (e.code === "Space")
		{
            startBallLive(e);
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
export function initControl(local)
{
	document.addEventListener("keydown", (e) => {
		if (e.code === "Space")
		{
			startBall(e);
		}
	});

	document.addEventListener("keydown", (e) => {
		if (e.code === "ArrowUp" || e.code === "ArrowDown" || e.code === "KeyW" || e.code === "KeyS")
		{
			keyDownHandler(e);
		}
	});

	document.addEventListener("keyup", (e) => {
		if (e.code === "ArrowUp" || e.code === "ArrowDown" || e.code === "KeyW" || e.code === "KeyS")
		{
			keyUpHandler(e);
		}
	});
}


export function initEventListenerRoom()
{
	removeEventListeners();
	document.addEventListener("keydown", (e) => keyDownHandler(e, gameVar.isFirstPlayer), false);
	document.addEventListener("keyup", (e) => keyUpHandler(e, gameVar.isFirstPlayer), false);
	document.addEventListener("keydown", startBall, false);

	gameVar.createRoomBtn.addEventListener('click', () => 
	{
		console.log("createRoombtn");
		createRoomView();
	});
	gameVar.settingBtn.addEventListener('click', () =>
	{
		console.log("setting");
		// renderPage("pongSettingSolo", true, true);
		showSettingView(true);
	});
}

export function displayRoomView()
{
	const mainContent = document.getElementById("mainContent");

	mainContent.innerHTML = '';

	const roomView = document.createElement('div');

	roomView.innerHTML = `
	<div id="roomView" style="display: none;">
			<div class="container-room">
				<div class="server-list">
					<h2>Room List</h2>
					<div id="noRoomsMessage" style="display: block;">
						<p>No room available for now. Create one !</p>
					</div>
					<div id="roomsContainer"></div>
					<div class="refresh"></div>
					<button id="refreshBtn" class="refresh-button">Refresh</button>
				</div>
				<div class="host-server">
					<h2>Host A Room</h2>
					<h3>Playing as: <strong>Login</strong></h3>
					<div class="settings">
						<button id="settingBtn">Settings</button>
						<div id="setting-container">
							Difficulty: <span id="difficultyChoice">Medium</span><br>
							Level: <span id="levelSelected">Table Tennis</span>
						</div>
					</div>
					<button id="createRoomBtn" class="start-button">Create Room</button>
				</div>
			</div>
		</div>
	</div>
	`;

	mainContent.appendChild(roomView);

	gameVar.createRoomBtn = document.getElementById('createRoomBtn');
	gameVar.roomView = document.getElementById('roomView');
	gameVar.roomsContainer = document.getElementById('roomsContainer');
	gameVar.noRoomsMessage = document.getElementById('noRoomsMessage');
	gameVar.refreshBtn = document.getElementById('refreshBtn');
	gameVar.settingBtn = document.getElementById('settingBtn');
	gameVar.createRoomName = document.getElementById('createRoomName');

	console.log("roomView");
	gameVar.roomView.style.display = 'block';
	gameVar.refreshBtn.style.display = 'block';
	gameVar.settingBtn.style.display = 'block';

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
	initControlLive();
	history.pushState({ view: 'game' }, '', '?view=multi');
	displayRoomView();
	initEventListenerRoom();
	roomNetwork();
	gameVar.liveMatch = true;
}

function createRoomView(room = null)
{
	checkSettingLive();

	const mainContent = document.getElementById('mainContent');

	mainContent.innerHTML = '';

	const insertTo = document.createElement('div');

	insertTo.innerHTML = `
	<div id="gameView" style="display: none;">
			<div id="scoreboard">
				<canvas id="scoreCanvas"></canvas>
			</div>
			<canvas id="myCanvas"></canvas>
			<br><br>
			<div class="button-container">
				<button id="rematchBtn" style="display: none;" disabled>Rematch</button>
				<button id="quitGameBtn" style="display: none;">Quit Game</button>
			</div>
		</div>	
	`;

	mainContent.appendChild(insertTo);

	gameVar.gameView = document.getElementById('gameView');
	gameVar.rematchBtn = document.getElementById('rematchBtn');	
	gameVar.quitGameBtn = document.getElementById('quitGameBtn');
	gameVar.gameView.style.display = 'block';
	
	var canvas = document.getElementById('myCanvas');
	gameVar.ctx = canvas.getContext('2d');
	canvas.width = gameVar.canvasW;
	canvas.height = gameVar.canvasH;	

	var scoreCanvas = document.getElementById('scoreCanvas');
	gameVar.scoreCtx = scoreCanvas.getContext('2d');
	scoreCanvas.width = gameVar.scoreCanvW;
	scoreCanvas.height = SCORE_CANVAS_HEIGHT;

	gameVar.gameTime = 0;
    gameVar.gameTimer = setInterval(() =>
	{
        if (gameVar.startTime)
		{
            gameVar.gameTime++;
        }
    }, 1000);

    scoreCanvas.style.marginBottom = '10px';

	createNewRoom();
}

export function roomNetwork()
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
}


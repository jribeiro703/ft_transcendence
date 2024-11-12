import gameVar from "./var.js";
import { showGameView, showGameplaySoloView, showGameplayMultiView, showDefaultView, rematchView } from "./gameView.js";
import { keyDownHandler, keyUpHandler, startBall, startBallAi } from "./input.js";
import { createPowerUp, updatePowerUpSelection } from "./powerUp.js";
import { updateLevelSelection, updateMapSelection } from "./gameMode.js";
import { initializeBall, draw2, draw} from "./draw.js";
import { checkForExistingRooms, joinRoom } from "./room.js";

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

export function initEventListenerRoom()
{
	document.addEventListener("keydown", (e) => keyDownHandler(e, gameVar.isFirstPlayer), false);
	document.addEventListener("keyup", (e) => keyUpHandler(e, gameVar.isFirstPlayer), false);
	document.addEventListener("keydown", startBall, false);

	

	gameVar.createRoomBtn.addEventListener('click', () => 
	{
		showGameViewRoom();
		gameVar.liveMatch = true;
		history.pushState({ view: 'game' }, '', '?view=game');
	});

	window.addEventListener('popstate', function(event)
	{
		if (event.state && event.state.view == 'game')
		{
			const urlParams = new URLSearchParams(window.location.search);
			const room = urlParams.get('room');
			if (room)
			{
				showGameViewRoom(room);
				console.log("room");
			}
			else
				console.log("no room");
		}
		else
			showLobbyView();
	});
}

function roomMultiView()
{
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
	// gameVar.joinRoomBtn.style.display = 'block';
	gameVar.gameplayView.style.display = 'none';
	initEventListenerRoom();
}

function showGameViewRoom(room = null)
{
	gameVar.defaultView.style.display = 'none';
	gameVar.gameplayView.style.display = 'none';
	gameVar.gameView.style.display = 'block';
	gameVar.quickGameBtn.style.display = 'none';
	gameVar.startGameBtn.style.display = 'none';
	gameVar.tournamentGameBtn.style.display = 'none';
	gameVar.liveMatch = true;
	if (gameVar.powerUpActive)
		createPowerUp();		
	if (room)
	{
		console.log("joi rooom");
		joinRoom(room, setGameSocket, setIsFirstPlayer);
	}
	else
	{
		console.log("existing rooom");
		checkForExistingRooms((room) => joinRoom(room, setGameSocket, setIsFirstPlayer));
	}
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


export function initEventListenerAi()
{

	document.addEventListener("keydown", keyDownHandler, false);
	document.addEventListener("keyup", keyUpHandler, false);
	document.addEventListener("keydown", startBallAi, false);

	gameVar.quickGameBtn.addEventListener('click', showGameView);
	gameVar.rematchBtn.addEventListener('click', rematchView);
}



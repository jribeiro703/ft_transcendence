const gameVar = 
{

// ----------------------------Canvas-------------------------

	canvasW: 840,
	canvasH: 420,
	scoreCanvW: 420,
	scoreCanvH: 100,
	scoreCtx: null, 
	gameTime: 0,
	gameTimer: null,

// ---------------------------Paddle------------------------

	playerPaddleHeight: 75,
	playerPaddleWidth: 12,
	player2PaddleHeight: 75,
	player2PaddleWidth: 12,

	aiPaddleHeight: 75,
	aiPaddleWidth: 12,

	playerPaddleY: (420 - 75) / 2,
	player2PaddleY: (420 - 75) / 2,

	aiPaddleY: (420 - 75) / 2,

// ---------------------------------Control----------------------

	playerUpPressed: false,
	playerDownPressed: false,
	
	player2UpPressed: false,
	player2DownPressed: false,

// ---------------------------------Score------------------------

	playerScore: 0,
	player2Score: 0,
	aiScore: 0,
	serveCount: 0,

	playerScoreElement: null,
	player2ScoreElement: null,
	aiScoreElement: null,


// ----------------------------Settings-------------------------

	settingsChanged: false,
	powerUpSpeed: 3,

	powerUpX1: null,
	powerUpY1: null,

	powerUpX2: null,
	powerUpY2: null,

	powerUp1Active: false,
	powerUp2Active: false,

	powerUp1OnScreen: false,
	powerUp2OnScreen: false,

	powerUpEnable: false,
	powerUpDuration: 5000,

	withPowerUp: null,
	withoutPowerUp: null,

	powerUpSelection: null,
	speedPuActive: false,
	difficulty: null,
	easy: null,
	medium: null,
	hard: null,

	pongUrl: null,
	brickUrl: null,
	tableTennis: null,
	footLevel: null,
	tennisLevel: null,

// -------------------------------Player Data---------------------------

	playerIdx: null,
	currentServer: 'player',
	playerReady: false,

// ---------------------------------Game Data-------------------------

	gameReady: false,
	gameStart: false,
	matchOver: false,
	liveMatch: false,
	animationFrame: null,
	finishGame: false,
	localGame: false,
	tennisTable: false,
	football: false,
	tennis: false,

	mycanvas: null,
	canvasColor: null,

	game: null,
	startTime: false,


// --------------------------------------AI-----------------------------

	aiServe: false,
	matchAI: false,
	aiLevel: 8,
	targetY: 0,
	
	aiMoveInterval: null,

// --------------------------------Ball Data----------------------------

	ballRadius: 8, 
	x: null,
	y: null,
	dx: null,
	dy: null,
	ctx: null,
	init_dx: null,
	init_dy: null,
	
	previousBallState: {
		x: null,
		y: null,
		dx: null,
		dy: null,
		initDx: null,
		initDy: null,
	},


// ------------------------------View---------------------------

	defaultView: null,
	gameView: null,
	settingView: null,
	roomView: null,


// ------------------------------Button---------------------------

	gamerView: null,
	startGameBtn: null,
	quickGameBtn: null,
	playsoloGameBtn: null,
	playmultiGameBtn: null,
	
	btnPowerUp: null,
	settingBtn: null,
	settingBtn1: null,
	settingBtn2: null,
	playBtn: null,
	playBtn2: null,
	
	saveBtn: null,
	
	createRoomBtn: null,
	createRoomName: null,
	
	tournamentGameBtn: null,
	rematchBtn: null,
	quitGameBtn: null,


	players: [
		{ idx: 1, ready: false },
		{ idx: 2, ready: false }
	],


// ---------------------------------Room--------------------------

	createRoomNameInput: null,
	noRoomsMessage: null,
	roomsContainer: null,
	refreshBtn: null,
	leftRoom: false,
	newRoomName: null,
	
	rooms: [
		{ idx: null, name: null, players: 0, status: null},
	],
	isFirstPlayer: false,
	roomName: null,
	gameSocket: null,


// -------------------Power Ups------------------------

	powerUps: [
		{ type: 'speed', image: 'static/css/images/fast.png'},
		{ type: 'slow', image: 'static/css/images/slow.png'},
		{ type: 'sizeP', image: 'static/css/images/paddleSp.png'},
		{ type: 'sizeM', image: 'static/css/images/paddleSm.png'},
		{ type: 'invincible', image: 'static/css/images/shield.png'}
	],
	currentPowerUp1: null,
	currentPowerUp2: null,

// ------------------------------------Level---------------------

	level: [
		{ type: 'easy'},
		{ type: 'medium'},
		{ type: 'hard'}
	],
	currentLevel: null,

	// currentMap: 'classicMap',
	// maps: {
	// 	classicMap: [],
	// 	customMap1: [
	// 		{sta: 1, x: 840 / 2 - 15, y: 5, width: 20, height: 50 },
	// 		{sta: 1, x: 840 / 2 - 15, y: 65, width: 20, height: 50 },
	// 		{sta: 1, x: 840 / 2 - 15, y: 125, width: 20, height: 50 },
	// 		{sta: 1, x: 840 / 2 - 15, y: 185, width: 20, height: 50 },
	// 		{sta: 1, x: 840 / 2 - 15, y: 245, width: 20, height: 50 },
	// 		{sta: 1, x: 840 / 2 - 15, y: 305, width: 20, height: 50 },
	// 		{sta: 1, x: 840 / 2 - 15, y: 365, width: 20, height: 50 },
	// 		{sta: 1, x: 840 / 2 + 15, y: 5, width: 20, height: 50 },
	// 		{sta: 1, x: 840 / 2 + 15, y: 65, width: 20, height: 50 },
	// 		{sta: 1, x: 840 / 2 + 15, y: 125, width: 20, height: 50 },
	// 		{sta: 1, x: 840 / 2 + 15, y: 185, width: 20, height: 50 },
	// 		{sta: 1, x: 840 / 2 + 15, y: 245, width: 20, height: 50 },
	// 		{sta: 1, x: 840 / 2 + 15, y: 305, width: 20, height: 50 },
	// 		{sta: 1, x: 840 / 2 + 15, y: 365, width: 20, height: 50 },
	// 	],
	// },

	scoreBoard: [],
};

export default gameVar;
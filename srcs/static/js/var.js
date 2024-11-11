const gameVar = 
{
	canvasW: 840,
	canvasH: 420,

	playerPaddleHeight: 75,
	playerPaddleWidth: 12,
	player2PaddleHeight: 75,
	player2PaddleWidth: 12,

	aiPaddleHeight: 75,
	aiPaddleWidth: 12,

	playerPaddleY: (420 - 75) / 2,
	player2PaddleY: (420 - 75) / 2,

	aiPaddleY: (420 - 75) / 2,

	playerScore: 0,
	player2Score: 0,

	aiScore: 0,
	serveCount: 0,
	powerUpDuration: 5000,
	brickRowCount: 3,
	brickColumnCount: 5,
	brickWidth: 75,
	brickHeight: 20,
	brickPadding: 10,
	brickOffsetTop: 30,
	brickOffsetLeft: 30,
	aiLevel: 8,
	targetY: 0,
	playerIdx: null,


	currenServer: 'player',
	// playerReady: false,
	// player2Ready: false,
	gameReady: false,

	gameStart: false,
	matchOver: false,
	aiServe: false,

	powerUpActive: false,
	playerUpPressed: false,
	playerDownPressed: false,
	powerUpEnable: false,
	customMap: false,
	matchAI: false,

	liveMatch: false,

	previousBallState: {
		x: null,
		y: null,
		dx: null,
		dy: null
	},

	x: null,
	y: null,
	dx: null,
	dy: null,
	ctx: null,
	init_dx: null,
	init_dy: null,
	powerUpX: null,
	powerUpY: null,

	playerScoreElement: null,
	player2ScoreElement: null,
	aiScoreElement: null,

	aiMoveInterval: null,
	animationFrame: null,

	defaultView: null,
	gameView: null,
	gameplayView: null,
	startGameBtn: null,
	quickGameBtn: null,
	playsoloGameBtn: null,
	playmultiGameBtn: null,
	tournamentGameBtn: null,
	rematchBtn: null,
	quitGameBtn: null,

	
	withPowerUp: null,
	withoutPowerUp: null,
	easy: null,
	medium: null,
	hard: null,
	tableTennis: null,
	brickLevel: null,

	players: [
		{ idx: 1, ready: false },
		{ idx: 2, ready: false }
	],
	// -------------room------------------

	rooms: {},
	isFirstPlayer: false,
	roomName: null,
	gameSocket: null,

	powerUps: [
		{ type: 'speed', image: 'static/css/images/FastBall.png'},
		{ type: 'slow', image: 'static/css/images/SlowBall.png'},
		{ type: 'sizeP', image: 'static/css/images/paddleBigger.png'},
		{ type: 'sizeM', image: 'static/css/images/smallerPaddle.png'},
		{ type: 'invincible', image: 'static/css/images/star.png'}
	],
	currentPowerUp: null,

	level: [
		{ type: 'easy'},
		{ type: 'medium'},
		{ type: 'hard'}
	],
	currentLevel: null,

	currentMap: 'classicMap',
	maps: {
		classicMap: [],
		customMap1: [
			{sta: 1, x: 840 / 2 - 15, y: 5, width: 20, height: 50 },
			{sta: 1, x: 840 / 2 - 15, y: 65, width: 20, height: 50 },
			{sta: 1, x: 840 / 2 - 15, y: 125, width: 20, height: 50 },
			{sta: 1, x: 840 / 2 - 15, y: 185, width: 20, height: 50 },
			{sta: 1, x: 840 / 2 - 15, y: 245, width: 20, height: 50 },
			{sta: 1, x: 840 / 2 - 15, y: 305, width: 20, height: 50 },
			{sta: 1, x: 840 / 2 - 15, y: 365, width: 20, height: 50 },
			{sta: 1, x: 840 / 2 + 15, y: 5, width: 20, height: 50 },
			{sta: 1, x: 840 / 2 + 15, y: 65, width: 20, height: 50 },
			{sta: 1, x: 840 / 2 + 15, y: 125, width: 20, height: 50 },
			{sta: 1, x: 840 / 2 + 15, y: 185, width: 20, height: 50 },
			{sta: 1, x: 840 / 2 + 15, y: 245, width: 20, height: 50 },
			{sta: 1, x: 840 / 2 + 15, y: 305, width: 20, height: 50 },
			{sta: 1, x: 840 / 2 + 15, y: 365, width: 20, height: 50 },
		],
	},

	scoreBoard: [],
};

export default gameVar;
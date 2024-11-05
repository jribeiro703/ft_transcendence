const gameVar = 
{
	canvasW: 780,
	canvasH: 420,

	playerPaddleHeight: 75,
	playerPaddleWidth: 12,
	aiPaddleHeight: 75,
	aiPaddleWidth: 12,
	playerPaddleX: 0,
	aiPaddleX: (420 - 75) / 2,

	playerScore: 0,
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


	currenServer: 'player',
	lastTouch: 'player',

	gameStart: false,
	matchOver: false,
	aiServe: false,
	aiMoveInterval: null,
	powerUpActive: false,
	playerUpPressed: false,
	playerDownPressed: false,
	powerUpEnable: false,
	customMap: false,

	x: null,
	y: null,
	dx: null,
	dy: null,
	ctx: null,
	init_dx: null,
	init_dy: null,
	powerUpX: null,
	powerUpY: null,
	animationFrame: null,
	playerScoreElement: null,
	aiScoreElement: null,
	defaultView: null,
	gameView: null,
	gameplayView: null,
	startGameBtn: null,
	quickGameBtn: null,
	withPowerUp: null,
	withoutPowerUp: null,
	easy: null,
	medium: null,
	hard: null,
	tableTennis: null,
	brickLevel: null,



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
			{sta: 1, x: 780 / 2 - 15, y: 5, width: 20, height: 50 },
			{sta: 1, x: 780 / 2 - 15, y: 65, width: 20, height: 50 },
			{sta: 1, x: 780 / 2 - 15, y: 125, width: 20, height: 50 },
			{sta: 1, x: 780 / 2 - 15, y: 185, width: 20, height: 50 },
			{sta: 1, x: 780 / 2 - 15, y: 245, width: 20, height: 50 },
			{sta: 1, x: 780 / 2 - 15, y: 305, width: 20, height: 50 },
			{sta: 1, x: 780 / 2 - 15, y: 365, width: 20, height: 50 },
			{sta: 1, x: 780 / 2 + 15, y: 5, width: 20, height: 50 },
			{sta: 1, x: 780 / 2 + 15, y: 65, width: 20, height: 50 },
			{sta: 1, x: 780 / 2 + 15, y: 125, width: 20, height: 50 },
			{sta: 1, x: 780 / 2 + 15, y: 185, width: 20, height: 50 },
			{sta: 1, x: 780 / 2 + 15, y: 245, width: 20, height: 50 },
			{sta: 1, x: 780 / 2 + 15, y: 305, width: 20, height: 50 },
			{sta: 1, x: 780 / 2 + 15, y: 365, width: 20, height: 50 },
		],
	}
};

export default gameVar;
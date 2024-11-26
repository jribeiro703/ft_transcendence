const brickVar = {

// -------------------------------------Canvas-----------------

	canvas: null,
	canvasW: 760,
	canvasH: 420,
	ctx: null,

// -------------------------------------Ball-----------------

	ballRadius: 7,
	x: null,
	y: null,
	dx: null,
	dy: null,
	initDx : null,
	initDy: null,

// -------------------------------------Paddle-----------------

	paddleHeight: 10,
	paddleWidth: 75,
	paddleX: (780 - 75 )/2,
	paddleSpeed: 10,

// -------------------------------------Controls-----------------

	rightPressed: false,
	leftPressed: false,

// -------------------------------------Bricks-----------------

	brickRowCount: 16,
	brickColumnCount: 16,
	brickWidth: 40,
	brickHeight: 15,
	brickPadding: 5,
	brickOffsetTop: 30,
	brickOffsetLeft: 25,
	totalBrick: 0,
	finishLevel: false,
	gradient: null,

	brick: [],

	PATTERNS: {
    CLASSIC: 'classic',
    CASTLE: 'castle',
    X: 'x',
	INVADER: 'invader'
	},

// ------------------------------------Power up-----------------

	POWER_UP_SIZE: 30,
	POWER_UP_DURATION: 7000,
	BUFFER_COLLISION: 10,

	powerUpenable: false,
	powerUpX: null,
	powerUpY: null,
	powerUpActive: false,
	powerUpSpeed: 1,


	powerUps: 
	[
		{ type: 'speed', image: '/static/css/images/FastBall.png'},
		{ type: 'slow', image: '/static/css/images/SlowBall.png'},
		{ type: 'sizeP', image: '/static/css/images/paddleBigger.png'},
		{ type: 'sizeM', image: '/static/css/images/smallerPaddle.png'},
		{ type: 'invincible', image: '/static/css/images/star.png'},
		{ type: 'bbsp', image: '/static/css/images/bbsp.png'},
	],
	currentPowerUp: null,

	// ------------------------------------Game Data-----------------

	initialize: false,
	initGame: false,
	startBtn: null,
	score: 0,
	lives: 5,
	gameStart: false,
	anim: null,
	startBtn: null,
	currLevel: null,
	finish: false,
	finalScore: 0,

	difficulty: null,
	classic: false,
	castle: false,
	x: false,
	invader: false,
	settingChanged: false,

	// -------------------------------------Button---------------------------

	powerUpSelection: null,
	
	btnPowerUp: null,
	withPowerUp: null,
	withoutPowerUp: null,
	easy: null,
	medium: null,
	hard: null,
	classicLevel: null,
	castleLevel: null,
	xLevel: null,
	invaderLevel: null,
	saveBtn: null,

};

	export default brickVar;
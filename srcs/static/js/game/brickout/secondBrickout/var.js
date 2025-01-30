const brickVar2 = {

// -------------------------------------Canvas-----------------

	canvas: null,
	canvasW: 760,
	canvasH: 420,
	ctx: null,

	scoreCtx: null,
	scoreCanvW: 420,
	scoreCanvH: 100,

	gameTime: 0,
	gameTimer: null,
	startTime: false,


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

	brickRowCount: 15,
	brickColumnCount: 16,
	brickWidth: 40,
	brickHeight: 15,
	brickPadding: 8,
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

	powerUpEnable: false,
	powerUpOnscreen: false,
	powerUpX: null,
	powerUpY: null,
	powerUpActive: false,
	
	powerUpSpeed: 3,


	powerUps: 
	[
		{ type: 'speed', image: '/static/css/images/fast.png'},
		{ type: 'slow', image: '/static/css/images/slow.png'},
		{ type: 'sizeP', image: '/static/css/images/paddleSp.png'},
		{ type: 'sizeM', image: '/static/css/images/paddleSm.png'},
		{ type: 'invincible', image: '/static/css/images/shield.png'},
		{ type: 'ExtraLife', image: '/static/css/images/extraLife.png'},
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
	checkPu: false,
	checkDiff: false,
	checkLevel: false,

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

	export default brickVar2;
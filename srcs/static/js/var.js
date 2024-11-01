const gameVar = 
{
	canvasW: 780,
	canvasH: 420,

	playerScore: 0,
	aiScore: 0,
	gameStart: false,
	currenServer: 'player',
	serveCount: 0,
	matchOver: false,
	aiServe: false,
	aiMoveInterval: null,
	powerUpDuration: 5000,
	powerUpActive: false,

	x: null,
	y: null,
	dx: null,
	dy: null,
	ctx: null,
	INIT_DX: null,
	INIT_DY: null,
	powerUpX: null,
	powerUpY: null,
	animationFrame: null,
	playerScoreElement: null,
	aiScoreElement: null,
	defaultView: null,
	gameView: null,
	gameplayView: null,

	playerPaddleHeight: 75,
	playerPaddleWidth: 12,
	aiPaddleHeight: 75,
	aiPaddleWidth: 12,
	playerPaddleX: 0,
	aiPaddleX: (420 - 75) / 2,
	playerUpPressed: false,
	playerDownPressed: false,

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
};

export default gameVar;
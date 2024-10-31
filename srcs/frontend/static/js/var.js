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
	powerUpX: null,
	powerUpY: null,
	animationFrame: null,
	playerScoreElement: null,
	aiScoreElement: null,
	defaultView: null,
	gameView: null,

	playerPaddleHeight: 75,
	playerPaddleWidth: 12,
	aiPaddleHeight: 75,
	aiPaddleWidth: 12,
	playerPaddleX: 0,
	aiPaddleX: (420 - 75) / 2,
	playerUpPressed: false,
	playerDownPressed: false,

};

export default gameVar;
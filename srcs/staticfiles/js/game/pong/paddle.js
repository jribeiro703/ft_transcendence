import gameVar from "./var.js";

export function checkPaddles()
{
	if (gameVar.liveMatch)
	{
		if (gameVar.playerIdx == 1)
			drawPaddle(1);
		if (gameVar.playerIdx == 2)
			drawPaddle(2)
	}
	else
	{
		drawPlayerPaddle();
		if (!gameVar.localGame)
			drawOtherPaddle("ai");
		else
			drawOtherPaddle('player2');
	}
}

function drawPaddle(player)
{
	if (player === 1)
	{
		drawPlayerPaddle();
		drawOtherPaddle("player2");
	}
	if (player === 2)
	{
		drawOtherPaddle("player2");
		drawPlayerPaddle();
	}
}

function drawPlayerPaddle()
{
	const x = 0;
    const radius = gameVar.playerPaddleWidth / 2 + 3;
	let color = null;

	if (gameVar.currentLevel === 'tableTennis')
		color = "#FF414D";
	else if (gameVar.currentLevel === 'football')
		color = "#FF414D";
	else if (gameVar.currentLevel === 'tennis')
		color = "#4169E1";

    gameVar.ctx.beginPath();
    gameVar.ctx.moveTo(x, gameVar.playerPaddleY);
    gameVar.ctx.lineTo(x, gameVar.playerPaddleY + gameVar.playerPaddleHeight);
    gameVar.ctx.lineTo(x + gameVar.playerPaddleWidth - radius, gameVar.playerPaddleY + gameVar.playerPaddleHeight);
    gameVar.ctx.arc(x + gameVar.playerPaddleWidth - radius, gameVar.playerPaddleY + gameVar.playerPaddleHeight - radius,
        radius, Math.PI/2, 0, true);
    gameVar.ctx.lineTo(x + gameVar.playerPaddleWidth, gameVar.playerPaddleY + radius);
    gameVar.ctx.arc(x + gameVar.playerPaddleWidth - radius, gameVar.playerPaddleY + radius,
        radius, 0, -Math.PI/2, true);
    gameVar.ctx.lineTo(x, gameVar.playerPaddleY);
    gameVar.ctx.fillStyle = color;
    gameVar.ctx.fill();
    gameVar.ctx.closePath();
}

function drawOtherPaddle(player)
{
	let paddleY = 0;
	let paddleHeight = 0;
	let paddleWidth = 0;
	let x = 0
	let radius = 0;
	let color = null;

	if (player === "player2")
	{
		paddleY = gameVar.player2PaddleY;
		paddleHeight = gameVar.player2PaddleHeight;
		paddleWidth = gameVar.player2PaddleWidth;
		x = gameVar.canvasW - gameVar.player2PaddleWidth;
		radius = gameVar.player2PaddleWidth / 2 + 3;
		if (gameVar.currentLevel === 'tableTennis')
			color = "#0095DD";
		else if (gameVar.currentLevel === 'football')
			color = "#FF8C00";
		else if (gameVar.currentLevel === 'tennis')
			color = "#228B22";
	}
	else if (player === "ai")
	{
		paddleY = gameVar.aiPaddleY
		paddleHeight = gameVar.aiPaddleHeight;
		paddleWidth = gameVar.aiPaddleWidth;
		x = gameVar.canvasW - gameVar.aiPaddleWidth;
		radius = gameVar.aiPaddleWidth / 2 + 3;
		if (gameVar.currentLevel === 'tableTennis')
			color = "#0095DD";
		else if (gameVar.currentLevel === 'football')
			color = "#FF8C00";
		else if (gameVar.currentLevel === 'tennis')
			color = "#228B22";
	}

    gameVar.ctx.beginPath();
    gameVar.ctx.moveTo(x + paddleWidth, paddleY);
    gameVar.ctx.lineTo(x + paddleWidth, paddleY + paddleHeight);
    gameVar.ctx.lineTo(x + radius, paddleY + paddleHeight);
    gameVar.ctx.arc(x + radius, paddleY + paddleHeight - radius,
        radius, Math.PI/2, Math.PI, false);
    gameVar.ctx.lineTo(x, paddleY + radius);
    gameVar.ctx.arc(x + radius, paddleY + radius,
        radius, Math.PI, -Math.PI/2, false);
    gameVar.ctx.lineTo(x + paddleWidth, paddleY);
    gameVar.ctx.fillStyle = color;
    gameVar.ctx.fill();
    gameVar.ctx.closePath();
}

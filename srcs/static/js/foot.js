import gameVar from "./var.js";

export function collisionFoot()
{
	const penaltyAreaHeight = gameVar.canvasH * 0.4;
	const goalY = (gameVar.canvasH - penaltyAreaHeight) / 2;

	if (gameVar.y < goalY || gameVar.y > goalY + penaltyAreaHeight)
	{
		if (gameVar.x - gameVar.ballRadius < 0)
		{
			gameVar.x = gameVar.ballRadius;
			gameVar.dx = -gameVar.dx;
			return (true);
			// directChanged = true;
		}
		if (gameVar.x + gameVar.ballRadius > gameVar.canvasW)
		{
			gameVar.x = gameVar.canvasW - gameVar.ballRadius;
			gameVar.dx = -gameVar.dx;
			return (true);
			// directChanged = true;
		}
	}
}


export function drawFootball()
{
    gameVar.ctx.strokeStyle = 'white';
	gameVar.ctx.fillStyle = 'white';
    gameVar.ctx.lineWidth = 2;

    const width = gameVar.canvasW;
    const height = gameVar.canvasH;
    const penaltyAreaWidth = width * 0.13;
    const penaltyAreaHeight = height * 0.4;
    const sixYardBoxWidth = width * 0.05;
    const sixYardBoxHeight = height * 0.2;
    const centerCircleRadius = height * 0.1;
    const cornerRadius = height * 0.035;
    const penaltySpotDistance = width * 0.09;
    const penaltyArcRadius = height * 0.1;

    gameVar.ctx.beginPath();
    gameVar.ctx.moveTo(width / 2, 0);
    gameVar.ctx.lineTo(width / 2, height);
    gameVar.ctx.stroke();

    gameVar.ctx.beginPath();
    gameVar.ctx.arc(width / 2, height / 2, centerCircleRadius, 0, Math.PI * 2);
    gameVar.ctx.stroke();

    gameVar.ctx.beginPath();
    gameVar.ctx.arc(width / 2, height / 2, 3, 0, Math.PI * 2);
    gameVar.ctx.fill();

    gameVar.ctx.strokeRect(0, (height - penaltyAreaHeight) / 2, penaltyAreaWidth, penaltyAreaHeight);
    
    gameVar.ctx.strokeRect(0, (height - sixYardBoxHeight) / 2, sixYardBoxWidth, sixYardBoxHeight);

    gameVar.ctx.beginPath();
    gameVar.ctx.arc(penaltySpotDistance, height / 2, 3, 0, Math.PI * 2);
    gameVar.ctx.fill();

    gameVar.ctx.beginPath();
    gameVar.ctx.arc(penaltySpotDistance, height / 2, penaltyArcRadius + 15, -0.3 * Math.PI, 0.3 * Math.PI);
    gameVar.ctx.stroke();

    gameVar.ctx.strokeRect(width - penaltyAreaWidth, (height - penaltyAreaHeight) / 2, penaltyAreaWidth, penaltyAreaHeight);
    
    gameVar.ctx.strokeRect(width - sixYardBoxWidth, (height - sixYardBoxHeight) / 2, sixYardBoxWidth, sixYardBoxHeight);

    gameVar.ctx.beginPath();
    gameVar.ctx.arc(width - penaltySpotDistance, height / 2, 3, 0, Math.PI * 2);
    gameVar.ctx.fill();

    gameVar.ctx.beginPath();
    gameVar.ctx.arc(width - penaltySpotDistance, height / 2, penaltyArcRadius + 15, 0.7 * Math.PI, 1.3 * Math.PI);
    gameVar.ctx.stroke();

    gameVar.ctx.beginPath();
    gameVar.ctx.arc(0, 0, cornerRadius, 0, Math.PI/2);
	gameVar.ctx.stroke();

    gameVar.ctx.beginPath();
    gameVar.ctx.arc(width, 0, cornerRadius, Math.PI/2, Math.PI);
    gameVar.ctx.stroke();
	
    gameVar.ctx.beginPath();
    gameVar.ctx.arc(width, height, cornerRadius, Math.PI, 1.5*Math.PI);
    gameVar.ctx.stroke();
	
    gameVar.ctx.beginPath();
    gameVar.ctx.arc(0, height, cornerRadius, 1.5*Math.PI, 2*Math.PI);
    gameVar.ctx.stroke();

	const goalHeight = 175;
	const wallThickness = 4;

    gameVar.ctx.fillStyle = 'gray';
    gameVar.ctx.fillRect(0, 0, wallThickness, (gameVar.canvasH - goalHeight) / 2);
    gameVar.ctx.fillRect(0, (gameVar.canvasH + goalHeight) / 2, wallThickness, (gameVar.canvasH - goalHeight) / 2);

    gameVar.ctx.fillRect(gameVar.canvasW - wallThickness, 0, wallThickness, (gameVar.canvasH - goalHeight) / 2);
    gameVar.ctx.fillRect(gameVar.canvasW - wallThickness, (gameVar.canvasH + goalHeight) / 2, wallThickness, (gameVar.canvasH - goalHeight) / 2);

}
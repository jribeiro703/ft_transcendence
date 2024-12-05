import gameVar from "./var.js";

export function collisionTennis()
{
	const width = gameVar.canvasW;
    const height = gameVar.canvasH;

	const wallArea = height * 0.6;
	const goalY = (height - wallArea) / 2
    
    if (gameVar.y < goalY || gameVar.y > goalY + wallArea)
	{
		if (gameVar.x - gameVar.ballRadius < 0)
        {
			gameVar.x = gameVar.ballRadius;
        	gameVar.dx = -gameVar.dx;
			return (true);
		}
		if (gameVar.x + gameVar.ballRadius >  width)
		{
			gameVar.x = width - gameVar.ballRadius;
			gameVar.dx = -gameVar.dx;
			return (true);
		}
    }
}
export function drawTennisCourt()
{
    gameVar.ctx.strokeStyle = 'white';
    gameVar.ctx.lineWidth = 2;

    const width = gameVar.canvasW;
    const height = gameVar.canvasH;
    
    const sideMargin = width * 0.02;
    const serviceLineY = height * 0.15;
    const centerServiceLineWidth = width * 0.20;
    const netWidth = 5;

    gameVar.ctx.strokeRect(sideMargin, 0, width - 2 * sideMargin, height);

    gameVar.ctx.beginPath();
    gameVar.ctx.moveTo(width/2, 0);
    gameVar.ctx.lineTo(width/2, height);
    gameVar.ctx.stroke();

	gameVar.ctx.beginPath();
	gameVar.ctx.moveTo(585, height / 2);
    gameVar.ctx.lineTo(serviceLineY + 190, height / 2);
	gameVar.ctx.stroke();

    gameVar.ctx.beginPath();
    gameVar.ctx.moveTo(sideMargin, serviceLineY);
    gameVar.ctx.lineTo(width - sideMargin, serviceLineY);
    gameVar.ctx.moveTo(sideMargin, height - serviceLineY);
    gameVar.ctx.lineTo(width - sideMargin, height - serviceLineY);
    gameVar.ctx.stroke();

    gameVar.ctx.beginPath();
    gameVar.ctx.moveTo(width/2 - centerServiceLineWidth, serviceLineY);
    gameVar.ctx.lineTo(width/2 - centerServiceLineWidth, height - serviceLineY);
    gameVar.ctx.moveTo(width/2 + centerServiceLineWidth, serviceLineY);
    gameVar.ctx.lineTo(width/2 + centerServiceLineWidth, height - serviceLineY);
    gameVar.ctx.stroke();

    gameVar.ctx.fillStyle = 'white';
    gameVar.ctx.fillRect(width/2 - netWidth/2, 0, netWidth, height);

    const markSize = 5;
    gameVar.ctx.beginPath();
    gameVar.ctx.moveTo(sideMargin, height/2 - markSize);
    gameVar.ctx.lineTo(sideMargin, height/2 + markSize);
    gameVar.ctx.moveTo(width - sideMargin, height/2 - markSize);
    gameVar.ctx.lineTo(width - sideMargin, height/2 + markSize);
    gameVar.ctx.stroke();

	const goalHeight = 175;
	const wallThickness = 5;
	gameVar.ctx.fillStyle = 'grey';
    gameVar.ctx.fillRect(0, 0, wallThickness, (gameVar.canvasH - goalHeight - 50) / 3);
    gameVar.ctx.fillRect(0, (gameVar.canvasH + goalHeight + 120) / 2, wallThickness, (gameVar.canvasH - goalHeight - 50) / 3);

    gameVar.ctx.fillRect(gameVar.canvasW - wallThickness, 0, wallThickness, (gameVar.canvasH - goalHeight - 60) / 3);
    gameVar.ctx.fillRect(gameVar.canvasW - wallThickness, (gameVar.canvasH + goalHeight + 120) / 2, wallThickness, (gameVar.canvasH - goalHeight) / 2);

}
export function drawLines() 
{
	gameVar.ctx.strokeStyle = 'white';
	gameVar.ctx.lineWidth = 4;
	gameVar.ctx.setLineDash([12, 12]);
	gameVar.ctx.beginPath();
	gameVar.ctx.moveTo(gameVar.canvasW / 2, 0);
	gameVar.ctx.lineTo(gameVar.canvasW / 2, gameVar.canvasH);
	gameVar.ctx.stroke();
	gameVar.ctx.setLineDash([]); 

	gameVar.ctx.lineWidth = 2;
	gameVar.ctx.strokeRect(0, 0, gameVar.canvasW, gameVar.canvasH);

	gameVar.ctx.lineWidth = 2;
	gameVar.ctx.beginPath();
	gameVar.ctx.moveTo(0, gameVar.canvasH / 2); 
	gameVar.ctx.lineTo(gameVar.canvasW, gameVar.canvasH / 2);
	gameVar.ctx.stroke();
}
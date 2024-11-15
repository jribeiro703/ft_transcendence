import gameVar from "./var.js";

export function drawBricks()
{
	const map = gameVar.maps['customMap1'];
	if (map)
	{
		map.forEach(wall =>
		{
			if (wall.sta == 1)	
			{
				gameVar.ctx.fillStyle = 'gray';
				gameVar.ctx.fillRect(wall.x, wall.y, wall.width, wall.height);
			}
		});
	}
}
import brickVar from './var.js';
import { youWinB } from './level.js';


for(var c = 0; c < brickVar.brickColumnCount; c++)
{
	brickVar.brick[c] = [];
	for(var r = 0; r < brickVar.brickRowCount; r++)
	{
		brickVar.brick[c][r] = { x: 0, y: 0, status: 1 };
	}
}

export function collisionDetectionB()
{
	for(var c = 0; c < brickVar.brickColumnCount; c++) 
	{
		for(var r = 0; r<brickVar.brickRowCount; r++)
		{
			var b = brickVar.brick[c][r];
			if(b.status == 1)
			{
				if(brickVar.x > b.x && brickVar.x < b.x + brickVar.brickWidth && brickVar.y > b.y && brickVar.y < b.y + brickVar.brickHeight)
				{
					brickVar.dy = -brickVar.dy;
					b.status = 0;
					brickVar.score++;
					if(brickVar.score == 1)
					{
						brickVar.finishLevel = true;
						brickVar.ctx.clearRect(0, 0, brickVar.canvasW, brickVar.canvasH);
						if (brickVar.currLevel === "invader")
							brickVar.finish = true;
						youWinB();
					}
				}
			}
		}
	}
}   

export function initBricksB(pattern)
{
    brickVar.brick = [];
    
    switch(pattern)
	{
        case brickVar.PATTERNS.CLASSIC:
            createClassicPattern();
            break;
        case brickVar.PATTERNS.CASTLE:
            createCastlePattern();
            break;
        case brickVar.PATTERNS.X:
            createXPattern();
            break;
        case brickVar.PATTERNS.INVADER:
            createInvaderPattern();
            break;
    }
}

function createClassicPattern()
{
	console.log('createclassic');
	brickVar.brickColumnCount = 8;
    for(let c = 0; c < brickVar.brickColumnCount; c++)
	{
        brickVar.brick[c] = [];
        for(let r = 0; r < brickVar.brickRowCount; r++)
		{
            brickVar.brick[c][r] = { x: 0, y: 0, status: 1 };
        }
    }
    brickVar.totalBrick = brickVar.brickColumnCount * brickVar.brickRowCount;
	brickVar.currLevel = 'classic';
}

function createCastlePattern()
{
	brickVar.brickColumnCount = 16;
    const pattern = [
        [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
        [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
        [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
        [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
        [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
        [1,0,0,1,1,1,1,1,1,1,1,1,1,0,0,1],
        [1,0,0,1,1,1,1,1,1,1,1,1,1,0,0,1],
        [1,0,0,1,1,1,1,1,1,1,1,1,1,0,0,1],
        [1,0,0,1,1,1,1,1,1,1,1,1,1,0,0,1],
        [1,0,0,1,1,1,1,1,1,1,1,1,1,0,0,1],
        [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
        [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
        [1,0,0,1,1,1,0,0,0,0,1,1,1,0,0,1],
        [1,0,0,1,1,1,0,0,0,0,1,1,1,0,0,1],
        [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
    ];
    
    for(let c = 0; c < pattern.length; c++)
	{
        brickVar.brick[c] = [];
        for(let r = 0; r < pattern[0].length; r++)
		{
            brickVar.brick[c][r] = { 
                x: 0, 
                y: 0, 
                status: pattern[c][r]
            };
        }
    }
	countBrick(pattern);
	brickVar.currLevel = 'castle';
	brickVar.finishLevel = false;
}

function countBrick(pattern)
{
	let brickCount = 0;
	for(let c = 0; c < pattern.length; c++)
	{
        for(let r = 0; r < pattern[0].length; r++)
		{
            if (pattern[c][r] === 1) brickCount++;
        }
    }
    brickVar.totalBrick = brickCount;
}

function createXPattern() 
{
	brickVar.brickColumnCount = 16;
    const pattern = [
        [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
        [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
        [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
        [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
        [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
        [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
        [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,1,1,1,1,0,0,0,0,0,0],
        [1,0,0,0,0,0,1,1,1,1,0,0,0,0,0,1],
        [1,1,0,0,0,0,0,1,1,0,0,0,0,0,1,1],
        [1,1,1,0,0,0,0,0,0,0,0,0,0,1,1,1],
        [1,1,1,1,0,0,0,0,0,0,0,0,1,1,1,1],
        [1,1,1,0,0,0,0,0,0,0,0,0,0,1,1,1],
        [1,1,0,0,0,0,0,1,1,0,0,0,0,0,1,1],
        [1,0,0,0,0,0,1,1,1,1,0,0,0,0,0,1],
        [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
    ];
	for(let c = 0; c < pattern.length; c++) 
	{
        brickVar.brick[c] = [];
        for(let r = 0; r < pattern[0].length; r++)
		{
            brickVar.brick[c][r] =
			{ 
                x: 0, 
                y: 0, 
                status: pattern[c][r]
            };
        }
    }
	countBrick(pattern);
	brickVar.currLevel = 'x';
	brickVar.finishLevel = false;
}
	
function createInvaderPattern()
{
	brickVar.brickColumnCount = 16;
    const pattern = [
        [0,0,0,0,1,0,0,0,0,0,0,1,0,0,0,0],
        [0,0,0,0,1,0,0,0,0,0,0,1,0,0,0,0],
        [0,0,0,0,0,1,0,0,0,0,1,0,0,0,0,0],
        [0,0,0,0,0,1,0,0,0,0,1,0,0,0,0,0],
        [0,0,0,0,1,1,1,1,1,1,1,1,0,0,0,0],
        [0,0,0,0,1,1,1,1,1,1,1,1,0,0,0,0],
        [0,0,0,1,1,1,1,1,1,1,1,1,1,0,0,0],
        [0,0,0,1,1,1,1,1,1,1,1,1,1,0,0,0],
        [0,0,1,1,1,1,1,1,1,1,1,1,1,1,0,0],
        [0,0,1,1,1,1,1,1,1,1,1,1,1,1,0,0],
        [0,0,1,1,1,1,1,1,1,1,1,1,1,1,0,0],
        [0,0,1,0,1,1,1,1,1,1,1,1,0,1,0,0],
        [0,0,1,0,1,0,0,0,0,0,0,1,0,1,0,0],
        [0,0,1,0,1,0,0,0,0,0,0,1,0,1,0,0],
        [0,0,0,0,0,1,1,0,0,1,1,0,0,0,0,0],
        [0,0,0,0,0,1,1,0,0,1,1,0,0,0,0,0],

    ];
    
    for(let c = 0; c < pattern.length; c++)
	{
        brickVar.brick[c] = [];
        for(let r = 0; r < pattern[0].length; r++)
		{
            brickVar.brick[c][r] =
			{ 
                x: 0, 
                y: 0, 
                status: pattern[c][r]
            };
        }
    }
	countBrick(pattern);
	brickVar.currLevel = 'invader';
	brickVar.finishLevel = false;
}




export function drawBricksB()
{
	for(var c = 0; c < brickVar.brick.length; c++)
	{
		for(var r = 0; r < brickVar.brick[c].length; r++)
		{
			if(brickVar.brick[c][r].status == 1)
			{
				var brickX = (r * (brickVar.brickWidth + brickVar.brickPadding)) + brickVar.brickOffsetLeft;
				var brickY = (c * (brickVar.brickHeight + brickVar.brickPadding)) + brickVar.brickOffsetTop;
				brickVar.gradient = brickVar.ctx.createLinearGradient(0, 0, 0, 250);
				changeColor();

				brickVar.brick[c][r].x = brickX;
				brickVar.brick[c][r].y = brickY;
				brickVar.ctx.beginPath();
				brickVar.ctx.rect(brickX, brickY, brickVar.brickWidth, brickVar.brickHeight);
				brickVar.ctx.fillStyle = brickVar.gradient;
				brickVar.ctx.fill();
				brickVar.ctx.closePath();
			}
		}
	}
}

function changeColor()
{
	if (brickVar.currLevel == 'classic')
	{
		brickVar.gradient.addColorStop(0.33, "green");
		brickVar.gradient.addColorStop(0.66, "blue");
		brickVar.gradient.addColorStop(1, "green");
	}
	else if (brickVar.currLevel == 'castle')
	{
		brickVar.gradient.addColorStop(0.33, "red");
		brickVar.gradient.addColorStop(0.66, "yellow");
		brickVar.gradient.addColorStop(1, "orange");
	}
	else if (brickVar.currLevel == 'x')
	{
		brickVar.gradient.addColorStop(0.33, "#2F4F4F");
		brickVar.gradient.addColorStop(0.66, "#708090");
		brickVar.gradient.addColorStop(1, "#778899");
	}
	else if (brickVar.currLevel == 'invader')
	{
		brickVar.gradient.addColorStop(0.33, "red");
		brickVar.gradient.addColorStop(0.66, "yellow");
		brickVar.gradient.addColorStop(1, "green");
	}
}
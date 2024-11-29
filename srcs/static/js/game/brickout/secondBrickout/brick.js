import brickVar2 from './var.js';
import { youWinB } from './level.js';

for(var c = 0; c < brickVar2.brickColumnCount; c++)
{
	brickVar2.brick[c] = [];
	for(var r = 0; r < brickVar2.brickRowCount; r++)
	{
		brickVar2.brick[c][r] = { x: 0, y: 0, status: 1 };
	}
}

export function collisionDetectionB()
{
	for(var c = 0; c < brickVar2.brickColumnCount; c++) 
	{
		for(var r = 0; r<brickVar2.brickRowCount; r++)
		{
			var b = brickVar2.brick[c][r];
			if(b.status == 1)
			{
				if(brickVar2.x > b.x && brickVar2.x < b.x + brickVar2.brickWidth && brickVar2.y > b.y && brickVar2.y < b.y + brickVar2.brickHeight)
				{
					brickVar2.dy = -brickVar2.dy;
					b.status = 0;
					brickVar2.score++;
					if(brickVar2.score == brickVar2.totalBrick)
					{
						brickVar2.finishLevel = true;
						brickVar2.ctx.clearRect(0, 0, brickVar2.canvasW, brickVar2.canvasH);
						if (brickVar2.currLevel === "invader")
							brickVar2.finish = true;
						youWinB();
					}
				}
			}
		}
	}
}   

export function initBricksB(pattern)
{
    brickVar2.brick = [];
    
    switch(pattern)
	{
        case brickVar2.PATTERNS.CLASSIC:
            createClassicPattern();
            break;
        case brickVar2.PATTERNS.CASTLE:
            createCastlePattern();
            break;
        case brickVar2.PATTERNS.X:
            createXPattern();
            break;
        case brickVar2.PATTERNS.INVADER:
            createInvaderPattern();
            break;
    }
}

function createClassicPattern()
{
	console.log('createclassic');
	brickVar2.brickColumnCount = 8;
    for(let c = 0; c < brickVar2.brickColumnCount; c++)
	{
        brickVar2.brick[c] = [];
        for(let r = 0; r < brickVar2.brickRowCount; r++)
		{
            brickVar2.brick[c][r] = { x: 0, y: 0, status: 1 };
        }
    }
    brickVar2.totalBrick = brickVar2.brickColumnCount * brickVar2.brickRowCount;
	brickVar2.currLevel = 'classic';
}

function createCastlePattern()
{
	brickVar2.brickColumnCount = 16;
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
        brickVar2.brick[c] = [];
        for(let r = 0; r < pattern[0].length; r++)
		{
            brickVar2.brick[c][r] = { 
                x: 0, 
                y: 0, 
                status: pattern[c][r]
            };
        }
    }
	countBrick(pattern);
	brickVar2.currLevel = 'castle';
	brickVar2.finishLevel = false;
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
    brickVar2.totalBrick = brickCount;
}

function createXPattern() 
{
	brickVar2.brickColumnCount = 16;
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
        brickVar2.brick[c] = [];
        for(let r = 0; r < pattern[0].length; r++)
		{
            brickVar2.brick[c][r] =
			{ 
                x: 0, 
                y: 0, 
                status: pattern[c][r]
            };
        }
    }
	countBrick(pattern);
	brickVar2.currLevel = 'x';
	brickVar2.finishLevel = false;
}
	
function createInvaderPattern()
{
	brickVar2.brickColumnCount = 16;
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
        brickVar2.brick[c] = [];
        for(let r = 0; r < pattern[0].length; r++)
		{
            brickVar2.brick[c][r] =
			{ 
                x: 0, 
                y: 0, 
                status: pattern[c][r]
            };
        }
    }
	countBrick(pattern);
	brickVar2.currLevel = 'invader';
	brickVar2.finishLevel = false;
}




export function drawBricksB()
{
	for(var c = 0; c < brickVar2.brick.length; c++)
	{
		for(var r = 0; r < brickVar2.brick[c].length; r++)
		{
			if(brickVar2.brick[c][r].status == 1)
			{
				var brickX = (r * (brickVar2.brickWidth + brickVar2.brickPadding)) + brickVar2.brickOffsetLeft;
				var brickY = (c * (brickVar2.brickHeight + brickVar2.brickPadding)) + brickVar2.brickOffsetTop;
				brickVar2.gradient = brickVar2.ctx.createLinearGradient(0, 0, 0, 250);
				changeColor();

				brickVar2.brick[c][r].x = brickX;
				brickVar2.brick[c][r].y = brickY;
				brickVar2.ctx.beginPath();
				brickVar2.ctx.rect(brickX, brickY, brickVar2.brickWidth, brickVar2.brickHeight);
				brickVar2.ctx.fillStyle = brickVar2.gradient;
				brickVar2.ctx.fill();
				brickVar2.ctx.closePath();
			}
		}
	}
}

function changeColor()
{
	if (brickVar2.currLevel == 'classic')
	{
		brickVar2.gradient.addColorStop(0.33, "green");
		brickVar2.gradient.addColorStop(0.66, "blue");
		brickVar2.gradient.addColorStop(1, "green");
	}
	else if (brickVar2.currLevel == 'castle')
	{
		brickVar2.gradient.addColorStop(0.33, "red");
		brickVar2.gradient.addColorStop(0.66, "yellow");
		brickVar2.gradient.addColorStop(1, "orange");
	}
	else if (brickVar2.currLevel == 'x')
	{
		brickVar2.gradient.addColorStop(0.33, "#2F4F4F");
		brickVar2.gradient.addColorStop(0.66, "#708090");
		brickVar2.gradient.addColorStop(1, "#778899");
	}
	else if (brickVar2.currLevel == 'invader')
	{
		brickVar2.gradient.addColorStop(0.33, "red");
		brickVar2.gradient.addColorStop(0.66, "yellow");
		brickVar2.gradient.addColorStop(1, "green");
	}
}
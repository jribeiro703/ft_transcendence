import brickVar2 from "./var.js";
import { countBrick } from "./brick.js";

export function createClassicPattern()
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

export function createCastlePattern()
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

export function createXPattern() 
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
	
export function createInvaderPattern()
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
import brickVar from "./var.js";
import { countBrick } from "./brick.js";

export function createClassicPattern()
{
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

export function createCastlePattern()
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

export function createXPattern() 
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
	
export function createInvaderPattern()
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
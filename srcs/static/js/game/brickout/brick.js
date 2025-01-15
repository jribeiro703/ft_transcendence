import brickVar from './var.js';
import { youWinB } from './level.js';
import { createCastlePattern, createInvaderPattern, createXPattern, createClassicPattern } from './brickPattern.js';
import { sendScoreInfoB } from '../pong/network.js';
import gameVar from '../pong/var.js';
import brickVar2 from './secondBrickout/var.js';

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
					manageRemoteScore();
					brickVar.totalBrick = 1;
					if(brickVar.score == brickVar.totalBrick)
					{
						if (brickVar.playerIdx === 2)
						{
							console.log("if 2");
							brickVar2.finishLevel = true;
						}
						else
						{
							console.log("else");
							brickVar.finishLevel = true;
						}
						brickVar.ctx.clearRect(0, 0, brickVar.canvasW, brickVar.canvasH);
						if (brickVar.currLevel === "invader")
							brickVar.finish = true;
						if (!gameVar.localGame)
							youWinB();
					}
				}
			}
		}
	}
}   

export function manageRemoteScore()
{
	if (gameVar.game === 'brickout' && gameVar.liveMatch === true)
	{
		if (gameVar.playerIdx === 1)
		{
			brickVar.playerScore = brickVar.score;
			sendScoreInfoB(gameVar.gameSocket, 1, brickVar.playerScore, brickVar.playerLives);
		}
		if (gameVar.playerIdx === 2)
		{
			brickVar.opponentScore = brickVar.score;
			sendScoreInfoB(gameVar.gameSocket, 2, brickVar.opponentScore, brickVar.opponentLives);
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

export function countBrick(pattern)
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
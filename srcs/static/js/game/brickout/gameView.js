import brickVar from './var.js';
import brickVar2 from './secondBrickout/var.js';
import { initGame, initListenerB, initListenerMultiB, startBrickGame2p } from './init.js';
import { displayGameBrickView } from '../pong/display.js';
import { initializeCanvasBrick, initializeCanvasBrick2p, initializeScoreCanvas2P, initializeScoreCanvasBrickout } from '../pong/canvas.js';
import { displayGameBrick2pView } from '../pong/display.js';
import { updateSettingSelectionForSecond } from './update.js';
import { getUserInfos } from '../getUser.js';

export async function showGameBrickView()
{
	displayGameBrickView();

	await initializeCanvasBrick();
	await initializeScoreCanvasBrickout();

	initListenerB();
	initGame();
}

export async function showGameBrickLocalView()
{
	displayGameBrick2pView();
 
	getUserInfos();
	await initializeCanvasBrick2p();
	await initializeScoreCanvas2P();

	initListenerMultiB();
	brickVar.initialize = true;
	brickVar2.initialize = true;
	updateSettingSelectionForSecond();

	startBrickGame2p();
}


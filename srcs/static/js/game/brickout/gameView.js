import brickVar from './var.js';
import brickVar2 from './secondBrickout/var.js';
import { checkSettingB } from './settings.js';
import { initGame, initListenerB, initListenerMultiB, startBrickGame2p } from './init.js';
import { displayGameBrickView } from '../pong/display.js';
import { initializeCanvasBrick, initializeCanvasBrick2p, initializeScoreCanvas2P } from '../pong/canvas.js';
import { displayGameBrick2pView } from '../pong/display.js';
import { updateSettingSelectionForSecond } from './update.js';
import { clearAllBrickStates } from './manage.js';
import { drawB as drawFirst} from './draw.js';
import { drawB as drawSecond} from './secondBrickout/draw.js';
import { getUserInfos } from '../getUser.js';

export async function showGameBrickView()
{
	// checkSettingB();
	displayGameBrickView();

	await initializeCanvasBrick();

	initListenerB();
	initGame();
}

export async function showGameBrickLocalView()
{
	clearAllBrickStates();

	displayGameBrick2pView();
 
	getUserInfos();
	await initializeCanvasBrick2p();
	await initializeScoreCanvas2P();

	initListenerMultiB();
	brickVar.initialize = true;
	brickVar2.initialize = true;
	updateSettingSelectionForSecond();
	// checkSettingB();

	startBrickGame2p();

	// // drawFirst();
	// drawSecond();
}


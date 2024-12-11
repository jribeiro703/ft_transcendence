import brickVar from './var.js';
import brickVar2 from './secondBrickout/var.js';
import { checkSettingB } from './settings.js';
import { initListenerB, initListenerMultiB, startBrickGame2p } from './init.js';
import { displayGameBrickView } from '../pong/display.js';
import { initializeCanvasBrick, initializeCanvasBrick2p } from '../pong/canvas.js';
import { displayGameBrick2pView } from '../pong/display.js';
import { updateSettingSelectionForSecond } from './update.js';
import { clearAllBrickStates } from './manage.js';
import { drawB as drawFirst} from './draw.js';
import { drawB as drawSecond} from './secondBrickout/draw.js';

export async function showGameBrickView()
{
	checkSettingB();
	displayGameBrickView();

	await initializeCanvasBrick();

	initListenerB();
	brickVar.initialize = true;
}

export async function showGameBrickLocalView()
{
	clearAllBrickStates();

	displayGameBrick2pView();
 
	await initializeCanvasBrick2p();

	initListenerMultiB();
	brickVar.initialize = true;
	brickVar2.initialize = true;
	updateSettingSelectionForSecond();
	checkSettingB();

	startBrickGame2p();

	drawFirst();
	drawSecond();
}


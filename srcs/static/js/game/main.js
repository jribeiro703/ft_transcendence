import gameVar from './var.js';
import { updatePowerUpSelection } from './powerUp.js';
import { updateLevelSelection } from './update.js';
import { initGameVar, initEventListener, initEventListenerRoom } from './init.js';
import { preventNavTouch } from './input.js';

document.addEventListener('DOMContentLoaded', function() 
{
	const link = document.createElement('link');
	link.rel = 'stylesheet';
	link.href = 'static/css/style.css';
	link.type = 'text/css';

	document.head.appendChild(link);

	// preventNavTouch();
	initGameVar();
	initEventListener();
});
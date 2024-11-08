import gameVar from './var.js';
import { updatePowerUpSelection } from './powerUp.js';
import { updateLevelSelection } from './gameMode.js';
import { initGameVar, initEventListener, initEventListenerRoom, initEventListenerAi } from './init.js';
import { manageAi } from './ai.js';


document.addEventListener('DOMContentLoaded', function() 
{
	const link = document.createElement('link');
	link.rel = 'stylesheet';
	link.href = 'static/css/style.css';
	link.type = 'text/css';

	document.head.appendChild(link);
	var canvas = document.getElementById('myCanvas');
	gameVar.ctx = canvas.getContext('2d');
	canvas.width = gameVar.canvasW;
	canvas.height = gameVar.canvasH;

	initGameVar();
	initEventListener();

	// if (gameVar.liveMatch)
	// 	initEventListenerRoom();
	// else
	// 	initEventListenerAi();

	updateLevelSelection();
	updatePowerUpSelection(false);
});
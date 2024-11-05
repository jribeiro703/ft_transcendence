import gameVar from './var.js';
import { updatePowerUpSelection } from './powerUp.js';
import { updateLevelSelection } from './gameMode.js';
import { initGameVar, initEventListener } from './init.js';

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

	updateLevelSelection();
	updatePowerUpSelection(false);

});
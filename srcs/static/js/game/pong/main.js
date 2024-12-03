import gameVar from './var.js';
import { showGameSelectionView } from './gameSelectionView.js';
import { showGameSelectionMultiView } from './gameViewMulti.js'
import { removeEventListeners } from './init.js';

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

export function initGameVar()
{
	gameVar.playsoloGameBtn = document.getElementById('playsoloGameBtn');
	gameVar.playmultiGameBtn = document.getElementById('playmultiGameBtn');
}

export function initEventListener()
{
	removeEventListeners();
	gameVar.playsoloGameBtn.addEventListener('click', showGameSelectionView);
	// gameVar.playmultiGameBtn.addEventListener('click', roomMultiView);
	gameVar.playmultiGameBtn.addEventListener('click', showGameSelectionMultiView);
}
export function preventNavTouch()
{
	document.addEventListener('keydown', function(e)
	{
		const keysToPrevent =
		[
			'ArrowUp',
			'ArrowDown',
			'ArrowLeft',
			'ArrowRight',
			' ' // Espace
		];
		
		if (keysToPrevent.includes(e.key))
		{
			e.preventDefault();
		}
	}, false);
}
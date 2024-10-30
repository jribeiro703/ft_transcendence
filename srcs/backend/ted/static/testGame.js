// Assurez-vous que le DOM est complètement chargé avant d'ajouter des événements
document.addEventListener('DOMContentLoaded', function() 
{
	const quickGameBtn = document.getElementById('quickGameBtn');
	const defaultView = document.getElementById('defaultView');
	const gameView = document.getElementById('gameView');
	
	function showGameView()
	{
		defaultView.style.display = 'none';
        gameView.style.display = 'block';
        launch(); // Appelle la fonction pour dessiner sur le canvas
    }
    // Ajoutez un événement click
    quickGameBtn.addEventListener('click', showGameView);
	
	var canvas = document.getElementById('myCanvas');
	var ctx = canvas.getContext('2d');

	var x = canvas.width / 2;
	var y = canvas.height - 30;
	var dx = 2;
	var dy = -2;
	var ballRadius = 10;

	function launch()
	{
		draw();
	}

	function drawBall()
	{
		ctx.beginPath();
		ctx.arc(x, y, 10, 0, Math.PI * 2);
		ctx.fillStyle = "#0095DD";
		ctx.fill();
		ctx.closePath();
    }

	function draw()
	{
		ctx.clearRect(0, 0, canvas.width, canvas.height);
		drawBall();
		if(x + dx > canvas.width-ballRadius || x + dx < ballRadius) {
			dx = -dx;
		}
		if(y + dy > canvas.height-ballRadius || y + dy < ballRadius) {
			dy = -dy;
		}
		x += dx;
		y += dy;
	}
	setInterval(launch, 10);
});
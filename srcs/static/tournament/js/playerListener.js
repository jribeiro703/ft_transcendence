// This is an example script. It is not connected with any HTML DOM element. Just for an experiment

document.addEventListener('DOMContentLoaded', function()
{
	// Open a WebSocket connection
	const socket = new WebSocket('wss://' + window.location.host + '/ws/basic/');

	// When a message is received from the server
	socket.onmessage = function(event) {
		const data = JSON.parse(event.data);
		console.log(data.message);  // Log the welcome message. See in F12 console
	};

	// Handle WebSocket closing
	socket.onclose = function(e) {
		console.log('WebSocket closed'); // Every reload of the HTML the websocket closes
	};
});

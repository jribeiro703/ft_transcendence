document.addEventListener("DOMContentLoaded", function() {
	const participantList = document.getElementById("participantList");

	// Open a WebSocket connection
	const participantsSocket = new WebSocket(
		"wss://" + window.location.host + "/ws/tournament/"
	);

	// Handle WebSocket connection opening
	participantsSocket.onopen = function() {
		console.log("WebSocket connection established");
		participantsSocket.send(JSON.stringify({ action: "initial_connect" }));
	};

	participantsSocket.onmessage = function(event) {
		const data = JSON.parse(event.data);
		participantList.innerHTML = "";
		data.participants.forEach(participant => {
			const li = document.createElement("li");
			li.textContent = participant;
			participantList.appendChild(li);
		});
	};

	// Log WebSocket errors
	participantsSocket.onerror = function(error) {
		console.error("WebSocket error:", error);
	};

	// Handle WebSocket closure
	participantsSocket.onclose = function() {
		console.log("WebSocket connection closed");
	};
});

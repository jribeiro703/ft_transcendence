document.addEventListener("DOMContentLoaded", function() {
	const participantList = document.getElementById("playersList");

	if (!participantList) {
        console.error("Error: participantList element not found in the DOM.");
    } else {
        console.log("Success: participantList element found.");
    }

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
		//participantList.innerHTML = "";
		//participantList.style.display = "block";
		// Check if participants exist
		if (data.participants.length === 0) {
			const li = document.createElement("li");
			li.className = "playersList. list-group-item";
			li.textContent = "No participants available.";
			participantList.appendChild(li);
		} else {
			// Populate the list with participants
			data.participants.forEach(participant => {
				const li = document.createElement("li");
				li.className = "playersList. list-group-item";
				const playerBox = document.createElement("div");
                playerBox.className = "player-box";
                playerBox.innerHTML = `<span class="player-name">${participant}</span>`;
				li.appendChild(playerBox);
				participantList.appendChild(li);
			});
    }
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

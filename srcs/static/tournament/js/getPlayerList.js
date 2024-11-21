export function getPlayerList() {
	// Establish WebSocket connection
	const participantsSocket = new WebSocket(
		"wss://" + window.location.host + "/ws/tournament/"
	);

	// Handle WebSocket events
	participantsSocket.onopen = function () {
		console.log("WebSocket connection established");

		// Send the `get_all_users` action to the backend
		participantsSocket.send(JSON.stringify({ action: "get_all_users" }));
	};

	participantsSocket.onmessage = function (event) {
		const data = JSON.parse(event.data);

		if (data.action === "get_all_users") {
			console.log("User list received:", data.users);

			// Update the DOM with the user list
			const participantList = document.getElementById("playersList");
			participantList.innerHTML = ""; // Clear existing content

			if (data.users.length === 0) {
				const li = document.createElement("li");
				li.textContent = "No users found.";
				participantList.appendChild(li);
			} else {
				data.users.forEach(user => {
					const li = document.createElement("li");
					li.textContent = user;
					participantList.appendChild(li);
				});
			} 
		}else if (data.action === "create_demo_game") {
				console.log("Demo game created:", data);
	
				// Update the DOM with game details
				const gameLog = document.getElementById("gameLog");
				const gameEntry = document.createElement("li");
				gameEntry.textContent = `Game: ${data.game_id} | ${data.player_one} vs ${data.player_two} | Winner: ${data.winner} | Scores: ${data.score_one} - ${data.score_two}`;
				gameLog.appendChild(gameEntry);
		} else if (data.error) {
			console.error("Error from server:", data.error);
		} else {
			console.warn("Unexpected action:", data);
		}
	};

	participantsSocket.onerror = function (error) {
		console.error("WebSocket error:", error);
	};

	participantsSocket.onclose = function () {
		console.log("WebSocket connection closed");
	};

	 // Trigger demo game creation on button click
	 document.getElementById("createGameBtn").addEventListener("click", () => {
		participantsSocket.send(JSON.stringify({ action: "create_demo_game" }));
	});
}

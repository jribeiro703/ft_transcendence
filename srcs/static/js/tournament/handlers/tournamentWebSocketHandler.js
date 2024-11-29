export function getPlayerList() {
	// Establish WebSocket connection
	const tournamentSocket = new WebSocket(
		"wss://" + window.location.host + "/ws/tournament/"
	);

	// Handle WebSocket events
	tournamentSocket.onopen = function () {
		console.log("WebSocket connection established");

		// Send the `get_all_users` action to the backend
		tournamentSocket.send(JSON.stringify({ action: "get_all_users" }));
	};

	tournamentSocket.onmessage = function (event) {
		console.log("Message received from server:", event.data);
	
		try {
			const data = JSON.parse(event.data);
			if (data.action === "get_all_users") {
				console.log("User list received:", data.users);
	
				// Update the DOM
				const participantList = document.getElementById("playersList");
				participantList.innerHTML = "";
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
			} else if (data.error) {
				console.error("Error from server:", data.error);
			} else {
				console.warn("Unexpected action:", data);
			}
		} catch (e) {
			console.error("Failed to process message:", e);
		}
	};
	
	
	tournamentSocket.onerror = function (error) {
		console.error("WebSocket error:", error);
	};
	
	tournamentSocket.onclose = function () {
		console.log("WebSocket connection closed");
	};

	// Trigger game creation
	document.getElementById("createGameBtn").addEventListener("click", () => {
		tournamentSocket.send(JSON.stringify({ action: "create_demo_game" }));
	});
	
}

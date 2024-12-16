// tournament/handlers/playerManagement.js

import { createWebSocketConnection } from '../utils/websocketUtils.js';

// Fetches the list of players and updates the DOM.
export function getPlayerList() {
	const url = "wss://" + window.location.host + "/ws/tournament/";
	const action = "get_all_users";

	const onMessageCallback = function (data) {
		if (data.action === "get_all_users") {
			console.log("User list received:", data.users);

			// Update the DOM for all users
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
	};

	const socket = createWebSocketConnection(url, action, onMessageCallback);

	// Trigger game creation
	document.getElementById("createGameBtn").addEventListener("click", () => {
		socket.send(JSON.stringify({ action: "create_demo_game" }));
	});
}

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

export function getFriendsList(tournamentId) {
	// Establish WebSocket connection
	const friendsSocket = new WebSocket(
		"wss://" + window.location.host + "/ws/friends/"
	);
	
	// Handle WebSocket events
	friendsSocket.onopen = function () {
		console.log("WebSocket connection established");
		
		// Send the `get_friends` action to the backend
		friendsSocket.send(JSON.stringify({ action: "get_friends" }));
	};
	
	console.log("inside gfl");
	friendsSocket.onmessage = function (event) {
		console.log("Message received from server:", event.data);

		try {
			const data = JSON.parse(event.data);
			if (data.action === "get_friends") {
				console.log("Friends list received:", data.friends);

				// Update the DOM for friends list
				const inviteBox = document.getElementById("invite-box");
				inviteBox.innerHTML = "";
				if (data.friends.length === 0) {
					const p = document.createElement("p");
					p.textContent = "No friends found.";
					inviteBox.appendChild(p);
				} else {
					data.friends.forEach(friend => {
						const friendItem = document.createElement("div");
						friendItem.className = "friend-item d-flex align-items-center mb-2";
						friendItem.innerHTML = `
							<img src="${friend.avatar}" alt="${friend.username}" class="avatar me-2" style="width: 40px; height: 40px; border-radius: 50%;">
							<span>${friend.username}</span>
							<button class="btn btn-primary ms-auto" onclick="inviteFriend(${friend.id}, ${tournamentId})">Invite</button>
						`;
						inviteBox.appendChild(friendItem);
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

	friendsSocket.onerror = function (error) {
		console.error("WebSocket error:", error);
	};

	friendsSocket.onclose = function () {
		console.log("WebSocket connection closed");
	};
}

// Function to invite a friend
window.inviteFriend = async (friendId, tournamentId) => {
	try {
		const response = await fetch('https://localhost:8081/tournament/preregister/', {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({
				tournament_id: tournamentId,
				player_ids: [friendId],
			}),
		});

		if (response.ok) {
			const data = await response.json();
			console.log('Player invited:', data);
		} else {
			const errorData = await response.json();
			console.error('Failed to invite player:', errorData);
		}
	} catch (error) {
		console.error('Error inviting player:', error);
	}
};

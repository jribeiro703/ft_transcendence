
export function getPlayerList(data) {
	const box = document.getElementById('mainContent');

	console.log('get player list', data);

	console.log('get player list', data);

	const participantsSocket = new WebSocket(
		"wss://" + window.location.host + "/ws/tournament/"
	);

	participantsSocket.onopen = function () {
		console.log("WebSocket connection established");
		participantsSocket.send(JSON.stringify({ action: "initial_connect" }));
	};

	participantsSocket.onmessage = function (event) {
		const data = JSON.parse(event.data);

		const participantList = document.getElementById("playersList");
		if (!participantList) {
			console.error("Error: participantList element not found in the DOM.");
			return;
		}

		participantList.innerHTML = ""; // Clear existing content

		if (data.participants.length === 0) {
			const li = document.createElement("li");
			li.className = "list-group-item";
			li.textContent = "No participants available.";
			participantList.appendChild(li);
		} else {
			data.participants.forEach(participant => {
				const li = document.createElement("li");
				li.className = "list-group-item";
				const playerBox = document.createElement("div");
				playerBox.className = "player-box";
				playerBox.innerHTML = `<span class="player-name">${participant}</span>`;
				li.appendChild(playerBox);
				participantList.appendChild(li);
			});
		}
	};

	participantsSocket.onerror = function (error) {
		console.error("WebSocket error:", error);
	};

	participantsSocket.onclose = function () {
		console.log("WebSocket connection closed");
	};

	renderLoginResponse(data.otp_verification_url, data.message);
	box.innerHTML = `<p>${data.message}</p>`;
}
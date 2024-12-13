// tournament/handlers/friendManagement.js

import { createWebSocketConnection } from '../utils/websocketUtils.js';

// Fetches the list of friends and updates the DOM.
export function getFriendsList(tournamentId) {
	const url = "wss://" + window.location.host + "/ws/friends/";
	const action = "get_friends";

	const onMessageCallback = function (data) {
		if (data.action === "get_friends") {
			// console.log("Friends list received:", data.friends);

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
						<button class="invite-item btn btn-primary ms-auto" onclick="inviteFriend(${friend.id}, ${tournamentId})">Invite</button>
					`;
					inviteBox.appendChild(friendItem);
				});
			}
		} else if (data.error) {
			console.error("Error from server:", data.error);
		} else {
			console.warn("Unexpected action:", data);
		}
	};

	createWebSocketConnection(url, action, onMessageCallback);
}

/**
 * Invites a friend to a tournament.
 * @param {number} friendId - The ID of the friend to invite.
 * @param {number} tournamentId - The ID of the tournament.
 */
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

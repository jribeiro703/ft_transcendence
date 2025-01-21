import { fetchAuthData } from '../user/fetchData.js';
import { showToast } from '../user/tools.js';
import { chatSocket } from './socket.js';
import { gameChatSocket } from './game.js';
import { renderPage } from '../user/historyManager.js';
import { isAuth } from './socket.js';

export let messageInCooldown = false;
export const COOLDOWN_MS = 200;

document.addEventListener("DOMContentLoaded", function () {
	const messageInput = document.querySelector("#chat-message-input");
	const messageSubmit = document.querySelector("#chat-message-submit");

	if (messageInput && messageSubmit) {
		messageInput.addEventListener("keypress", function (e) {
			if (e.key === "Enter") {
				e.preventDefault();
				messageSubmit.click();
			}
		});
	} else {
		console.error("Message input or submit button not found");
	}
});

document.querySelector("#chat-message-input").onkeyup = async function (e) {
	if (e.keyCode === 13) {
		if (!document.querySelector("#chat-log").classList.contains('d-none')) {
			await sendChatMessage(chatSocket, "#chat-message-input", "#chat-log");
		}
		else if (!document.querySelector("#gamechat").classList.contains('d-none')) {
			await sendChatMessage(gameChatSocket, "#chat-message-input", "#gamechat");
		}
	}
};

document.querySelector("#chat-message-submit").onclick = async function () {
	if (!document.querySelector("#chat-log").classList.contains('d-none')) {
		await sendChatMessage(chatSocket, "#chat-message-input", "#chat-log");
	}
	else if (!document.querySelector("#gamechat").classList.contains('d-none')) {
		await sendChatMessage(gameChatSocket, "#chat-message-input", "#gamechat");
	}
};

export async function sendChatMessage(socket, inputId, logId) {
	const messageInput = document.querySelector(inputId);
	let message = messageInput.value.trim();

	if (message === "" || messageInCooldown) {
		return;
	}
	let response;
	try {
		messageInCooldown = true;

		if (isAuth) {
			response = await fetchAuthData('/user/check-auth/');
		}
		if (!isAuth || response.status === 401) {
			console.log('User not authenticated');
			showToast("You must be logged in to use this feature.", "warning");
			renderPage("auth", true);
			return;
		}

		let room = null;
		if (logId === "#gamechat" && gameChatSocket) {
			const roomMatch = gameChatSocket.url.match(/room_(\d+)/);
			if (roomMatch) {
				room = `room_${roomMatch[1]}`;
			}
		}

		if (message.length > 512) {
			showToast("Message is too long. It has been trimmed to 512 characters", "warning");
			message = message.substring(0, 512);
		}
		socket.send(
			JSON.stringify({
				message: message,
				token: localStorage.getItem('access_token'),
				room: room
			})
		);

		// Clear the message input form
		messageInput.value = "";
	} catch (error) {
		console.error('Error sending message:', error);
		showToast('Error sending message. Please try again.', 'error');
	} finally {
		setTimeout(() => {
			messageInCooldown = false;
		}, COOLDOWN_MS);
	}
}
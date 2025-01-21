import { fetchAuthData } from '../user/fetchData.js';
import { isAuth } from './socket.js';

export const clientIdColors = {};

export const chatIconDots = `
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-chat-left-dots-fill chat-icon-dots" viewBox="0 0 16 16">
	<path d="M0 2a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H4.414a1 1 0 0 0-.707.293L.854 15.146A.5.5 0 0 1 0 14.793zm5 4a1 1 0 1 0-2 0 1 1 0 0 0 2 0m4 0a1 1 0 1 0-2 0 1 1 0 0 0 2 0m3 1a1 1 0 1 0 0-2 1 1 0 0 0 0 2"/>
  </svg>
`;

export const chatIconFill = `
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-chat-left-fill chat-icon-fill" viewBox="0 0 16 16">
	<path d="M2 0a2 2 0 0 0-2 2v12.793a.5.5 0 0 0 .854.353l2.853-2.853A1 1 0 0 1 4.414 12H14a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2z"/>
  </svg>
`;

export function getRandomColor() {
	const hue = Math.floor(Math.random() * 360); // Random hue
	const saturation = 100; // Full saturation
	const lightness = 50; // 50% lightness for good contrast
	return `hsl(${hue}, ${saturation}%, ${lightness}%)`;
}

export function getColorForClientId(clientId) {
	if (!clientIdColors[clientId]) {
		clientIdColors[clientId] = getRandomColor();
	}
	return clientIdColors[clientId];
}

export function formatTimestamp(timestamp) {
	const userTimezone = moment.tz.guess();
	return moment(timestamp)
		.tz(userTimezone)
		.calendar(null, {
			sameDay: "HH:mm",
			lastDay: "[Yesterday]",
			lastWeek: function (now) {
				const daysAgo = Math.floor(moment.duration(now.diff(this)).asDays());
				return `[${daysAgo} days ago]`;
			},
			sameElse: function (now) {
				const daysAgo = Math.floor(moment.duration(now.diff(this)).asDays());
				return `[${daysAgo} days ago]`;
			},
		});
}

export function toggleChat() {
	const slidingDiv = document.getElementById("livechat");
	const chatIcon = document.querySelector("[data-chat-icon]");
	const messageInput = document.querySelector("#chat-message-input");

	slidingDiv.classList.toggle("visible");
	slidingDiv.classList.toggle("hide-children");
	slidingDiv.classList.toggle("disable-neon");

	chatIcon.innerHTML = slidingDiv.classList.contains("visible")
		? chatIconDots
		: chatIconFill;

	if (slidingDiv.classList.contains("visible")) {
		setTimeout(() => {
			messageInput.focus();
		}, 100);
	}
}

export async function isClientBlocked(clientId) {
	if (!isAuth) {
		return false;
	}
	try {
		const response = await fetchAuthData(`/user/block/check/nickname/${clientId}/`);
		if (response.status === 200) {
			return response.data.is_blocked;
		} else {
			console.error('Error checking block status:', response);
			return false;
		}
	} catch (error) {
		console.error('Error checking block status:', error);
		return false;
	}
}
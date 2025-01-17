import { fetchAuthData } from '../user/fetchData.js';

export const clientIdColors = {};

export const chatIconDots = `
  <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" fill="currentColor" class="bi bi-chat-left-dots-fill chat-icon-dots" viewBox="0 0 40 40">
    <path d="M0,5a5,5,0,0,1,5-5H35a5,5,0,0,1,5,5V25a5,5,0,0,1-5,5H11.035a2.5,2.5,0,0,0-1.767.733L2.135,37.865A1.25,1.25,0,0,1,0,36.983ZM12.5,15a2.5,2.5,0,1,0-5,0,2.5,2.5,0,0,0,5,0Zm10,0a2.5,2.5,0,1,0-5,0,2.5,2.5,0,0,0,5,0Zm7.5,2.5a2.5,2.5,0,1,0,0-5,2.5,2.5,0,0,0,0,5"/>
  </svg>
`;

export const chatIconFill = `
  <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" fill="currentColor" class="bi bi-chat-left-fill chat-icon-fill" viewBox="0 0 40 40">
    <path d="M5,0A5,5,0,0,0,0,5V36.983a1.25,1.25,0,0,0,2.135.883l7.133-7.133A2.5,2.5,0,0,1,11.035,30H35a5,5,0,0,0,5-5V5a5,5,0,0,0-5-5Z"/>
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

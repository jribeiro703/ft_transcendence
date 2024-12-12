import { fetchAuthData } from '../user/fetchData.js';
import { showToast } from '../user/tools.js';
import { isGamePageChat } from '../game/HistoryManager.js'
import gameVar from '../game/pong/var.js';

const chatSocket = new WebSocket(
  "wss://" + window.location.host + "/ws/livechat/",
);

export let gameChatSocket = null;

export function initializeGameChatSocket(roomNumber) {
	if (gameChatSocket) {
		gameChatSocket.close();
	}
	
	gameChatSocket = new WebSocket(
		`wss://${window.location.host}/ws/livechat/room_${roomNumber}/`
	);

	return gameChatSocket;
}

// Object to store clientId-color mappings
const clientIdColors = {};

// Function to generate a random, visible color
function getRandomColor() {
  const hue = Math.floor(Math.random() * 360); // Random hue
  const saturation = 100; // Full saturation
  const lightness = 50; // 50% lightness for good contrast
  return `hsl(${hue}, ${saturation}%, ${lightness}%)`;
}

// Function to get or assign a color for a clientId
function getColorForClientId(clientId) {
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

// Initialize all tooltips
document.addEventListener('DOMContentLoaded', function() {
  const tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
  const tooltipList = tooltipTriggerList.map(function (tooltipTriggerEl) {
	return new bootstrap.Tooltip(tooltipTriggerEl);
  });
});


chatSocket.onmessage = function (e) {
	const data = JSON.parse(e.data);
	const message = data.message;
	const clientId = data.client_id;
	const timestamp = data.timestamp;
	const chatLog = document.querySelector("#chat-log");
	const formattedTime = formatTimestamp(timestamp);
	const clientIdColor = getColorForClientId(clientId);

	// Create message components
	const messageElement = document.createElement("div");
	const timeSpan = document.createElement("span");
	timeSpan.textContent = `[${formattedTime}] `;
	timeSpan.style.color = clientIdColor;
  
	// Create nickname span with tooltip
	const nicknameSpan = document.createElement("span");
	nicknameSpan.textContent = `${clientId}: `;
	nicknameSpan.style.color = clientIdColor;
	nicknameSpan.style.cursor = 'pointer';

	// Initialize tooltip
	new bootstrap.Tooltip(nicknameSpan, {
	  html: true,
	  placement: 'right',
	  trigger: 'hover',
	  title: 'Loading...',
	  delay: { show: 500, hide: 100 },
	  template: '<div class="tooltip" role="tooltip"><div class="tooltip-inner"></div></div>'
	});
  
	// Add hover handler for tooltip content
	nicknameSpan.addEventListener('mouseenter', async function() {
	  const tooltip = bootstrap.Tooltip.getInstance(this);

	  try {
		const nicknameResponse = await fetchAuthData(`/user/get-id/?nickname=${clientId}`);

		if (nicknameResponse.status === 401) {
			throw new Error('Authentication required');
		}

		if (!nicknameResponse.data || !nicknameResponse.data.id) {
			throw new Error('User not found');
		}

		const userId = nicknameResponse.data.id;
		const content = await getUserTooltipContent(userId);
		tooltip.setContent({ '.tooltip-inner': content });
	} catch (error) {
		console.error('Error fetching user data:', error);
		if (error.message === 'Authentication required') {
			tooltip.setContent({ '.tooltip-inner': 'You must be logged in to see user data' });
		}
		else
		{
			tooltip.setContent({ '.tooltip-inner': 'Error loading user data' });
		}
	}
	});
  
	// Assemble message
	const messageText = document.createElement("span");
	messageText.textContent = message;
  
	messageElement.appendChild(timeSpan);
	messageElement.appendChild(nicknameSpan);
	messageElement.appendChild(messageText);
	
	chatLog.prepend(messageElement);
	chatLog.scrollTop = chatLog.scrollHeight;
};

chatSocket.onclose = function () {
  console.error("Chat socket closed unexpectedly");
};

document.querySelector("#chat-message-input").focus();
document.querySelector("#chat-message-input").onkeyup = async function (e) {
	if (e.keyCode === 13) {
	// Enter key
		if (!document.querySelector("#chat-log").classList.contains('d-none')) {
			await sendChatMessage(chatSocket, "#chat-message-input", "#chat-log");
		}
		else if (!document.querySelector("#gamechat").classList.contains('d-none')) {
			await sendChatMessage(gameChatSocket, "#chat-message-input", "#gamechat");
		}
	}
};

// Add an event listener on the focus of the chat message input and then listen to keyboard keypress and send submit when 'Enter' key is pressed
document.addEventListener("DOMContentLoaded", function () {
  const messageInput = document.querySelector("#chat-message-input");
  const messageSubmit = document.querySelector("#chat-message-submit");

  if (messageInput && messageSubmit) {
	messageInput.addEventListener("keypress", function (e) {
	  if (e.key === "Enter") {
		e.preventDefault(); // Empêche le comportement par défaut de la touche Entrée
		messageSubmit.click();
	  }
	});
  } else {
	console.error("Message input or submit button not found");
  }
});

document.querySelector("#chat-message-submit").onclick = async function () {
	if (!document.querySelector("#chat-log").classList.contains('d-none')) {
		await sendChatMessage(chatSocket, "#chat-message-input", "#chat-log");
	}
	else if (!document.querySelector("#gamechat").classList.contains('d-none')) {
		await sendChatMessage(gameChatSocket, "#chat-message-input", "#gamechat");
	}
};

async function sendChatMessage(socket, inputId, logId) {
  const messageInput = document.querySelector(inputId);
  let message = messageInput.value.trim();
  
  if (message === "") {
	return;
  }

  try {
	const response = await fetchAuthData('/user/check-auth/');
	
	if (response.status === 401) {
	  console.error('User not authenticated');
	  showToast("You must be logged in to use this feature.", "warning");
	  window.location.href = '/#login';
	  return;
	}

	let room = null;
	if (logId === "#gamechat" && gameChatSocket) {
		const roomMatch = gameChatSocket.url.match(/room_(\d+)/);
		if (roomMatch) {
			room = `room_${roomMatch[1]}`;
		}
	}

	socket.send(
	  JSON.stringify({
		message: message,
		token: sessionStorage.getItem('access_token'),
		room: room
	  })
	);
	
	messageInput.value = "";
	const chatLog = document.querySelector(logId);
	chatLog.scrollTop = chatLog.scrollHeight;

  } catch (error) {
	console.error('Error sending message:', error);
	alert('Error sending message. Please try again.');
  }
}

// Handle emoji selection
const emojiPicker = document.querySelector("#emoji-picker");
emojiPicker.addEventListener("emoji-click", (event) => {
  const messageInputDom = document.querySelector("#chat-message-input");
  messageInputDom.value += event.detail.unicode;
  messageInputDom.focus();
});

const emojiButton = document.querySelector("#emojiButton");
const emojiPickerContainer = document.querySelector("#emojiPickerContainer");

function adjustEmojiPickerHeight() {
  const chatLog = document.querySelector("#chat-log");
  const chatLogHeight = chatLog.clientHeight;
  const emojiPickerHeight = Math.min(chatLogHeight, 250); // Set max height to 300px
  emojiPicker.style.height = `${emojiPickerHeight}px`;
}

function adjustEmojiPickerWidth() {
  const chatLog = document.querySelector("#chat-log");
  const chatLogWidth = chatLog.clientWidth;
  const emojiPickerWidth = Math.min(chatLogWidth, 250); // Set max width to 300px
  emojiPicker.style.height = `${emojiPickerWidth}px`;
}

// Show emojiPickerContainer
emojiButton.addEventListener("click", () => {
  adjustEmojiPickerHeight();
  adjustEmojiPickerWidth();
  emojiPickerContainer.style.display =
	emojiPickerContainer.style.display == "block" ? "none" : "block";
});

// Hide emojiPickerContainer when clicking outside of it
document.addEventListener("click", (event) => {
  if (
	!emojiPickerContainer.contains(event.target) &&
	!emojiButton.contains(event.target)
  ) {
	emojiPickerContainer.style.display = "none";
  }
});

// Hide emojiPickerContainer when resizing the window
window.addEventListener("resize", () => {
  emojiPickerContainer.style.display = "none";
});



//GENERAL
document.addEventListener('DOMContentLoaded', function() {
  const bubbleButton = document.getElementById('bubbleButton');

  bubbleButton.addEventListener('click', function() {
	document.getElementById('chat-log').classList.remove('d-none');
	document.getElementById('friendlist').classList.add('d-none');
	document.getElementById('onlinelist').classList.add('d-none');
	document.getElementById('notificationlist').classList.add('d-none');
	document.getElementById('gamechat').classList.add('d-none');
  });
});
//GENERAL

//GAME
document.addEventListener('DOMContentLoaded', function() {
	const swordsButton = document.getElementById('swordsButton');
	const gameChat = document.getElementById('gamechat');
	let roomName = 'default';

	swordsButton.addEventListener('click', function() {
		const currentPage = window.location.hash || '';
		if (isGamePageChat(currentPage)) {
			document.getElementById('gamechat').classList.remove('d-none');
			document.getElementById('chat-log').classList.add('d-none');
			document.getElementById('friendlist').classList.add('d-none');
			document.getElementById('onlinelist').classList.add('d-none');
			document.getElementById('notificationlist').classList.add('d-none');
			gameChat.innerHTML = '';

			// Connect to game chat websocket if in a game room
			if (gameVar.gameSocket && gameVar.gameSocket.url) {
				const roomMatch = gameVar.gameSocket.url.match(/ws\/pong\/room_(\d+)/);
				if (roomMatch && roomMatch[1]) {
					const roomNumber = roomMatch[1];
					// Create new gamechat websocket with same room number
					gameChatSocket = initializeGameChatSocket(roomNumber);
				}
			}
		} 
		else {
			// Regular chat view
			document.getElementById('chat-log').classList.remove('d-none');
			document.getElementById('gamechat').classList.add('d-none');
			document.getElementById('friendlist').classList.add('d-none');
			document.getElementById('onlinelist').classList.add('d-none');
			document.getElementById('notificationlist').classList.add('d-none');
		}
	})
});

if (gameChatSocket) {
	gameChatSocket.onmessage = function(e) {
		const data = JSON.parse(e.data);
		const message = data.message;
		const clientId = data.client_id;
		const timestamp = data.timestamp;
		const gameChat = document.querySelector("#gamechat");
		const formattedTime = formatTimestamp(timestamp);
		const clientIdColor = getColorForClientId(clientId);

		// Create message components
		const messageElement = document.createElement("div");
		const timeSpan = document.createElement("span");
		timeSpan.textContent = `[${formattedTime}] `;
		timeSpan.style.color = clientIdColor;

		// Create nickname span with tooltip
		const nicknameSpan = document.createElement("span");
		nicknameSpan.textContent = `${clientId}: `;
		nicknameSpan.style.color = clientIdColor;
		nicknameSpan.style.cursor = 'pointer';

		// Initialize tooltip
		new bootstrap.Tooltip(nicknameSpan, {
			html: true,
			placement: 'right',
			trigger: 'hover',
			title: 'Loading...',
			delay: { show: 500, hide: 100 },
			template: '<div class="tooltip" role="tooltip"><div class="tooltip-inner"></div></div>'
		});

		// Add hover handler for tooltip content
		nicknameSpan.addEventListener('mouseenter', async function() {
			const tooltip = bootstrap.Tooltip.getInstance(this);

			try {
				const nicknameResponse = await fetchAuthData(`/user/get-id/?nickname=${clientId}`);

				if (nicknameResponse.status === 401) {
					throw new Error('Authentication required');
				}

				if (!nicknameResponse.data || !nicknameResponse.data.id) {
					throw new Error('User not found');
				}

				const userId = nicknameResponse.data.id;
				const content = await getUserTooltipContent(userId);
				tooltip.setContent({ '.tooltip-inner': content });
			}
			catch (error) {
				console.error('Error fetching user data:', error);
				if (error.message === 'Authentication required') {
					tooltip.setContent({ '.tooltip-inner': 'You must be logged in to see user data' });
				}
				else
				{
					tooltip.setContent({ '.tooltip-inner': 'Error loading user data' });
				}
			}
		});
		// Create message text
		const messageText = document.createElement('span');
		messageText.textContent = message;

		// Assemble message
		messageElement.appendChild(timeSpan);
		messageElement.appendChild(nicknameSpan);
		messageElement.appendChild(messageText);

		gameChat.prepend(messageElement);
		gameChat.scrollTop = gameChat.scrollHeight;
	}
};

if (gameChatSocket) {
	gameChatSocket.onopen = function() {
		console.log('Game chat socket connected for room:', roomNumber);
	}
};
	
if (gameChatSocket) {
	gameChatSocket.onerror = function(error) {
		console.error('Game chat socket error:', error);
	}
};
	
if (gameChatSocket) {
	gameChatSocket.onclose = function() {
		console.error("Game chat socket closed unexpectedly");
	}
};

// document.querySelector("#chat-message-submit").onclick = async function () {
// 	if (!document.querySelector("#gamechat").classList.contains('d-none')) {
// 		await sendChatMessage(gameChatSocket, "#chat-message-input", "#gamechat");
// 	}
// };

// document.querySelector("#chat-message-input").onkeyup = function (e) {
// 	if (e.keyCode === 13) {
// 	// Enter key
// 		if (!document.querySelector("#gamechat").classList.contains('d-none')) {
// 			document.querySelector("#chat-message-submit").click();
// 		}
// 	}
// };
//GAME

//NOTIFICATIONS

document.addEventListener('DOMContentLoaded', function() {
  const notificationButton = document.getElementById('notificationButton');
  const chatLog = document.getElementById('notificationlist');

  notificationButton.addEventListener('click', async function() {
	document.getElementById('notificationlist').classList.remove('d-none');
	document.getElementById('friendlist').classList.add('d-none');
	document.getElementById('onlinelist').classList.add('d-none');
	document.getElementById('chat-log').classList.add('d-none');
	
	chatLog.innerHTML = '';
	const loadingDiv = document.createElement('div');
	loadingDiv.textContent = 'Loading notifications...';
	chatLog.appendChild(loadingDiv);

	// Mock notifications
	const notifications = [
	  {
		id: 1,
		type: 'friend_request',
		from: 'user1',
		message: 'sent you a friend request',
		timestamp: '2h ago'
	  },
	  {
		id: 2,
		type: 'game_invite',
		from: 'user2',
		message: 'invited you to play Pong',
		timestamp: '5h ago'
	  },
	  {
		id: 3,
		type: 'tournament',
		from: 'System',
		message: 'Tournament starting in 10 minutes',
		timestamp: '1d ago'
	  }
	];

	const notificationListContainer = document.createElement('div');
	notificationListContainer.className = 'notification-list';

	if (notifications.length === 0) {
	  notificationListContainer.innerHTML = '<div class="text-muted">No notifications yet</div>';
	} else {
	  notifications.forEach(notification => {
		const notificationDiv = document.createElement('div');
		notificationDiv.className = 'notification-item d-flex align-items-center gap-2 p-2 border rounded mb-2';
		
		const iconSpan = document.createElement('span');
		iconSpan.className = 'notification-icon';
		iconSpan.innerHTML = notification.type === 'friend_request' ? '👥' : 
							notification.type === 'game_invite' ? '🎮' : '🏆';
		
		const contentDiv = document.createElement('div');
		contentDiv.className = 'flex-grow-1';
		contentDiv.innerHTML = `
		  <div><strong>${notification.from}</strong> ${notification.message}</div>
		  <small class="text-muted">${notification.timestamp}</small>
		`;
		
		notificationDiv.appendChild(iconSpan);
		notificationDiv.appendChild(contentDiv);
		notificationListContainer.appendChild(notificationDiv);
	  });
	}

	chatLog.innerHTML = '';
	chatLog.appendChild(notificationListContainer);
  });
});
//NOTIFICATIONS

// FRIENDS
document.addEventListener('DOMContentLoaded', function() {
  const friendsButton = document.getElementById('friendsButton');
  const chatLog = document.getElementById('friendlist');

  friendsButton.addEventListener('click', async function() {
	document.getElementById('friendlist').classList.remove('d-none');
	document.getElementById('onlinelist').classList.add('d-none');
	document.getElementById('chat-log').classList.add('d-none');
	document.getElementById('notificationlist').classList.add('d-none');
	
	chatLog.innerHTML = '';
	const loadingDiv = document.createElement('div');
	loadingDiv.textContent = 'Loading friends...';
	chatLog.appendChild(loadingDiv);

	try {
	  const responseObject = await fetchAuthData('/user/friends/');
	  
	  if (responseObject.status === 401) {
		showToast("You must be logged in to see friends", "warning");
		loadingDiv.textContent = 'You must be logged in to see your friends';
		loadingDiv.classList.add('text-danger');
		window.location.href = '/#login';
		return;
	  }

	  const friends = responseObject.data;
	  chatLog.innerHTML = '';

	  const friendsListContainer = document.createElement('div');
	  friendsListContainer.className = 'friends-list';

	  if (friends.length === 0) {
		friendsListContainer.innerHTML = '<div class="text-muted">No friends yet</div>';
	  } else {
		friends.forEach(friend => {
		  const friendDiv = createUserListItem(friend, 'friend-item');
		  friendsListContainer.appendChild(friendDiv);
		});
	  }

	  chatLog.appendChild(friendsListContainer);
	} catch (error) {
	  console.error('Error fetching friends:', error);
	  showToast("Error loading friends list", "error");
	  chatLog.innerHTML = '<div class="text-danger p-3">Error loading friends list. Please try again.</div>';
	}
  });
});

// ONLINE
document.addEventListener('DOMContentLoaded', function() {
  const onlineButton = document.getElementById('onlineButton');
  const chatLog = document.getElementById('onlinelist');

  onlineButton.addEventListener('click', async function() {
	document.getElementById('onlinelist').classList.remove('d-none');
	document.getElementById('chat-log').classList.add('d-none');
	document.getElementById('friendlist').classList.add('d-none');
	document.getElementById('notificationlist').classList.add('d-none');
	
	chatLog.innerHTML = '';
	const loadingDiv = document.createElement('div');
	loadingDiv.textContent = 'Loading online users...';
	chatLog.appendChild(loadingDiv);

	try {
	  const responseObject = await fetchAuthData('/user/online/');
	  
	  if (responseObject.status === 401) {
		showToast("You must be logged in to see online users", "warning");
		loadingDiv.textContent = 'You must be logged in to see online users';
		loadingDiv.classList.add('text-danger');
		window.location.href = '/#login';
		return;
	  }

	  const online = responseObject.data;
	  chatLog.innerHTML = '';

	  const onlineListContainer = document.createElement('div');
	  onlineListContainer.className = 'online-list';

	  if (online.length === 0) {
		onlineListContainer.innerHTML = '<div class="text-muted">No online players</div>';
	  } else {
		online.forEach(user => {
		  const onlineDiv = createUserListItem(user, 'online-item');
		  onlineListContainer.appendChild(onlineDiv);
		});
	  }

	  chatLog.appendChild(onlineListContainer);
	} catch (error) {
	  console.error('Error fetching online users:', error);
	  showToast("Error loading online users list", "error");
	  chatLog.innerHTML = '<div class="text-danger p-3">Error loading online users. Please try again.</div>';
	}
  });
});


// Add CSS styles
const styles = `
.friends-list, .online-list, .notification-list {
  width: 100%;
}

.friend-item, .online-item, .notification-item {
  cursor: pointer;
  transition: background-color 0.2s;
}

.friend-item:hover, .online-item:hover, .notification-item:hover {
  background-color: rgba(255, 255, 255, 0.1);
}

.status-dot {
  font-size: 0.8em;
}
`;

// Add styles to document
const styleSheet = document.createElement("style");
styleSheet.textContent = styles;
document.head.appendChild(styleSheet);

// Add function to create tooltip content

async function getUserTooltipContent(userId) {
  try {
	const responseObject = await fetchAuthData(`/user/profile/${userId}/`);

	if (!responseObject.status === 401) {
	  throw new Error('Authentication required');
	}

	const userData = responseObject.data;
	return `
	  <div class="user-tooltip p-2">
		<div class="d-flex align-items-center gap-2 mb-2">
		  <img src="${userData?.avatar || '/static/default-avatar.jpg'}" alt="avatar" width="32" height="32" class="rounded-circle">
		  <strong>${userData?.username || 'Unknown'}</strong>
		  ${userData?.alias ? `(${userData.alias})` : ''}
		</div>
		<div class="stats small">
		  <div>Total matches: ${userData?.total_matches || 0}</div>
		  <div>Won matches: ${userData?.won_matches || 0}</div>
		</div>
		${userData?.match_history?.length > 0 ? `
		  <div class="match-history small mt-2">
			<div>Last match: ${userData.match_history[0].score}</div>
		  </div>
		` : ''}
	  </div>
	`;
  } catch (error) {
	console.error('Error fetching user data:', error);
	return 'Error loading user data';
  }
}

// Update friend/online item creation
function createUserListItem(user, itemClass) {
  const itemDiv = document.createElement('div');
  itemDiv.className = `${itemClass} d-flex align-items-center gap-2 p-2 border rounded`;
  itemDiv.dataset.userId = user.id;
  
  // Initialize Bootstrap tooltip
  const tooltip = new bootstrap.Tooltip(itemDiv, {
	html: true,
	placement: 'right',
	trigger: 'hover',
	title: 'Loading...',
	delay: { show: 500, hide: 100 },
	template: '<div class="tooltip" role="tooltip"><div class="tooltip-inner"></div></div>'
  });

  // Update tooltip content on hover
  itemDiv.addEventListener('mouseenter', async function() {
	const content = await getUserTooltipContent(user.id);
	tooltip.setContent({ '.tooltip-inner': content });
  });

  const statusDot = document.createElement('span');
  statusDot.className = 'status-dot';
  statusDot.innerHTML = user.is_online ? '🟢' : '⚫';
  
  const nameSpan = document.createElement('span');
  nameSpan.textContent = user.username;
  
  itemDiv.appendChild(statusDot);
  itemDiv.appendChild(nameSpan);
  
  return itemDiv;
}

// Add tooltip styles
const tooltipStyles = `
.user-tooltip {
  max-width: 300px;
}

.tooltip-inner {
  max-width: 300px;
  background-color: var(--chat-bg);
  border: 1px solid var(--highlight-color);
}

.tooltip.bs-tooltip-end .tooltip-arrow::before {
  border-right-color: var(--highlight-color);
}
`;

styleSheet.textContent += tooltipStyles;





























///////////////////////////////////////////////////////////////////////////////
//////////////////////////////// David add ////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////
document.addEventListener("DOMContentLoaded", function () {
  const grandparent = document.getElementById("livechat");
  const focusableElements = [
	"emojiButton",
	"chat-message-input",
	"chat-message-submit",
  ];

  focusableElements.forEach((id) => {
	const element = document.getElementById(id);
	if (element) {
	  element.addEventListener("focus", function () {
		grandparent.classList.add("livechat-neon-focus");
	  });

	  element.addEventListener("blur", function () {
		grandparent.classList.remove("livechat-neon-focus");
	  });
	}
  });
});

// test qui disparait dans le focus de lindex ou on ecrit
document.addEventListener("DOMContentLoaded", function () {
  const messageInput = document.querySelector("#chat-message-input");

  if (messageInput) {
	messageInput.addEventListener("focus", function () {
	  messageInput.placeholder = "";
	});

	messageInput.addEventListener("blur", function () {
	  messageInput.placeholder = "Type here...";
	});
  } else {
	console.error("Message input not found");
  }
});

// liste des icons SVG
const homeIconSvg = `
<svg xmlns="http://www.w3.org/2000/svg" class="ionicon chat-icon-fill" viewBox="0 0 512 512" fill="currentColor">
	<path d="M261.56 101.28a8 8 0 00-11.06 0L66.4 277.15a8 8 0 00-2.47 5.79L63.9 448a32 32 0 0032 32H192a16 16 0 0016-16V328a8 8 0 018-8h80a8 8 0 018 8v136a16 16 0 0016 16h96.06a32 32 0 0032-32V282.94a8 8 0 00-2.47-5.79z"/>
	<path d="M490.91 244.15l-74.8-71.56V64a16 16 0 00-16-16h-48a16 16 0 00-16 16v32l-57.92-55.38C272.77 35.14 264.71 32 256 32c-8.68 0-16.72 3.14-22.14 8.63l-212.7 203.5c-6.22 6-7 15.87-1.34 22.37A16 16 0 0043 267.56L250.5 69.28a8 8 0 0111.06 0l207.52 198.28a16 16 0 0022.59-.44c6.14-6.36 5.63-16.86-.76-22.97z"/>
</svg>
`;

const profileIconSvg = `
<svg xmlns="http://www.w3.org/2000/svg" class="chat-icon-fill" viewBox="0 0 512 512" fill="currentColor">
	<title>Profile</title>
	<g id="Profile">
		<g id="Profile-2" data-name="Profile">
			<path d="M256,73.8247a182.1753,182.1753,0,1,0,182.18,182.18A182.1767,182.1767,0,0,0,256,73.8247Zm0,71.8335a55.05,55.05,0,1,1-55.0538,55.0458A55.0458,55.0458,0,0,1,256,145.6582Zm.5193,208.7226H175.6682c0-54.2547,29.5218-73.5732,48.8845-90.9054a65.68,65.68,0,0,0,62.8856,0c19.3626,17.3322,48.8844,36.6507,48.8844,90.9054Z"/>
		</g>
	</g>
</svg>
`;

const chatIconDots = `
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-chat-left-dots-fill chat-icon-dots" viewBox="0 0 16 16">
	<path d="M0 2a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H4.414a1 1 0 0 0-.707.293L.854 15.146A.5.5 0 0 1 0 14.793zm5 4a1 1 0 1 0-2 0 1 1 0 0 0 2 0m4 0a1 1 0 1 0-2 0 1 1 0 0 0 2 0m3 1a1 1 0 1 0 0-2 1 1 0 0 0 0 2"/>
  </svg>
`;

const chatIconFill = `
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-chat-left-fill chat-icon-fill" viewBox="0 0 16 16">
	<path d="M2 0a2 2 0 0 0-2 2v12.793a.5.5 0 0 0 .854.353l2.853-2.853A1 1 0 0 1 4.414 12H14a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2z"/>
  </svg>
`;

// ajoute les icons dans le html
document.addEventListener("DOMContentLoaded", function () {
  const chatIcon = document.querySelector("[data-chat-icon]");
  chatIcon.innerHTML = chatIconFill;
  chatIcon.setAttribute("tabindex", "0");
});

document.addEventListener("DOMContentLoaded", function () {
  console.log("consol log homeiconsvg", homeIconSvg);
  const homeIcon = document.querySelector("[data-home-icon]");
  homeIcon.innerHTML = homeIconSvg;
  homeIcon.setAttribute("tabindex", "0");
});

document.addEventListener("DOMContentLoaded", function () {
  const profileIcon = document.querySelector("[data-profile-icon]");
  profileIcon.innerHTML = profileIconSvg;
  profileIcon.setAttribute("tabindex", "0");
});

// slide le livechat avec focus touche entrer + clic souris
function toggleChat() {
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

document
  .querySelector("[data-chat-icon]")
  .addEventListener("click", toggleChat);

// can click with enter
document.addEventListener("DOMContentLoaded", function () {
  const homeIcon = document.querySelector("[data-home-icon]");
  const profileIcon = document.querySelector("[data-profile-icon]");
  const chatIcon = document.querySelector("[data-chat-icon]");

  if (homeIcon) {
	homeIcon.setAttribute("tabindex", "0");
	homeIcon.addEventListener("keydown", function (event) {
	  if (event.key === "Enter") {
		homeIcon.click();
	  }
	});
  }

  if (profileIcon) {
	profileIcon.setAttribute("tabindex", "0");
	profileIcon.addEventListener("keydown", function (event) {
	  if (event.key === "Enter") {
		profileIcon.click();
	  }
	});
  }

  if (chatIcon) {
	chatIcon.setAttribute("tabindex", "0");
	chatIcon.addEventListener("keydown", function (event) {
	  if (event.key === "Enter") {
		toggleChat();
	  }
	});
  }
});

// rend jolie apres avoir cliqué a la souris
document.addEventListener("mousedown", function (event) {
  const focusableSelectors = [
	"button",
	"[data-chat-icon]",
	"[data-home-icon]",
	"[data-profile-icon]",
	"#chat-message-submit",
	"#emojiButton",
  ];

  const target = event.target;

  if (
	target.matches(focusableSelectors) ||
	target.closest(focusableSelectors)
  ) {
	requestAnimationFrame(() => {
	  if (document.activeElement) {
		document.activeElement.blur();
	  }
	});
  }
});

// tab trap
document.addEventListener("DOMContentLoaded", function () {
  const focusableSelectors = [
	"button",
	"[href]",
	"input",
	"select",
	"textarea",
	'[tabindex]:not([tabindex="-1"])',
	"[data-chat-icon]",
	"[data-home-icon]",
	"[data-profile-icon]",
	"#chat-message-input",
	"#chat-message-submit",
	"#emojiButton",
  ].join(", ");

  const getFocusableElements = () => {
	return Array.from(document.querySelectorAll(focusableSelectors)).filter(
	  (element) => {
		return (
		  element.offsetParent !== null &&
		  !element.disabled &&
		  getComputedStyle(element).display !== "none"
		);
	  },
	);
  };

  document.addEventListener("keydown", function (e) {
	if (e.key === "Tab") {
	  const focusableElements = getFocusableElements();

	  if (focusableElements.length === 0) return;

	  const firstElement = focusableElements[0];
	  const lastElement = focusableElements[focusableElements.length - 1];
	  const activeElement = document.activeElement;

	  if (e.shiftKey) {
		if (activeElement === firstElement) {
		  e.preventDefault();
		  lastElement.focus();
		}
	  } else {
		if (activeElement === lastElement) {
		  e.preventDefault();
		  firstElement.focus();
		}
	  }
	}
  });
});
import { fetchAuthData } from '../user/fetchData.js';
import { getUserTooltipContent } from './tooltip.js';
import { showToast } from '../user/tools.js';
import { createPrivateRoom } from '../game/pong/room.js';

function createUserInfo(user) {
	const userInfoDiv = document.createElement('div');
	userInfoDiv.className = 'd-flex align-items-center gap-2';

	const statusDot = document.createElement('span');
	statusDot.className = 'status-dot';
	statusDot.innerHTML = user.is_online ? '🟢' : '⚫';

	const nameSpan = document.createElement('span');
	nameSpan.textContent = user.username;

	userInfoDiv.appendChild(statusDot);
	userInfoDiv.appendChild(nameSpan);

	return userInfoDiv;
}

async function handleFriendAction(user, button, itemDiv, isFriend) {
	const action = isFriend ? 'remove' : 'add';
	const response = await fetchAuthData(`/user/friends/${action}/${user.id}/`, 'POST');
	if (response.status === 200) {
		isFriend = !isFriend;
		button.innerHTML = isFriend ? '👥 ❌' : '👥 ➕';
		button.title = isFriend ? 'Remove friend' : 'Add friend';
		showToast(response.data.message, 'success');
		if (!isFriend && itemDiv.classList.contains("friend-item")) {
			const tooltipInstance = bootstrap.Tooltip.getInstance(itemDiv);
			if (tooltipInstance) {
				tooltipInstance.dispose();
			}
			itemDiv.remove();
		}
	}
	return isFriend;
}

function createFriendButton(user, itemDiv) {
	const button = document.createElement('button');
	button.className = 'btn btn-xs btn-outline-primary';
	let isFriend = user.is_friend;

	button.innerHTML = isFriend ? '👥 ❌' : '👥 ➕';
	button.title = isFriend ? 'Remove friend' : 'Add friend';
	button.style.padding = '0.1rem 0.1rem';
	button.style.fontSize = '0.75rem';

	button.addEventListener('click', async (e) => {
		e.stopPropagation();
		try {
			isFriend = await handleFriendAction(user, button, itemDiv, isFriend);
		} catch (error) {
			console.error('Error updating friend status:', error);
			showToast('Error updating friend status', 'error');
		}
	});

	return { button, isFriend };
}

async function handleBlockAction(user, button, friendButton, isBlocked) {
	const action = isBlocked ? 'remove' : 'add';
	const response = await fetchAuthData(`/user/block/${action}/${user.id}/`, 'POST');
	if (response.status === 200) {
		isBlocked = !isBlocked;
		button.innerHTML = isBlocked ? '❎️' : '🚫';
		button.title = isBlocked ? 'Unblock user' : 'Block user';
		if (!isBlocked) {
			// Remove d-none class from messages in #chat-log
			const chatLog = document.querySelector("#chat-log");
			const messages = chatLog.querySelectorAll('div');
			messages.forEach(message => {
				const nicknameSpan = message.querySelector('span:nth-child(2)');
				if (nicknameSpan && nicknameSpan.textContent.trim() === `${user.username}:`) {
					message.classList.remove("d-none");
				}
			});
		}
		if (isBlocked) {
			// Remove d-none class from messages in #chat-log
			const chatLog = document.querySelector("#chat-log");
			const messages = chatLog.querySelectorAll('div');
			messages.forEach(message => {
				const nicknameSpan = message.querySelector('span:nth-child(2)');
				if (nicknameSpan && nicknameSpan.textContent.trim() === `${user.username}:`) {
					message.classList.add("d-none");
				}
			});
		}
		showToast(response.data.message, 'success');
		if (friendButton) {
			friendButton.click();
		}
	}
	return isBlocked;
}

function createBlockButton(user, friendButton) {
	const button = document.createElement('button');
	button.className = 'btn btn-xs btn-outline-danger';
	let isBlocked = user.is_blocked;

	button.innerHTML = isBlocked ? '❎️' : '🚫';
	button.title = isBlocked ? 'Unblock user' : 'Block user';
	button.style.padding = '0.1rem 0.1rem';
	button.style.fontSize = '0.75rem';

	button.addEventListener('click', async (e) => {
		e.stopPropagation();
		try {
			isBlocked = await handleBlockAction(user, button, friendButton, isBlocked);
		} catch (error) {
			console.error('Error updating block status:', error);
			showToast('Error updating block status', 'error');
		}
	});

	return button;
}

function createGameButton(user) {
	const button = document.createElement('button');
	button.className = 'btn btn-xs btn-outline-success';
	button.innerHTML = '⚔️';
	button.title = 'Invite to game';
	button.style.padding = '0.1rem 0.1rem';
	button.style.fontSize = '0.75rem';

	button.addEventListener('click', async (e) => {
		// const roomName = createPrivateRoom();
		// console.log(roomName);
		e.stopPropagation();
		try {
			const response = await fetchAuthData(`/user/game/invite/${user.id}/`, 'POST');
			if (response.status === 200) {
				showToast('Game invitation sent!', 'success');
			}
		} catch (error) {
			console.error('Error sending game invitation:', error);
			showToast('Error sending game invitation', 'error');
		}
	});

	return button;
}

function initializeTooltip(itemDiv, user) {
	const tooltip = new bootstrap.Tooltip(itemDiv, {
		html: true,
		placement: 'right',
		trigger: 'hover',
		title: 'Loading...',
		delay: { show: 500, hide: 100 },
		template: '<div class="tooltip" role="tooltip"><div class="tooltip-inner"></div></div>'
	});

	itemDiv.addEventListener('mouseenter', async function () {
		const content = await getUserTooltipContent(user.id);
		tooltip.setContent({ '.tooltip-inner': content });
	});

	return tooltip;
}

export function createUserListItem(user, itemClass) {
	const itemDiv = document.createElement('div');
	itemDiv.className = `${itemClass} d-flex align-items-center justify-content-between gap-2 p-2 border rounded`;
	itemDiv.dataset.userId = user.id;

	const userInfoDiv = createUserInfo(user);

	const buttonsDiv = document.createElement('div');
	buttonsDiv.className = 'd-flex gap-2';

	const { button: friendButton, isFriend } = createFriendButton(user, itemDiv);
	const blockButton = createBlockButton(user, isFriend ? friendButton : null);
	const inviteButton = createGameButton(user);

	buttonsDiv.appendChild(friendButton);
	buttonsDiv.appendChild(blockButton);
	buttonsDiv.appendChild(inviteButton);

	initializeTooltip(itemDiv, user);

	itemDiv.appendChild(userInfoDiv);
	itemDiv.appendChild(buttonsDiv);

	return itemDiv;
}
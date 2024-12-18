import { fetchAuthData } from '../user/fetchData.js';
import { createUserListItem } from './userItem.js';
import { showToast } from '../user/tools.js';
import { renderPage } from '../user/historyManager.js';

document.addEventListener('DOMContentLoaded', function () {
	const friendsButton = document.getElementById('friendsButton');
	const chatLog = document.getElementById('friendlist');

	friendsButton.addEventListener('click', async function () {
		showFriendList(chatLog);
	});
});

async function showFriendList(chatLog) {
	document.getElementById('friendlist').classList.remove('d-none');
	document.getElementById('onlinelist').classList.add('d-none');
	document.getElementById('chat-log').classList.add('d-none');
	document.getElementById('notificationlist').classList.add('d-none');

	chatLog.innerHTML = '';
	const loadingDiv = document.createElement('div');
	loadingDiv.textContent = 'Loading friends...';
	chatLog.appendChild(loadingDiv);

	try {
		const friends = await loadFriends();
		displayFriends(chatLog, friends);
	} catch (error) {
		handleError(chatLog, error);
	}
}

async function loadFriends() {
	const responseObject = await fetchAuthData('/user/friends/');

	if (responseObject.status === 401) {
		showToast("You must be logged in to see friends", "warning");
		renderPage("auth", true);
		throw new Error('Unauthorized');
	}

	return responseObject.data;
}

function displayFriends(chatLog, friends) {
	chatLog.innerHTML = '';

	const friendsListContainer = document.createElement('div');
	friendsListContainer.className = 'friends-list';

	if (friends.length === 0) {
		friendsListContainer.innerHTML = '<div class="text-muted">No friends yet</div>';
	} else {
		friends.forEach(friend => {
			const friendDiv = createUserListItem(friend, 'friend-item', true, false);
			friendsListContainer.appendChild(friendDiv);
		});
	}

	chatLog.appendChild(friendsListContainer);
}

function handleError(chatLog, error) {
	console.error('Error fetching friends:', error);
	showToast("Error loading friends list", "error");
	chatLog.innerHTML = '<div class="text-danger p-3">Error loading friends list. Please try again.</div>';
}
import { fetchAuthData } from '../user/fetchData.js';
import { createUserListItem } from './userItem.js';
import { showToast } from '../user/tools.js';
import { renderPage } from '../user/historyManager.js';
import { isAuth } from './socket.js';

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
	let responseObject
	if (isAuth) {
		responseObject = await fetchAuthData('/user/friends/');
	}
	if (!isAuth || responseObject.status === 401) {
		showToast("You must be logged in to see your friends", "warning");
		throw new Error('Unauthorized');
	}

	return responseObject.data;
}

function displayFriends(chatLog, friends) {
	chatLog.innerHTML = '';
	const friendsListContainer = document.createElement('div');
	friendsListContainer.className = 'friends-list';

	if (friends.length === 0) {
		friendsListContainer.innerHTML = '<div class="text-muted">No friends yet.</div>';
	} else {
		friends.forEach(friend => {
			const friendDiv = createUserListItem(friend, 'friend-item');
			friendsListContainer.appendChild(friendDiv);
		});
	}
	chatLog.appendChild(friendsListContainer);
}

function handleError(chatLog, error) {
	renderPage("auth", true);
	chatLog.innerHTML = '<div class="text-danger">Error loading friends list.</div>';
}
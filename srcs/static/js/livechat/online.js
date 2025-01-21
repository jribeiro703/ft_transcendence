import { fetchAuthData } from '../user/fetchData.js';
import { createUserListItem } from './userItem.js'
import { showToast } from '../user/tools.js';
import { renderPage } from '../user/historyManager.js';

document.addEventListener('DOMContentLoaded', function () {
	const onlineButton = document.getElementById('onlineButton');
	const chatLog = document.getElementById('onlinelist');

	onlineButton.addEventListener('click', async function () {
		showOnlineList(chatLog);
	});
});

async function showOnlineList(chatLog) {
	document.getElementById('onlinelist').classList.remove('d-none');
	document.getElementById('chat-log').classList.add('d-none');
	document.getElementById('friendlist').classList.add('d-none');
	document.getElementById('notificationlist').classList.add('d-none');

	chatLog.innerHTML = '';
	const loadingDiv = document.createElement('div');
	loadingDiv.textContent = 'Loading online users...';
	chatLog.appendChild(loadingDiv);

	try {
		const online = await loadOnline();
		displayOnline(chatLog, online);
	} catch (error) {
		handleError(chatLog, error);
	}
}

async function loadOnline() {
	const responseObject = await fetchAuthData('/user/online/');

	if (responseObject.status === 401) {
		showToast("You must be logged in to see online users.", "warning");
		throw new Error('Unauthorized');
	}

	return responseObject.data;
}

function displayOnline(chatLog, online) {
	chatLog.innerHTML = '';
	const onlineListContainer = document.createElement('div');
	onlineListContainer.className = 'online-list';

	if (online.length === 0) {
		onlineListContainer.innerHTML = '<div class="text-muted">No online players.</div>';
	} else {
		online.forEach(online => {
			const onlineDiv = createUserListItem(online, 'online-item');
			onlineListContainer.appendChild(onlineDiv);
		});
	}
	chatLog.appendChild(onlineListContainer);
}

function handleError(chatLog, error) {
	renderPage("auth", true);
	chatLog.innerHTML = '<div class="text-danger">Error loading online users.</div>';
}

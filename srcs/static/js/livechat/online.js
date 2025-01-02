import { fetchAuthData } from '../user/fetchData.js';
import { createUserListItem } from './userItem.js'
import { showToast } from '../user/tools.js';

document.addEventListener('DOMContentLoaded', function () {
	const onlineButton = document.getElementById('onlineButton');
	const chatLog = document.getElementById('onlinelist');

	onlineButton.addEventListener('click', async function () {
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
				renderPage("auth", true);
				return;
			}

			const online = responseObject.data;
			chatLog.innerHTML = '';

			const onlineListContainer = document.createElement('div');
			onlineListContainer.className = 'online-list';

			if (online.length === 0) {
				onlineListContainer.innerHTML = '<div class="text-muted">No online players</div>';
			} else {
				online.forEach(online => {
					const onlineDiv = createUserListItem(online, 'online-item');
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


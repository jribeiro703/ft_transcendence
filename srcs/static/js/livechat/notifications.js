document.addEventListener('DOMContentLoaded', function () {
	const notificationButton = document.getElementById('notificationButton');
	const chatLog = document.getElementById('notificationlist');

	notificationButton.addEventListener('click', async function () {
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
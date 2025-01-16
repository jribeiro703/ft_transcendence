import { fetchAuthData } from '../user/fetchData.js';

// Update getUserId function to handle response structure
export async function getUserId() {
	try {
		const response = await fetchAuthData('/user/private/', 'GET');
		return response.data.id;
	} catch (error) {
		console.error('Error getting user ID:', error);
		throw error;
	}
}

// Update notification handling
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

		try {
			const userId = await getUserId();
			const response = await fetchAuthData(`/user/friends/${userId}/`, 'GET');
			const friendRequests = response.data;

			const notificationListContainer = document.createElement('div');
			notificationListContainer.className = 'notification-list';

			if (!friendRequests || (!friendRequests.received_requests?.length && !friendRequests.sent_requests?.length)) {
				notificationListContainer.innerHTML = '<div class="text-muted">No friend requests</div>';
			} else {
				// Handle received requests
				if (friendRequests.received_requests?.length > 0) {
					const receivedTitle = document.createElement('h6');
					receivedTitle.textContent = 'Received Requests';
					notificationListContainer.appendChild(receivedTitle);

					friendRequests.received_requests.forEach(async request => {
						const notificationDiv = document.createElement('div');
						notificationDiv.className = 'notification-item d-flex align-items-center gap-2 p-2 border rounded mb-2';
						notificationDiv.innerHTML = `
							<span class="notification-icon">👥</span>
							<div class="flex-grow-1">
								<div><strong>${request.sender}</strong> sent you a friend request</div>
								<div class="mt-2">
									<button class="btn btn-sm btn-success accept-request" data-id="${request.id}">Accept</button>
									<button class="btn btn-sm btn-danger reject-request" data-id="${request.id}">Reject</button>
									<div class="blocked-warning text-danger mt-2 d-none">This user is blocked</div>
								</div>
							</div>
						`;
						notificationListContainer.appendChild(notificationDiv);

						// Check if the sender is blocked
						try {
							const response = await fetchAuthData(`/user/block/check/nickname/${request.sender}/`);
							if (response.status === 200 && response.data.is_blocked) {
								notificationDiv.querySelector('.blocked-warning').classList.remove('d-none');
							}
						} catch (error) {
							console.error('Error checking block status:', error);
						}
					});
				}

				// Handle sent requests
				if (friendRequests.sent_requests?.length > 0) {
					const sentTitle = document.createElement('h6');
					sentTitle.textContent = 'Sent Requests';
					sentTitle.className = 'mt-3';
					notificationListContainer.appendChild(sentTitle);

					friendRequests.sent_requests.forEach(request => {
						const notificationDiv = document.createElement('div');
						notificationDiv.className = 'notification-item d-flex align-items-center gap-2 p-2 border rounded mb-2';
						notificationDiv.innerHTML = `
							<span class="notification-icon">📤</span>
							<div class="flex-grow-1">
								<div>Request sent to <strong>${request.receiver}</strong></div>
								<div class="mt-2">
									<button class="btn btn-sm btn-secondary cancel-request" data-id="${request.id}">Cancel</button>
								</div>
							</div>
						`;
						notificationListContainer.appendChild(notificationDiv);
					});
				}
			}

			chatLog.innerHTML = '';
			chatLog.appendChild(notificationListContainer);

		} catch (error) {
			chatLog.innerHTML = `<div class="text-danger">Error loading friend requests: ${error.message}</div>`;
		}
	});
});

// Add after the notification list creation code
document.addEventListener('click', async function(e) {
	if (e.target.classList.contains('accept-request')) {
		const requestId = e.target.dataset.id;
		try {
			console.log(requestId);
			await fetchAuthData(`/user/friends/accept/${requestId}/`, 'POST');
			// Remove the notification item after successful acceptance
			e.target.closest('.notification-item').remove();
			
			// If no more requests, show empty message
			if (document.querySelectorAll('.notification-item').length === 0) {
				document.querySelector('.notification-list').innerHTML = 
					'<div class="text-muted">No friend requests</div>';
			}
		} catch (error) {
			console.error('Error accepting friend request:', error);
			// Show error message
			const errorDiv = document.createElement('div');
			errorDiv.className = 'alert alert-danger mt-2';
			errorDiv.textContent = 'Failed to accept friend request';
			e.target.closest('.notification-item').appendChild(errorDiv);
		}
	}

	if (e.target.classList.contains('reject-request')) {
		const requestId = e.target.dataset.id;
		try {
			console.log(requestId);
			await fetchAuthData(`/user/friends/deny/${requestId}/`, 'POST');
			// Remove the notification item after successful rejection
			e.target.closest('.notification-item').remove();
			
			// If no more requests, show empty message
			if (document.querySelectorAll('.notification-item').length === 0) {
				document.querySelector('.notification-list').innerHTML = 
					'<div class="text-muted">No friend requests</div>';
			}
		} catch (error) {
			console.error('Error rejecting friend request:', error);
			// Show error message
			const errorDiv = document.createElement('div');
			errorDiv.className = 'alert alert-danger mt-2';
			errorDiv.textContent = 'Failed to reject friend request';
			e.target.closest('.notification-item').appendChild(errorDiv);
		}
	}

	if (e.target.classList.contains('cancel-request')) {
		const requestId = e.target.dataset.id;
		try {
			console.log(requestId);
			await fetchAuthData(`/user/friends/deny/${requestId}/`, 'POST');
			// Remove the notification item after successful cancellation
			e.target.closest('.notification-item').remove();
			
			// If no more requests, show empty message
			if (document.querySelectorAll('.notification-item').length === 0) {
				document.querySelector('.notification-list').innerHTML = 
					'<div class="text-muted">No friend requests</div>';
			}
		} catch (error) {
			console.error('Error canceling friend request:', error);
			// Show error message
			const errorDiv = document.createElement('div');
			errorDiv.className = 'alert alert-danger mt-2';
			errorDiv.textContent = 'Failed to cancel friend request';
			e.target.closest('.notification-item').appendChild(errorDiv);
		}
	}
});
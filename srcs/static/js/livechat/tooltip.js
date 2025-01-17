import { fetchAuthData } from '../user/fetchData.js';

document.addEventListener('DOMContentLoaded', function () {
	const tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
	const tooltipList = tooltipTriggerList.map(function (tooltipTriggerEl) {
		return new bootstrap.Tooltip(tooltipTriggerEl);
	});
});

export async function getUserTooltipContent(userId) {
	try {
		const responseObject = await fetchAuthData(`/user/profile-id/${userId}/`);

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

export function initializeTooltip(nicknameSpan, clientId) {
	new bootstrap.Tooltip(nicknameSpan, {
		html: true,
		placement: 'right',
		trigger: 'hover',
		title: 'Loading...',
		delay: { show: 500, hide: 100 },
		template: '<div class="tooltip" role="tooltip"><div class="tooltip-inner"></div></div>'
	});

	nicknameSpan.addEventListener('mouseenter', async function () {
		const tooltip = bootstrap.Tooltip.getInstance(this);
		await handleTooltipHover(tooltip, clientId);
	});
}

export async function handleTooltipHover(tooltip, clientId) {
	try {
		const nicknameResponse = await fetchAuthData(`/user/get-id/?nickname=${clientId}`);

		if (nicknameResponse.status === 401) {
			throw new Error('Authentication required');
		}

		if (!nicknameResponse.data || !nicknameResponse.data.id) {
			throw new Error('User not found');
		}

		const userId = nicknameResponse.data.id;
		const content = await getUserTooltipContent(clientId);
		tooltip.setContent({ '.tooltip-inner': content });
	} catch (error) {
		console.error('Error fetching user data:', error);
		if (error.message === 'Authentication required') {
			tooltip.setContent({ '.tooltip-inner': 'You must be logged in to see user data' });
		} else {
			tooltip.setContent({ '.tooltip-inner': 'Error loading user data' });
		}
	}
}
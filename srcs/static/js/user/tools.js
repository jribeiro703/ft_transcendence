import { API_BASE_URL, fetchData } from "./fetchData.js";
import { getIdFromJWT } from "./token.js";

const PONG_CARD = `${API_BASE_URL}/static/images/pong-game-card.png`;
const DEFAULT_AVATAR = `${API_BASE_URL}/static/images/default-avatar.jpg`;

function escapeHTML(unsafe) {
	if (typeof unsafe !== 'string') {
		console.log("escapeHTML(): unsafe !== 'string'");
        return '';
    }
    const map = {
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#039;'
    };
    return unsafe.replace(/[&<>"']/g, match => map[match]);
}

function showToast(message, type = 'warning') {
	const toast = document.createElement('div');
	toast.className = `toast toast-${type}`;
	toast.textContent = message;
	document.body.appendChild(toast);

	setTimeout(() => toast.classList.add('show'), 10);
	
	setTimeout(() => {
		toast.classList.remove('show');
		setTimeout(() => toast.remove(), 300);
	}, 3000);
}

async function updateUserAvatar() {
    const avatar = document.getElementById("user-avatar");
	const pk = getIdFromJWT(localStorage.getItem('access_token'));
	if (!pk) {
		console.warn("updateUserAvatar(): pk not found");
		avatar.src = DEFAULT_AVATAR;
		return;
	}
    try {
		const userData = await fetchData(`/user/settings/${pk}/`);
		if (!userData) {
			console.warn("updateUserAvatar(): get user data failed");
			avatar.src = DEFAULT_AVATAR;
			return;
		}
		const userAvatar = userData.data.avatar;
		const src = userAvatar.substring(userAvatar.indexOf('/media'));
		avatar.src = src;
    } catch (error) {
		console.error(`updateUserAvatar(): ${error}`);
		avatar.src = DEFAULT_AVATAR;
    }
}

export { escapeHTML, PONG_CARD, DEFAULT_AVATAR, showToast, updateUserAvatar };
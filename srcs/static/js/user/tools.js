import { API_BASE_URL, fetchAuthData } from "./fetchData.js";

const PONG_CARD = `${API_BASE_URL}/static/images/pong-game-card.png`;
const DEFAULT_AVATAR = `${API_BASE_URL}/static/images/default-avatar.jpg`;

function escapeHTML(unsafe) {
  if (typeof unsafe !== "string") {
    console.log("escapeHTML(): unsafe !== 'string'");
    return "";
  }
  const map = {
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#039;",
  };
  return unsafe.replace(/[&<>"']/g, (match) => map[match]);
}

function showToast(message, type = "warning") {
  const toast = document.createElement("div");
  toast.className = `toast toast-${type}`;
  toast.textContent = message;
  document.body.appendChild(toast);

  setTimeout(() => toast.classList.add("show"), 10);

  setTimeout(() => {
    toast.classList.remove("show");
    setTimeout(() => toast.remove(), 300);
  }, 3000);
}

async function updateUserAvatar(isAuthenticated) {
    const avatar = document.getElementById("user-avatar");
	if (!isAuthenticated) {
		avatar.src = DEFAULT_AVATAR;
		return;
	}
	const userData = await fetchAuthData("/user/private/", "GET", null, false);
	if (userData.status === 200) {
		const userAvatar = userData.data.avatar;
		const src = userAvatar.substring(userAvatar.indexOf('/media'));
		avatar.src = src;
	} else {
		avatar.src = DEFAULT_AVATAR;
	}
}

function showErrorMessages(responseObject) {
	const errorMessages = [];
	for (const field in responseObject.data) {
		if (Array.isArray(responseObject.data[field])) {
			errorMessages.push(`${field}: ${responseObject.data[field].join(', ')}`);
		}
		else {
			errorMessages.push(responseObject.data[field]);
		}
	}
	showToast(errorMessages.join('\n'), "error");
}

async function logout() {	
	try {
		const response = await fetchAuthData('/user/logout/', 'POST', null, false);
		if (response.status === 205) {
			// sessionStorage.clear();
			localStorage.clear();
			return true;
		}
		return false;
	} catch (error) {
		console.error('logout(): Error during logout:', error);
		throw error;
	}
}
export { escapeHTML, PONG_CARD, DEFAULT_AVATAR, showToast, updateUserAvatar, showErrorMessages, logout };
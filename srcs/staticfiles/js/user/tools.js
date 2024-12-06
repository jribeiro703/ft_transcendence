import { API_BASE_URL, fetchData } from "./fetchData.js";

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
  const avatar = document.querySelector("[data-profile-icon]");
  if (!isAuthenticated) {
    avatar.src = DEFAULT_AVATAR;
    return;
  }
  const userData = await fetchData(
    "/user/private/",
    "GET",
    null,
    false,
    "authenticated",
  );
  if (userData.status === 200) {
    const userAvatar = userData.data.avatar;
    const src = userAvatar.substring(userAvatar.indexOf("/media"));
    avatar.src = src;
  } else {
    avatar.src = DEFAULT_AVATAR;
  }
}

export { escapeHTML, PONG_CARD, DEFAULT_AVATAR, showToast, updateUserAvatar };


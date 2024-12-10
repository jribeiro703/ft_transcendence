const chatSocket = new WebSocket(
  "wss://" + window.location.host + "/ws/livechat/",
);

// Object to store clientId-color mappings
const clientIdColors = {};

// Function to generate a random, visible color
function getRandomColor() {
    const hue = Math.floor(Math.random() * 360); // Random hue
    const saturation = 100; // Full saturation
    const lightness = 50; // 50% lightness for good contrast
    return `hsl(${hue}, ${saturation}%, ${lightness}%)`;
}

// Function to get or assign a color for a clientId
function getColorForClientId(clientId) {
    if (!clientIdColors[clientId]) {
        clientIdColors[clientId] = getRandomColor();
    }
    return clientIdColors[clientId];
}

// Object to store clientId-color mappings
const clientIdColors = {};

// Function to generate a random, visible color
function getRandomColor() {
  const hue = Math.floor(Math.random() * 360); // Random hue
  const saturation = 100; // Full saturation
  const lightness = 50; // 50% lightness for good contrast
  return `hsl(${hue}, ${saturation}%, ${lightness}%)`;
}

// Function to get or assign a color for a clientId
function getColorForClientId(clientId) {
  if (!clientIdColors[clientId]) {
    clientIdColors[clientId] = getRandomColor();
  }
  return clientIdColors[clientId];
}

chatSocket.onmessage = function (e) {
  const data = JSON.parse(e.data);
  const message = data.message;
  const clientId = data.client_id;
  const timestamp = data.timestamp;
  const chatLog = document.querySelector("#chat-log");
  const userTimezone = moment.tz.guess();
  const formattedTime = moment(timestamp)
    .tz(userTimezone)
    .calendar(null, {
      sameDay: "HH:mm",
      lastDay: "[Yesterday]",
      lastWeek: function (now) {
        const daysAgo = Math.floor(moment.duration(now.diff(this)).asDays());
        return `[${daysAgo} days ago]`;
      },
      sameElse: function (now) {
        const daysAgo = Math.floor(moment.duration(now.diff(this)).asDays());
        return `[${daysAgo} days ago]`;
      },
    });

  // Get or assign a color for the clientId
  const clientIdColor = getColorForClientId(clientId);

  // Create a new message element
  const messageElement = document.createElement("div");
  messageElement.innerHTML = `<span style="color: ${clientIdColor};">[${formattedTime}] ${clientId}:</span> ${message}`;
  chatLog.prepend(messageElement);
  chatLog.scrollTop = chatLog.scrollHeight; // Scroll to the bottom
};

chatSocket.onclose = function () {
  console.error("Chat socket closed unexpectedly");
};

document.querySelector("#chat-message-input").focus();
document.querySelector("#chat-message-input").onkeyup = function (e) {
  if (e.keyCode === 13) {
    // Enter key
    document.querySelector("#chat-message-submit").click();
  }
};

// Add an event listener on the focus of the chat message input and then listen to keyboard keypress and send submit when 'Enter' key is pressed
document.addEventListener("DOMContentLoaded", function () {
  const messageInput = document.querySelector("#chat-message-input");
  const messageSubmit = document.querySelector("#chat-message-submit");

  if (messageInput && messageSubmit) {
    messageInput.addEventListener("keypress", function (e) {
      if (e.key === "Enter") {
        e.preventDefault(); // Empêche le comportement par défaut de la touche Entrée
        messageSubmit.click();
      }
    });
  } else {
    console.error("Message input or submit button not found");
  }
});

// protege des messages vides et envoi les messages
document.querySelector("#chat-message-submit").onclick = function () {
  const messageInputDom = document.querySelector("#chat-message-input");
  let message = messageInputDom.value.trim();
  if (message.toLowerCase().includes("david")) {
    message = message.replace(/david/gi, "Maitre David");
  }
  if (message === "") {
    return;
  }
  chatSocket.send(
    JSON.stringify({
      message: message,
      client_id: "client_id",
    }),
  );
  messageInputDom.value = "";
  const chatLog = document.querySelector("#chat-log");
  chatLog.scrollTop = chatLog.scrollHeight;
};

// Handle emoji selection
const emojiPicker = document.querySelector("#emoji-picker");
emojiPicker.addEventListener("emoji-click", (event) => {
  const messageInputDom = document.querySelector("#chat-message-input");
  messageInputDom.value += event.detail.unicode;
  messageInputDom.focus();
});

const emojiButton = document.querySelector("#emojiButton");
const emojiPickerContainer = document.querySelector("#emojiPickerContainer");

function adjustEmojiPickerHeight() {
  const chatLog = document.querySelector("#chat-log");
  const chatLogHeight = chatLog.clientHeight;
  const emojiPickerHeight = Math.min(chatLogHeight, 250); // Set max height to 300px
  emojiPicker.style.height = `${emojiPickerHeight}px`;
}

function adjustEmojiPickerWidth() {
  const chatLog = document.querySelector("#chat-log");
  const chatLogWidth = chatLog.clientWidth;
  const emojiPickerWidth = Math.min(chatLogWidth, 250); // Set max width to 300px
  emojiPicker.style.height = `${emojiPickerWidth}px`;
}

// Show emojiPickerContainer
emojiButton.addEventListener("click", () => {
  adjustEmojiPickerHeight();
  adjustEmojiPickerWidth();
  emojiPickerContainer.style.display =
    emojiPickerContainer.style.display == "block" ? "none" : "block";
});

// Hide emojiPickerContainer when clicking outside of it
document.addEventListener("click", (event) => {
  if (
    !emojiPickerContainer.contains(event.target) &&
    !emojiButton.contains(event.target)
  ) {
    emojiPickerContainer.style.display = "none";
  }
});

// Hide emojiPickerContainer when resizing the window
window.addEventListener("resize", () => {
  emojiPickerContainer.style.display = "none";
});

///////////////////////////////////////////////////////////////////////////////
//////////////////////////////// David add ////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////
document.addEventListener("DOMContentLoaded", function () {
  const grandparent = document.getElementById("livechat");
  const focusableElements = [
    "emojiButton",
    "chat-message-input",
    "chat-message-submit",
  ];

  focusableElements.forEach((id) => {
    const element = document.getElementById(id);
    if (element) {
      element.addEventListener("focus", function () {
        grandparent.classList.add("livechat-neon-focus");
      });

      element.addEventListener("blur", function () {
        grandparent.classList.remove("livechat-neon-focus");
      });
    }
  });
});

// test qui disparait dans le focus de lindex ou on ecrit
document.addEventListener("DOMContentLoaded", function () {
  const messageInput = document.querySelector("#chat-message-input");

  if (messageInput) {
    messageInput.addEventListener("focus", function () {
      messageInput.placeholder = "";
    });

    messageInput.addEventListener("blur", function () {
      messageInput.placeholder = "Type here...";
    });
  } else {
    console.error("Message input not found");
  }
});

// liste des icons SVG
const homeIconSvg = `
<svg xmlns="http://www.w3.org/2000/svg" class="ionicon chat-icon-fill" viewBox="0 0 512 512" fill="currentColor">
    <path d="M261.56 101.28a8 8 0 00-11.06 0L66.4 277.15a8 8 0 00-2.47 5.79L63.9 448a32 32 0 0032 32H192a16 16 0 0016-16V328a8 8 0 018-8h80a8 8 0 018 8v136a16 16 0 0016 16h96.06a32 32 0 0032-32V282.94a8 8 0 00-2.47-5.79z"/>
    <path d="M490.91 244.15l-74.8-71.56V64a16 16 0 00-16-16h-48a16 16 0 00-16 16v32l-57.92-55.38C272.77 35.14 264.71 32 256 32c-8.68 0-16.72 3.14-22.14 8.63l-212.7 203.5c-6.22 6-7 15.87-1.34 22.37A16 16 0 0043 267.56L250.5 69.28a8 8 0 0111.06 0l207.52 198.28a16 16 0 0022.59-.44c6.14-6.36 5.63-16.86-.76-22.97z"/>
</svg>
`;

const profileIconSvg = `
<svg xmlns="http://www.w3.org/2000/svg" class="chat-icon-fill" viewBox="0 0 512 512" fill="currentColor">
    <title>Profile</title>
    <g id="Profile">
        <g id="Profile-2" data-name="Profile">
            <path d="M256,73.8247a182.1753,182.1753,0,1,0,182.18,182.18A182.1767,182.1767,0,0,0,256,73.8247Zm0,71.8335a55.05,55.05,0,1,1-55.0538,55.0458A55.0458,55.0458,0,0,1,256,145.6582Zm.5193,208.7226H175.6682c0-54.2547,29.5218-73.5732,48.8845-90.9054a65.68,65.68,0,0,0,62.8856,0c19.3626,17.3322,48.8844,36.6507,48.8844,90.9054Z"/>
        </g>
    </g>
</svg>
`;

const chatIconDots = `
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-chat-left-dots-fill chat-icon-dots" viewBox="0 0 16 16">
    <path d="M0 2a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H4.414a1 1 0 0 0-.707.293L.854 15.146A.5.5 0 0 1 0 14.793zm5 4a1 1 0 1 0-2 0 1 1 0 0 0 2 0m4 0a1 1 0 1 0-2 0 1 1 0 0 0 2 0m3 1a1 1 0 1 0 0-2 1 1 0 0 0 0 2"/>
  </svg>
`;

const chatIconFill = `
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-chat-left-fill chat-icon-fill" viewBox="0 0 16 16">
    <path d="M2 0a2 2 0 0 0-2 2v12.793a.5.5 0 0 0 .854.353l2.853-2.853A1 1 0 0 1 4.414 12H14a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2z"/>
  </svg>
`;

// ajoute les icons dans le html
document.addEventListener("DOMContentLoaded", function () {
  const chatIcon = document.querySelector("[data-chat-icon]");
  chatIcon.innerHTML = chatIconFill;
  chatIcon.setAttribute("tabindex", "0");
});

document.addEventListener("DOMContentLoaded", function () {
  console.log("consol log homeiconsvg", homeIconSvg);
  const homeIcon = document.querySelector("[data-home-icon]");
  homeIcon.innerHTML = homeIconSvg;
  homeIcon.setAttribute("tabindex", "0");
});

document.addEventListener("DOMContentLoaded", function () {
  const profileIcon = document.querySelector("[data-profile-icon]");
  profileIcon.innerHTML = profileIconSvg;
  profileIcon.setAttribute("tabindex", "0");
});

// slide le livechat avec focus touche entrer + clic souris
function toggleChat() {
  const slidingDiv = document.getElementById("livechat");
  const chatIcon = document.querySelector("[data-chat-icon]");
  const messageInput = document.querySelector("#chat-message-input");

  slidingDiv.classList.toggle("visible");
  slidingDiv.classList.toggle("hide-children");
  slidingDiv.classList.toggle("disable-neon");

  chatIcon.innerHTML = slidingDiv.classList.contains("visible")
    ? chatIconDots
    : chatIconFill;

  if (slidingDiv.classList.contains("visible")) {
    setTimeout(() => {
      messageInput.focus();
    }, 100);
  }
}

document
  .querySelector("[data-chat-icon]")
  .addEventListener("click", toggleChat);

// can click with enter
document.addEventListener("DOMContentLoaded", function () {
  const homeIcon = document.querySelector("[data-home-icon]");
  const profileIcon = document.querySelector("[data-profile-icon]");
  const chatIcon = document.querySelector("[data-chat-icon]");

  if (homeIcon) {
    homeIcon.setAttribute("tabindex", "0");
    homeIcon.addEventListener("keydown", function (event) {
      if (event.key === "Enter") {
        homeIcon.click();
      }
    });
  }

  if (profileIcon) {
    profileIcon.setAttribute("tabindex", "0");
    profileIcon.addEventListener("keydown", function (event) {
      if (event.key === "Enter") {
        profileIcon.click();
      }
    });
  }

  if (chatIcon) {
    chatIcon.setAttribute("tabindex", "0");
    chatIcon.addEventListener("keydown", function (event) {
      if (event.key === "Enter") {
        toggleChat();
      }
    });
  }
});

// rend jolie apres avoir cliqué a la souris
document.addEventListener("mousedown", function (event) {
  const focusableSelectors = [
    "button",
    "[data-chat-icon]",
    "[data-home-icon]",
    "[data-profile-icon]",
    "#chat-message-submit",
    "#emojiButton",
  ];

  const target = event.target;

  if (
    target.matches(focusableSelectors) ||
    target.closest(focusableSelectors)
  ) {
    requestAnimationFrame(() => {
      if (document.activeElement) {
        document.activeElement.blur();
      }
    });
  }
});

// tab trap
document.addEventListener("DOMContentLoaded", function () {
  const focusableSelectors = [
    "button",
    "[href]",
    "input",
    "select",
    "textarea",
    '[tabindex]:not([tabindex="-1"])',
    "[data-chat-icon]",
    "[data-home-icon]",
    "[data-profile-icon]",
    "#chat-message-input",
    "#chat-message-submit",
    "#emojiButton",
  ].join(", ");

  const getFocusableElements = () => {
    return Array.from(document.querySelectorAll(focusableSelectors)).filter(
      (element) => {
        return (
          element.offsetParent !== null &&
          !element.disabled &&
          getComputedStyle(element).display !== "none"
        );
      },
    );
  };

  document.addEventListener("keydown", function (e) {
    if (e.key === "Tab") {
      const focusableElements = getFocusableElements();

      if (focusableElements.length === 0) return;

      const firstElement = focusableElements[0];
      const lastElement = focusableElements[focusableElements.length - 1];
      const activeElement = document.activeElement;

      if (e.shiftKey) {
        if (activeElement === firstElement) {
          e.preventDefault();
          lastElement.focus();
        }
      } else {
        if (activeElement === lastElement) {
          e.preventDefault();
          firstElement.focus();
        }
      }
    }
  });
});

// Initialize all tooltips
document.addEventListener('DOMContentLoaded', function() {
  const tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
  const tooltipList = tooltipTriggerList.map(function (tooltipTriggerEl) {
    return new bootstrap.Tooltip(tooltipTriggerEl);
  });
});

// Add to livechat.js
document.addEventListener('DOMContentLoaded', function() {
  const friendsButton = document.getElementById('friendsButton');
  const chatLog = document.getElementById('chat-log');

  friendsButton.addEventListener('click', async function() {
    chatLog.innerHTML = '';
    
    const loadingDiv = document.createElement('div');
    loadingDiv.textContent = 'Loading friends...';
    chatLog.appendChild(loadingDiv);

    try {
      let response = await fetch('/user/friends/', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('access_token')}`
        },
        credentials: 'include'
      });

      // Handle unauthorized response
      if (response.status === 401) {
        const newToken = await refreshAccessToken();
        response = await fetch('/user/friends/', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${newToken}`
          },
          credentials: 'include'
        });
      }

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const friends = await response.json();
      chatLog.innerHTML = '';

      const friendsListContainer = document.createElement('div');
      friendsListContainer.className = 'friends-list p-3';

      if (friends.length === 0) {
        friendsListContainer.innerHTML = '<div class="text-muted">No friends yet</div>';
      } else {
        friends.forEach(friend => {
          const friendDiv = document.createElement('div');
          friendDiv.className = 'friend-item d-flex align-items-center gap-2 mb-2 p-2 border rounded';
          
          const statusDot = document.createElement('span');
          statusDot.className = 'status-dot';
          statusDot.innerHTML = friend.is_online ? '🟢' : '⚫';
          
          const nameSpan = document.createElement('span');
          nameSpan.textContent = friend.username;
          
          friendDiv.appendChild(statusDot);
          friendDiv.appendChild(nameSpan);
          friendsListContainer.appendChild(friendDiv);
        });
      }

      chatLog.appendChild(friendsListContainer);
    } catch (error) {
      console.error('Error fetching friends:', error);
      chatLog.innerHTML = '<div class="text-danger p-3">Error loading friends list. Please try again.</div>';
    }
  });
});

// Add token refresh function at the top
async function refreshAccessToken() {
  try {
    const response = await fetch('/user/check-auth/token-refresh/', {
      method: 'GET',
      credentials: 'include'
    });
    
    if (!response.ok) {
      throw new Error('Token refresh failed');
    }
    
    const data = await response.json();
    localStorage.setItem('access_token', data.access_token);
    return data.access_token;
  } catch (error) {
    console.error('Token refresh failed:', error);
    window.location.href = '/#login';
    throw error;
  }
}

// Add CSS styles
const styles = `
.friends-list {
  width: 100%;
  padding-right: 80px;
}

.friend-item {
  cursor: pointer;
  transition: background-color 0.2s;
}

.friend-item:hover {
  background-color: rgba(255, 255, 255, 0.1);
}

.status-dot {
  font-size: 0.8em;
}
`;

// Add styles to document
const styleSheet = document.createElement("style");
styleSheet.textContent = styles;
document.head.appendChild(styleSheet);
const chatSocket = new WebSocket(
    'wss://' + window.location.host + '/ws/livechat/'
);

// Object to store clientId-color mappings
const clientIdColors = {};

// Function to generate a random, visible color
function getRandomColor() {
    const hue = Math.floor(Math.random() * 360); // Random hue
    const saturation = 100; // Full saturation
    const lightness = 30; // 50% lightness for good contrast
    return `hsl(${hue}, ${saturation}%, ${lightness}%)`;
}

// Function to get or assign a color for a clientId
function getColorForClientId(clientId) {
    if (!clientIdColors[clientId]) {
        clientIdColors[clientId] = getRandomColor();
    }
    return clientIdColors[clientId];
}

chatSocket.onmessage = function(e) {
    const data = JSON.parse(e.data);
    const message = data.message;
    const clientId = data.client_id;
    const timestamp = data.timestamp;
    const chatLog = document.querySelector('#chat-log');
    const userTimezone = moment.tz.guess();
    const formattedTime = moment(timestamp).tz(userTimezone).calendar(null, {
        sameDay: 'HH:mm',
        lastDay: '[Yesterday]',
        lastWeek: function (now) {
            const daysAgo = Math.floor(moment.duration(now.diff(this)).asDays());
            return `[${daysAgo} days ago]`;
        },
        sameElse: function (now) {
            const daysAgo = Math.floor(moment.duration(now.diff(this)).asDays());
            return `[${daysAgo} days ago]`;
        }
    });

    // Get or assign a color for the clientId
    const clientIdColor = getColorForClientId(clientId);

    // Create a new message element
    const messageElement = document.createElement('div');
    messageElement.innerHTML = `<span style="color: ${clientIdColor};">[${formattedTime}] ${clientId}:</span> ${message}`;
    chatLog.appendChild(messageElement);
    chatLog.scrollTop = chatLog.scrollHeight; // Scroll to the bottom
};

chatSocket.onclose = function(e) {
    console.error('Chat socket closed unexpectedly');
};

document.querySelector('#chat-message-input').focus();
document.querySelector('#chat-message-input').onkeyup = function(e) {
    if (e.keyCode === 13) {  // Enter key
        document.querySelector('#chat-message-submit').click();
    }
};

document.querySelector('#chat-message-submit').onclick = function(e) {
    const messageInputDom = document.querySelector('#chat-message-input');
    const message = messageInputDom.value;
    chatSocket.send(JSON.stringify({
        'message': message,
        'client_id': 'client_id'
    }));
    messageInputDom.value = '';
    const chatLog = document.querySelector('#chat-log');
    chatLog.scrollTop = chatLog.scrollHeight; // Scroll to the bottom
};

// Handle emoji selection
const emojiPicker = document.querySelector('#emoji-picker');
emojiPicker.addEventListener('emoji-click', event => {
    const messageInputDom = document.querySelector('#chat-message-input');
    messageInputDom.value += event.detail.unicode;
    messageInputDom.focus();
});

// Prevent dropdown from closing when interacting with the emoji picker
const emojiDropdown = document.querySelector('#emojiDropdown');
const emojiDropdownMenu = document.querySelector('.dropdown-menu');
emojiDropdownMenu.addEventListener('click', event => {
    event.stopPropagation();
});
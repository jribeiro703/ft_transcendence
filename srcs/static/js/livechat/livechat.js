const chatSocket = new WebSocket(
    'wss://' + window.location.host + '/ws/livechat/'
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
    chatLog.prepend(messageElement);
    chatLog.scrollTop = chatLog.scrollHeight; // Scroll to the bottom
};

chatSocket.onclose = function(e) {
    console.error('Chat socket closed unexpectedly');
};

document.querySelector('#chat-message-input').focus();
document.querySelector('#chat-message-input').onkeyup = function(e) {
    if (e.keyCode === 13) {  // Enter key
        document.querySelectoscrollHeightr('#chat-message-submit').click();
    }
};

// Add an event listener on the focus of the chat message input and then listen to keyboard keypress and send submit when 'Enter' key is pressed
document.addEventListener('DOMContentLoaded', function() {
    const messageInput = document.querySelector('#chat-message-input');
    const messageSubmit = document.querySelector('#chat-message-submit');

    if (messageInput && messageSubmit) {
        messageInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                e.preventDefault(); // Empêche le comportement par défaut de la touche Entrée
                messageSubmit.click();
            }
        });
    } else {
        console.error('Message input or submit button not found');
    }
});

// protege des messages vides et envoi les messages
document.querySelector('#chat-message-submit').onclick = function(e) {
    const messageInputDom = document.querySelector('#chat-message-input');
    let message = messageInputDom.value.trim();
    if (message.toLowerCase().includes("david")) {
        message = message.replace(/david/gi, "Maitre David");
    }
    if (message === "") {
        return;
    }
    chatSocket.send(JSON.stringify({
        'message': message,
        'client_id': 'client_id'
    }));
    messageInputDom.value = '';
    const chatLog = document.querySelector('#chat-log');
    chatLog.scrollTop = chatLog.scrollHeight;
};

// Handle emoji selection
const emojiPicker = document.querySelector('#emoji-picker');
emojiPicker.addEventListener('emoji-click', event => {
    const messageInputDom = document.querySelector('#chat-message-input');
    messageInputDom.value += event.detail.unicode;
    messageInputDom.focus();
});

const emojiButton = document.querySelector('#emojiButton');
const emojiPickerContainer = document.querySelector('#emojiPickerContainer');

function adjustEmojiPickerHeight() {
    const chatLog = document.querySelector('#chat-log');
    const chatLogHeight = chatLog.clientHeight;
    const emojiPickerHeight = Math.min(chatLogHeight, 250); // Set max height to 300px
    emojiPicker.style.height = `${emojiPickerHeight}px`;
}

function adjustEmojiPickerWidth() {
    const chatLog = document.querySelector('#chat-log');
    const chatLogWidth = chatLog.clientWidth;
    const emojiPickerWidth = Math.min(chatLogWidth, 250); // Set max width to 300px
    emojiPicker.style.height = `${emojiPickerWidth}px`;
}

// Show emojiPickerContainer
emojiButton.addEventListener('click', () => {
	adjustEmojiPickerHeight();
	adjustEmojiPickerWidth();
    emojiPickerContainer.style.display = emojiPickerContainer.style.display == 'block' ? 'none' : 'block';
});

// Hide emojiPickerContainer when clicking outside of it
document.addEventListener('click', (event) => {
    if (!emojiPickerContainer.contains(event.target) && !emojiButton.contains(event.target)) {
        emojiPickerContainer.style.display = 'none';
    }
});

// Hide emojiPickerContainer when resizing the window
window.addEventListener('resize', () => {
        emojiPickerContainer.style.display = 'none';
});

// David add //////////////////////////////////////////////////

document.addEventListener('DOMContentLoaded', function() {
  const grandparent = document.getElementById('livechat');
  const focusableElements = ['emojiButton', 'chat-message-input', 'chat-message-submit'];

  focusableElements.forEach(id => {
    const element = document.getElementById(id);
    if (element) {
      element.addEventListener('focus', function() {
        grandparent.classList.add('livechat-neon-focus');
      });

      element.addEventListener('blur', function() {
        grandparent.classList.remove('livechat-neon-focus');
      });
    }
  });
});

// test qui disparait dans le focus de lindex ou on ecrit
document.addEventListener('DOMContentLoaded', function() {
    const messageInput = document.querySelector('#chat-message-input');

    if (messageInput) {
        messageInput.addEventListener('focus', function() {
            messageInput.placeholder = '';
        });

        messageInput.addEventListener('blur', function() {
            messageInput.placeholder = 'Type here...';
        });
    } else {
        console.error('Message input not found');
    }
});

// slide le livechat


// petite icone pour le livechat
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

document.addEventListener('DOMContentLoaded', function() {
  document.querySelector('[data-chat-icon]').innerHTML = chatIconFill;
});

function slideDiv() {
  const slidingDiv = document.getElementById('livechat');
  const chatIcon = document.querySelector('[data-chat-icon]');

  slidingDiv.classList.toggle('visible');
  slidingDiv.classList.toggle('hide-children');
  slidingDiv.classList.toggle('disable-neon');

  chatIcon.innerHTML = slidingDiv.classList.contains('visible') ? chatIconDots : chatIconFill;
}

document.getElementById('liveChatBtn').addEventListener('click', slideDiv);
document.querySelector('[data-chat-icon]').addEventListener('click', slideDiv);

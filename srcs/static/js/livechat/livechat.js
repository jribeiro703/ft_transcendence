const chatSocket = new WebSocket(
    'wss://' + window.location.host + '/ws/livechat/'
);

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
    chatLog.value += (formattedTime + ' ' + clientId + ': ' + message + '\n');
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
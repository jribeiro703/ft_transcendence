const chatSocket = new WebSocket(
    'wss://' + window.location.host + '/ws/livechat/'
);

chatSocket.onmessage = function(e) {
    const data = JSON.parse(e.data);
    const message = data.message;
    const clientId = data.client_id;
	const timestamp = data.timestamp;
	const chatLog = document.querySelector('#chat-log');
	chatLog.value += (timestamp + ' ' + clientId + ': ' + message + '\n');
    // document.querySelector('#chat-log').value += (clientId + ': ' + message + '\n');
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
		'client_id': 'client_id',
		'timestamp': new Date().toLocaleString()
    }));
    messageInputDom.value = '';
};
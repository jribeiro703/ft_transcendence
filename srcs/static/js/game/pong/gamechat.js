// gamechat.js
import { fetchAuthData } from '../user/fetchData.js';
import { showToast } from '../user/tools.js';

export function initGameChat(roomName) {
    const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
    const chatSocket = new WebSocket(
        protocol + '//' + window.location.host + `/ws/gamechat/${roomName}/`
    );

    const clientIdColors = {};

    function getRandomColor() {
        const hue = Math.floor(Math.random() * 360);
        const saturation = 100;
        const lightness = 50;
        return `hsl(${hue}, ${saturation}%, ${lightness}%)`;
    }

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
        const chatLog = document.querySelector("#game-chat-log");

        const userTimezone = moment.tz.guess();
        const formattedTime = moment(timestamp)
            .tz(userTimezone)
            .calendar(null, {
                sameDay: "HH:mm",
                lastDay: "[Yesterday]",
                lastWeek: "[Days ago]",
                sameElse: "[Days ago]"
            });

        const clientIdColor = getColorForClientId(clientId);

        const messageElement = document.createElement("div");
        messageElement.innerHTML = `
            <span style="color: ${clientIdColor}">[${formattedTime}] ${clientId}: </span>
            <span>${message}</span>
        `;

        chatLog.prepend(messageElement);
    };

    document.querySelector("#game-chat-submit").onclick = async function() {
        const messageInput = document.querySelector("#game-chat-input");
        const message = messageInput.value.trim();

        if (message === "") return;

        try {
            const response = await fetchAuthData('/user/check-auth/');
            
            if (response.status === 401) {
                showToast("You must be logged in to chat", "warning");
                return;
            }

            chatSocket.send(JSON.stringify({
                message: message,
                token: sessionStorage.getItem('access_token')
            }));

            messageInput.value = "";

        } catch (error) {
            console.error('Error sending message:', error);
            showToast("Error sending message", "error");
        }
    };

    return chatSocket;
}
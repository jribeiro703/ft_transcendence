document.addEventListener("DOMContentLoaded", function() {
    fetch('/ted/api/messages/')
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            const messagesDiv = document.getElementById('messages');
            messagesDiv.innerHTML = '';
            data.forEach(message => {
                const p = document.createElement('p');
                p.textContent = message.content;
                messagesDiv.appendChild(p);
            });
        })
        .catch(error => console.error('There was a problem with the fetch operation:', error));
});

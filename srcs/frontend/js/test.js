document.addEventListener('DOMContentLoaded', () => {
    fetch('/ted/api/messages/')
        .then(response => response.json())
        .then(data => {
            const messagesDiv = document.getElementById('messages');
            data.forEach(message => {
                const p = document.createElement('p');
                p.textContent = message.content;
                messagesDiv.appendChild(p);
            });
        })
        .catch(error => console.error('Erreur:', error));
});
fetch('http://localhost:8000/game/', {
    method: 'GET',
    headers: {
        'Content-Type': 'application/json',
    }
})
.then(response => response.json())
.then(data => {
    // Affiche le message "Hello World" récupéré du backend
    document.getElementById('message').innerText = data.message;
})
.catch(error => {
    console.error('Erreur:', error);
    document.getElementById('message').innerText = 'Erreur lors du chargement du message';
});
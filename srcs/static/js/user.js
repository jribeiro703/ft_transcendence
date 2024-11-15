
function createUserContent() {
    const box = document.getElementById('mainContent');
    box.innerHTML = `
        <div class="container py-2 d-flex flex-column align-items-center py-2">
            <button id= btn-Profile class="btn custom-btn mb-4">Profile</button>
			<button id= btn-Settings class="btn custom-btn mb-4">Settings</button>
            <button id= btn-Inbox class="btn custom-btn mb-4">Inbox</button>
            <button id= btn-Logout class="btn custom-btn mb-4">Logout</button>
        </div>
    `;
}

export function displayUserChoice() {
	createUserContent();

	document.getElementById('btn-Profile').addEventListener('click', () => {
		history.pushState({ page: 'profile' }, 'Profile', '?page=profile');
		console.log('Profile button clicked');
	})
	document.getElementById('btn-Settings').addEventListener('click', () => {
		history.pushState({ page: 'settings' }, 'Settings', '?page=settings');
		console.log('Settings button clicked');
	})
	document.getElementById('btn-Inbox').addEventListener('click', () => {
		history.pushState({ page: 'inbox' }, 'Inbox', '?page=inbox');
		console.log('Inbox button clicked');
	})
	document.getElementById('btn-Logout').addEventListener('click', () => {
		history.pushState({ page: 'logout' }, 'Logout', '?page=logout');
		console.log('Logout button clicked');
	})

}

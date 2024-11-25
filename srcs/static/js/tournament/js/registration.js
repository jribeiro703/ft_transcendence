export function showRegistration() {
	const box = document.getElementById('mainContent');
	box.innerHTML = `
		<div id="registrationView">
			<h1>Registration</h1>
			<p>Register for the tournament</p>
			<button id="registerBtn">Register</button>
			<button id="nextStageBtn">Next Stage</button>
			<!-- Add stage-specific content here -->
		</div>
	`;
	// Add event listeners and other logic specific to Registration
	document.getElementById('registerBtn').addEventListener('click', () => {
		alert('Player registered successfully!');
	});
	document.getElementById('nextStageBtn').addEventListener('click', () => {
		window.location.hash = '#tournament/bracketSetup';
	});
}

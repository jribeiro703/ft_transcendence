export function showFinals() {
	const box = document.getElementById('mainContent');
	box.innerHTML = `
		<div id="finalsView">
			<h1>Finals</h1>
			<p>Final match to determine the winner</p>
			<button id="startFinalsBtn">Start Finals</button>
			<button id="finishTournamentBtn">Finish Tournament</button>
			<!-- Add stage-specific content here -->
		</div>
	`;

	// Add event listeners and other logic specific to Finals
	document.getElementById('startFinalsBtn').addEventListener('click', () => {
		alert('Finals started!');
	});

	document.getElementById('finishTournamentBtn').addEventListener('click', () => {
		alert('Tournament Finished!');
		window.location.hash = '#home';
	});
}

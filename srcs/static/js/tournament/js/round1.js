export function showRound1() {
	const box = document.getElementById('mainContent');
	box.innerHTML = `
		<div id="round1View">
			<h1>Round 1</h1>
			<p>First round of matches</p>
			<button id="startRound1Btn">Start Round 1</button>
			<button id="nextStageBtn">Next Stage</button>
			<!-- Add stage-specific content here -->
		</div>
	`;
	// Add event listeners and other logic specific to Round 1
	document.getElementById('startRound1Btn').addEventListener('click', () => {
		alert('Round 1 started!');
	});
	document.getElementById('nextStageBtn').addEventListener('click', () => {
		window.location.hash = '#tournament/round2';
	});
}

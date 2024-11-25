export function showRound2() {
	const box = document.getElementById('mainContent');
	box.innerHTML = `
		<div id="round2View">
			<h1>Round 2</h1>
			<p>Second round of matches</p>
			<button id="startRound2Btn">Start Round 2</button>
			<button id="nextStageBtn">Next Stage</button>
			<!-- Add stage-specific content here -->
		</div>
	`;
	// Add event listeners and other logic specific to Round 2
	document.getElementById('startRound2Btn').addEventListener('click', () => {
		alert('Round 2 started!');
	});
	document.getElementById('nextStageBtn').addEventListener('click', () => {
		window.location.hash = '#tournament/finals';
	});
}

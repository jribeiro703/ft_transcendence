// tournament/templates/createTournamentLayout.js

export function createTournamentLayoutHTML(tournamentName) {
	return `
	<div class="d-flex flex-grow-1 w-100 overflow-hidden">
		<div class="container-fluid d-flex flex-column flex-grow-1 p-3">
			<div class="row mb-4">
				<div class="col bg-light border rounded py-3 px-4 d-flex flex-column align-items-center text-center">
					<div class="fw-bold text-primary-emphasis h4 mb-2">
						🏆🎖🪙🏅 Welcome to the <span class="text-success">${tournamentName}</span> 🏅🪙🎖🏆
					</div>
					<div class="fw-bold text-danger h6">
						Win to advance. Lose and you are out! ❌🔥
					</div>
					<div class="vr my-1 w-100"></div>
					<div class="d-flex flex-nowrap gap-3 flex-grow-1 tournament-matches" id="tournament-matches"></div>
					<div class="row w-100 mb-4">
						<div class="col-12 d-flex justify-content-between align-items-center">
							<div id="playersList" class="fw-bold mb-2 flex-grow-1"></div>
							<div class="d-flex gap-2">
								<button type="button" id="lockTournamentBtn" class="btn btn-primary">Lock Tournament</button>
								<button type="button" id="generateMatches" class="btn btn-primary">Generate Matches</button>
								<button type="button" id="startTournamentBtn" class="btn btn-primary">Start Tournament</button>
							</div>
						</div>
					</div>
				</div>
				<div class="row flex-grow-1">
				</div>
			</div>
			<div class="row flex-grow-1">
				<div id="tournamentdiv">
						
				</div>
				<div class="col-lg-4 col-md-5 col-sm-12 d-flex flex-column">
					<div class="bg-body border rounded p-2 mb-3 bracket-container">
						<div class="fw-bold mb-2">🏓Tournament Bracket🏓</div>
						<div id="tournament-bracket"></div>
						<!-- <button type="button" id="startTournamentGameBtn" class="btn btn-primary mt-2">Start Your Game</button> -->
						<!-- <button type="button" id="joinTournament" class="btn btn-primary mt-2">join Tournament Game</button> -->
					</div>
					<div class="bg-body border rounded p-2 mb-3 invite-container">
						<div class="fw-bold mb-2">Invite Friends</div>
						<div id="invite-box"></div>
					</div>
					<div class="bg-body border rounded flex-grow-1 mb-3 chat-container" id="chat-box-container">
						<div class="p-2" id="chat-box"></div>
					</div>
					<form class="input-group" id="chat-form">
						<input type="text" class="form-control" placeholder="Type a message..." id="chat-input" />
						<button type="submit" class="btn btn-primary" id="send-chat-button">Send</button>
					</form>
				</div>
			</div>
		</div>
	</div>
	`;
}

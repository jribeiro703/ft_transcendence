// tournament/templates/createTournamentLayout.js

export function createTournamentLayoutHTML(tournamentName) {
  return `
	<div class="d-flex w-100 flex-column align-items-center justify-content-center tournament-gap">

				<div class="gap-1 justify-content-center text-center h-25 w-100 bg-light border rounded d-flex flex-column align-items-center text-center">
					<div class="fw-bold text-primary-emphasis ">
						🏆🎖🪙🏅 Welcome to the <span class="text-success">${tournamentName}</span> 🏅🪙🎖🏆
					</div>
					<div class="fw-bold text-danger">
						Win to advance. Lose and you are out! ❌🔥
					</div>
					<div class="vr w-100"></div>
					<div id="playersList" class="fw-bold "></div>
				</div>

			<div class="flex-grow-1 h-75 w-100 my-row d-flex tournament-gap">

				<div class="h-100 col-lg-8 col-md-7 col-sm-12 d-flex justify-content-center align-items-center bg-body-secondary p-3 rounded position-relative" id="tournamentdiv" style="background-color: black !important;">

					<div id="waiting-overlay" class="position-absolute top-50 start-50 translate-middle w-100 h-100 d-flex justify-content-center align-items-center" style="background: rgba(0, 0, 0, 1)">
						<div class="text-center text-white w-100">
							<h2>Waiting...</h2>
							<button type="button" id="startTournamentBtn" class="primaryBtn w-50"><span>Setup Tournament</span></button>
						</div>
					</div>

					<div id="intermission-overlay" class="position-absolute top-50 start-50 translate-middle w-100 h-100 d-flex justify-content-center align-items-center d-none" style="background: rgba(0, 0, 0, 0.7)">
						<div class="text-center text-white">
							<h2 class="fs-1 animate-pulse" id="intermission-countdown">5</h2>
						</div>
					</div>

					<div id="finished-overlay" class="position-absolute top-50 start-50 translate-middle w-100 h-100 d-none d-flex justify-content-center align-items-center" style="background: rgba(0, 0, 0, 0.7)">
						<div class="text-center text-white">
							<h2 id="winner-text"></h2>
							<p id="finalScore" class="fs-4 mt-2">Tournament winner: <span id="tournament-winner" class="text-success"></span></p>
							<a type="button" class="btn btn-primary mt-3" id="play-again" href="/play" data-router-navigation="true">Go to Lobby</a>
						</div>
					</div>

				</div>

				<div class="tournament-gap overflow-scroll h-100 d-flex flex-column flex-grow-1">

					<div class="bg-body text-center border rounded p-2 overflow-auto h-50">
						<div class="fw-bold ">🏓Tournament Bracket🏓</div>
						<div id="tournament-bracket"></div>
						<!-- <button type="button" id="startTournamentGameBtn" class="btn btn-primary mt-2">Start Your Game</button> -->
						<!-- <button type="button" id="joinTournament" class="btn btn-primary mt-2">join Tournament Game</button> -->
					</div>

					<div class="bg-body text-center border rounded p-2 overflow-auto h-50">
						<div class="fw-bold ">Invite Players</div>
						<div id="invite-box"></div>
					</div>

				</div>

			</div>

	</div>
	`;
}

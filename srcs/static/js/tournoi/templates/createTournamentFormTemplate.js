// tournament/templates/createTournamentFormTemplate.js

export function createTournamentFormHTML() {
	return `
		<div class="container" style="border:1px solid red;">
			<div class="row justify-content-center" style="border:1px solid blue;">
				<div class="text-center"  style="background-color: rgba(255, 255, 255, 0.9); border-radius: 20px;">

						<!-- Title -->
						<h2>
							🏆🎖🪙🏅 Set Up Your 4-Player Tournament 🏅🪙🎖🏆
						</h2>
						<hr>

						<!-- Player Count -->
						<div class="btn-group btn-group-toggle d-flex flex-row mb-4" data-toggle="buttons">
							<input type="rad io" class="btn-check" name="playerCount" id="players4" value="4" autocomplete="off">
							<label class="btn btn-secondary flex-fill m-2 rounded" for="players4">
								<p> 🔥 Win to advance. Lose and you are out! 🔥 <br/>
									- Two matches to find the finalists <br/>
									- One final match to decide the winner <br/></p>
							</label>
						</div>

						<!-- Tournament Setup Form -->
						<div id="tournament-setup" class="container mt-5" style="display: none;">
							<form id="tournament-setup-form">
								<div id="player-fields-container" class="row"></div>

								<!-- Player Field Template -->
								<div id="player-field-template" style="display: none;">
									<div class="mb-3">
										<p class="form-label fs-5"><strong>Player</strong></p>
										<div class="form-check form-switch mb-2 d-flex align-items-center">
											<input class="form-check-input me-2 player-guest-switch" type="checkbox">
											<label class="form-check-label">Play as Guest</label>
										</div>
										<select class="form-select player-select" required>
											<option value="" disabled selected>Select Player</option>
											<!-- Populate with JS -->
										</select>
										<div class="token-container" style="display: none; margin-top: 10px;">
											<input type="text" class="form-control game-token" placeholder="Player Game Token">
											<button type="button" class="btn btn-secondary mt-2 validate-token" disabled>Validate</button>
										</div>
										<div class="token-warning text-danger mt-2" style="display: none;">Invalid game token!</div>
										<input type="text" class="form-control player-guest" placeholder="Guest" style="display: none;">
										<div class="validation-success" style="display: none;">
											<i class="bi bi-check-circle-fill text-success"></i>
										</div>
									</div>
								</div>

								<button type="submit" id="create-tournament" class="btn btn-primary" disabled>Create Tournament</button>
							</form>
						</div>

				</div>
			</div>
		</div>
	`;
}

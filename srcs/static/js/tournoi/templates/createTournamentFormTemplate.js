// tournament/templates/createTournamentFormTemplate.js

export function createTournamentFormHTML() {
    return `
        <div class="container">
            <div class="row justify-content-center">
                <div class="col-md-6">
                    <div class="p-4 mt-5" style="background-color: rgba(255, 255, 255, 0.9); border-radius: 20px;">
                        <div class="text-center">

                            <!-- Title -->
                            <h2 class="fs-1 mb-1">
                                <i class="bi bi-trophy me-2"></i>
                                Tournament Setup
                            </h2>

                            <hr>

                            <!-- Player Count -->
                            <div class="btn-group btn-group-toggle d-flex flex-row mb-4" data-toggle="buttons">
                                <input type="radio" class="btn-check" name="playerCount" id="players4" value="4" autocomplete="off">
                                <label class="btn btn-secondary flex-fill m-2 rounded" for="players4">
                                    <h5>4 Players</h5>
                                    <p>3 Matches: Semifinals followed by a final.</p>
                                    <i class="bi bi-trophy"></i>
                                </label>
                                <input type="radio" class="btn-check" name="playerCount" id="players8" value="8" autocomplete="off">
                                <label class="btn btn-secondary flex-fill m-2 rounded" for="players8">
                                    <h5>8 Players</h5>
                                    <p>7 Matches: Quarterfinals, semifinals, followed by a final.</p>
                                    <i class="bi bi-trophy"></i>
                                </label>
                            </div>

                            <!-- Tournament Setup Form -->
                            <div id="tournament-setup" class="container mt-5" style="display: none;">
                                <form id="tournament-setup-form">
                                    <div class="mb-3 d-flex flex-column align-items-center">
                                        <p class="form-label me-3 fs-5"><strong>Difficulty</strong></p>
                                        <div id="difficulty-options" class="btn-group" role="group" aria-label="Difficulty levels">
                                            <input type="radio" class="btn-check" name="difficulty" id="tournament-difficulty-slow" value="slow" required>
                                            <label class="btn btn-outline-secondary" for="tournament-difficulty-slow">Slow</label>

                                            <input type="radio" class="btn-check" name="difficulty" id="tournament-difficulty-normal" value="normal" required checked>
                                            <label class="btn btn-outline-secondary" for="tournament-difficulty-normal">Normal</label>

                                            <input type="radio" class="btn-check" name="difficulty" id="tournament-difficulty-fast" value="fast" required>
                                            <label class="btn btn-outline-secondary" for="tournament-difficulty-fast">Fast</label>
                                        </div>
                                    </div>

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
            </div>
        </div>
    `;
}

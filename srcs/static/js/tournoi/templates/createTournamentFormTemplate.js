// tournament/templates/createTournamentFormTemplate.js

export function createTournamentFormHTML() {
  return `
<div id="tournament-setup" class=" w-100 h-100 d-flex justify-content-center overflow-scroll" style="display: none;">
    <form id="tournament-setup-form" class="p-0 w-100 d-flex flex-column align-items-center gap-5 justify-content-center p-0">

        <div id="player-fields-container" class="align-item-center w-75 p-0"></div>

        <div id="player-field-template" class="style="display: none;">
          <div class="player-field-container p-0 justify-content-center ">
            <p class="form-label fs-5 ">
              <strong>Player</strong>
            </p>
            <div class="form-check form-switch mb-2  d-flex align-items-center">
              <input class="form-check-input me-2 player-guest-switch" type="checkbox">
              <label class="form-check-label">Play as Guest</label>
            </div>
            <select class=" form-select player-select" required>
              <option value="" disabled selected>Select Player</option>
              {% for player in users %}<option value="{{ player.id }}">{{ player.username }}</option>{% endfor %}
            </select>
            <div class="token-container gap-2" style="display: none; margin-top: 10px;">
              <input type="text"
                     class="form-control game-token"
                     placeholder="Player Game Token">
              <button type="button" class="primaryBtn w-380 validate-token" disabled><span>Validate</span></button>
            </div>
            <div class="token-warning text-danger mt-2" style="display: none;">Invalid game token!</div>
            <input type="text"
                   class="form-control player-guest"
                   placeholder="Guest"
                   style="display: none">
            <div class="validation-success" style="display: none;">
              <i class="bi bi-check-circle-fill text-success"></i>
            </div>
          </div>
        </div>

        <button type="submit" id="create-tournament" class="primaryBtn w-380 p-0" style="height: 70px;" disabled><span>Create Tournament</span></button>
    </form>
</div>
	`;
}

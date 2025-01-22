// tournoi/templates/createTournamentLayout.js

export function createTournamentLayoutHTML() {
    return `
        <div class="container">
          <div class="row justify-content-center">
            <div class="col-md-6">
              <div class="d-flex flex-wrap p-4 mt-5 mb-5" style="background-color: rgba(var(--bs-body-bg-rgb), 0.9); border-radius: 20px;">
                <div class="container text-center">

                  <!-- Title -->
                  <h2 class="fs-1 mb-1">
                    <i class="bi bi-trophy me-2"></i>
                    Tournament Bracket
                  </h2>

                  <hr>

                  <div id="tournament-bracket" class="bracket">
                    <!-- Dynamic content will be inserted here -->
                  </div>

                  <hr>

                  <div class="stage">Final Match</div>
                  <div class="round">
                    <div id="next-match" class="matchup">
                      <div id="player-l" class="current">Player L</div>
                      <div class="vs">vs</div>
                      <div id="player-r" class="current">Player R</div>
                    </div>
                  </div>

                  <a
                    id="play-next-match"
                    type="button"
                    class="d-block btn btn-primary fw-bold mt-3"
                  >Play Next Match</a>
                </div>
              </div> 
            </div>
          </div>
        </div>
    `;
}

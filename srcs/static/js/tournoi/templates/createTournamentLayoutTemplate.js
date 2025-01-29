export function createTournamentLayoutHTML() {
  return `
    <div class="container-fluid px-4">
      <div class="row">
        <!-- Tournament Bracket Section -->
        <div id="tournament-bracket-section" class="col-lg-3 col-md-4 bg-light rounded p-3">
          <h2 class="text-center">Tournament Bracket</h2>
          <div id="tournament-bracket" class="bracket">
            <!-- Dynamic content for matches will be inserted here -->
          </div>
          <hr>
          <button
            id="play-next-match"
            class="btn btn-primary w-100 mt-3"
          >Play This Match</button>
        </div>

        <!-- Game Section -->
        <div id="tournamentdiv" class="col-lg-9 col-md-8 d-flex align-items-center justify-content-center">
        </div>

        <div id="delete-tournament" class="col-lg-3 col-md-4 bg-light rounded p-3">
          <button id="delete-tournament-btn" class="btn btn-danger w-100">Delete Tournament</button>
        </div>

        <div id="winner-section" class="col-lg-3 col-md-4 bg-light rounded p-3">
        </div>
      </div>
    </div>


  `;
}

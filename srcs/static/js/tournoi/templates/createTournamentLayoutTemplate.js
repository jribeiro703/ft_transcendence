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
          <div id="next-match" class="matchup">
            <div id="player-l" class="current">Player L</div>
            <div class="vs">vs</div>
            <div id="player-r" class="current">Player R</div>
          </div>
          <button
            id="play-next-match"
            class="btn btn-primary w-100 mt-3"
          >Play Next Match</button>
        </div>

        <!-- Game Section -->
        <div id="tournamentdiv" class="col-lg-9 col-md-8 d-flex align-items-center justify-content-center">
        </div>
      </div>
    </div>


  `;
}

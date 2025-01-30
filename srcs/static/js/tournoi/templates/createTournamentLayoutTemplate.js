export function createTournamentLayoutHTML() {
  return `
      <div class="row gap-3 d-flex justify-content-center align-items-center overflow-scroll">

        <div id="tournament-bracket-section" class="d-flex justify-content-center align-items-center gap-3 flex-column w-220">
          <div id="tournament-bracket" class="bracket d-flex justify-content-center align-items-center flex-column gap-1">
          </div>
          <div id="next-match" class="matchup d-flex justify-content-center align-items-center flex-column gap-1">
            <div id="player-l" class="current">Semi finalist 1</div>
            <div class="vs">vs</div>
            <div id="player-r" class="current">Semi finalist 2</div>
          </div>

          <button
            id="play-next-match"
            class="primaryBtn w-100"
          ><span>Next Match</span></button>

        </div>

        <div id="tournamentdiv" class="col-lg-9 col-md-8 d-flex align-items-center justify-content-center">
        </div>

        <div id="delete-tournament" class="rounded d-flex justify-content-center align-items-center">
          <button id="delete-tournament-btn" class="primaryBtn overright-btn-red w-196" style="z-index: -1;"><span>Delete</span></button>
        </div>

        <div id="winner-section" class="rounded">
        </div>
      </div>
  `;
}

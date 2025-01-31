// tournoi/tournamentLayout.js

import gameVar from "../game/pong/var.js";
import { createTournamentLayoutHTML } from "./templates/createTournamentLayoutTemplate.js";
import { fetchAuthData } from "../user/fetchData.js";
import { isTournamentPage, renderPageGame } from "../game/HistoryManager.js";
import { clearPongVar } from "../game/pong/reset.js";
import { renderPage } from "../user/historyManager.js";

let currentMatchId = null;
let playNextMatchButton = null;

export async function displayTournamentLayout(tournamentId) {
  const box = document.getElementById("mainContent");
  try {
    const response = await fetchAuthData(`/tournament/${tournamentId}/`, "GET");
    if (response.status === 200 && response.data) {
      box.innerHTML = createTournamentLayoutHTML();
      currentMatchId = response.data.current_match;
      renderBracket(response.data.matches, currentMatchId);

      playNextMatchButton = document.getElementById("play-next-match");
      if (!(response.data.status === "finished")) {
        playNextMatchButton.disabled = false;
        playNextMatchButton.querySelector("span").textContent = "Next Match";

        playNextMatchButton.addEventListener("click", () => {
          playNextMatchButton.disabled = true;
          playNextMatchButton.querySelector("span").textContent = "finished";
          launchNextMatch(tournamentId, response.data);
        });
      } else {
        console.log("Tournament finished");
      }
      document
        .getElementById("delete-tournament-btn")
        .addEventListener("click", () => {
          deleteTournament(tournamentId);
        });
    } else {
      console.warn(
        "[displayTournamentLayout] Failed to load tournament layout. Status:",
        response.status,
      );
    }
  } catch (error) {
    console.error(
      "[displayTournamentLayout] Error loading tournament layout:",
      error,
    );
  }
}

function getNextMatchId(currentMatchId, matches) {
  // Logic to get the next match ID based on the current match ID and matches array
  const currentIndex = matches.findIndex(
    (match) => match.match_id === currentMatchId,
  );
  if (currentIndex !== -1 && currentIndex < matches.length - 1) {
    return matches[currentIndex + 1].match_id;
  }
  return currentMatchId; // Return the same ID if no next match is found
}

function renderBracket(matches, currentMatchId) {
  const bracketContainer = document.getElementById("tournament-bracket");

  bracketContainer.innerHTML = matches
    .map((match) => {
      const isCurrentMatch = match.match_id === currentMatchId;
      const player1Winner = match.score_one > match.score_two;
      const player2Winner = match.score_two > match.score_one;

        return `
            <div class="matchup ${isCurrentMatch ? 'highlight-current' : ''}" data-match-id="${match.match_id}">
                <div class="player ${player1Winner ? 'winner' : ''}">
                    ${match.player1 || 'TBD'} (Player 1) ${player1Winner ? '🏆' : ''}
                </div>
                <div class="vs">vs</div>
                <div class="player ${player2Winner ? 'winner' : ''}">
                    ${match.player2 || 'TBD'} (Player 2) ${player2Winner ? '🏆' : ''}
                </div>
                <div class="scores">
                    ${match.score_one || 0} - ${match.score_two || 0}
                </div>
            </div>

        `;
    })
    .join("");
}

async function launchNextMatch(tournamentId, data) {
  if (!currentMatchId) {
    return console.error("[launchNextMatch] No match ID provided");
  }

  const currentMatch = data.matches.find(
    (match) => match.match_id === currentMatchId,
  );

  if (!currentMatch) {
    return console.error(
      "[launchNextMatch] Current match not found in matches array",
    );
  }

  // Launch the game first
  launchGame(currentMatch.player1, currentMatch.player2);

  // Wait for the game to finish
  const intervalId = setInterval(async () => {
    /*         if (!isTournamentPage) {
            deleteTournament(tournamentId);
            clearInterval(intervalId);
        } */
    if (gameVar.matchOver) {
      gameVar.rematchBtn.style.display = "none";
      gameVar.quitGameBtn.style.display = "none";
      clearInterval(intervalId);

      // Update the match scores after the game is finished
      const payload = {
        matchId: currentMatchId,
        score_one: gameVar.playerScore,
        score_two: gameVar.aiScore,
      };

      try {
        const response = await fetchAuthData(
          `/tournament/next/${tournamentId}/`,
          "POST",
          payload,
        );
        if (response.status === 400) {
          playNextMatchButton.disabled = true;
          playNextMatchButton.querySelector("span").textContent =
            "Tournement finished";
        }
        if (response.status === 200) {
          playNextMatchButton.disabled = false;
          playNextMatchButton.querySelector("span").textContent = "Next Match";

          // Update the match data and re-fetch the tournament data
          const updatedResponse = await fetchAuthData(
            `/tournament/${tournamentId}/`,
            "GET",
          );
          if (updatedResponse.status === 200 && updatedResponse.data) {
            data = updatedResponse.data;
            currentMatchId = getNextMatchId(currentMatchId, data.matches);
            renderBracket(data.matches, currentMatchId);

            // Check if the current match is the last match
            if (
              currentMatchId === data.matches[data.matches.length - 1].match_id
            ) {
              playNextMatchButton.disabled = false;
              playNextMatchButton.querySelector("span").textContent =
                "Final Match";

              playNextMatchButton.addEventListener(
                "click",
                async () => {
                  playNextMatchButton.disabled = true;
                  playNextMatchButton.querySelector("span").textContent =
                    "Final Match...";
                  launchGame(currentMatch.player1, currentMatch.player2);

                  // Wait for the final game to finish
                  const finalIntervalId = setInterval(async () => {
                    if (!isTournamentPage) {
                      deleteTournament(tournamentId);
                      clearInterval(intervalId);
                    }
                    if (gameVar.matchOver) {
                      gameVar.rematchBtn.style.display = "none";
                      gameVar.quitGameBtn.style.display = "none";
                      clearInterval(finalIntervalId);

                      // Update the final match scores after the game is finished
                      const finalPayload = {
                        matchId: currentMatchId,
                        score_one: gameVar.playerScore,
                        score_two: gameVar.aiScore,
                      };
                      currentMatchId = 0;
                      try {
                        const finalResponse = await fetchAuthData(
                          `/tournament/next/${tournamentId}/`,
                          "POST",
                          finalPayload,
                        );
                        if (finalResponse.status === 200) {
                          playNextMatchButton.querySelector(
                            "span",
                          ).textContent = "Finished";
                          playNextMatchButton.disabled = true;
                          // Fetch the updated tournament data to get the winner
                          const finalUpdatedResponse = await fetchAuthData(
                            `/tournament/${tournamentId}/`,
                            "GET",
                          );
                          if (
                            finalUpdatedResponse.status === 200 &&
                            finalUpdatedResponse.data
                          ) {
                            const winner = finalResponse.data.winner;

                            announceWinner(winner);
                          }
                        } else {
                          console.error(
                            "[launchNextMatch] Failed to update final match score:",
                            finalResponse.data,
                          );
                        }
                      } catch (error) {
                        console.error(
                          "[launchNextMatch] Error updating final match score:",
                          error,
                        );
                      }
                    }
                  }, 1000);
                },
                { once: true },
              );
            }
          } else {
            console.log("not a last match....", currentMatchId);
            // Set up the event listener for the next match
            playNextMatchButton.addEventListener(
              "click",
              () => {
                playNextMatchButton.disabled = true;
                playNextMatchButton.querySelector("span").textContent =
                  "finished";
                launchNextMatch(tournamentId, data);
              },
              { once: true },
            );
          }
        } else {
          console.error(
            "[launchNextMatch] Failed to update match score:",
            response.data,
          );
        }
      } catch (error) {
        console.error("[launchNextMatch] Error updating match score:", error);
      }
    }
  }, 1000);
}

function launchGame(player1, player2) {
  clearPongVar();

  gameVar.matchOver = false;
  gameVar.game = "pong";
  gameVar.localGame = true;
  gameVar.tournament = true;

  gameVar.userName = player1;
  gameVar.opponentName = player2;
  renderPageGame("playTournamentLocal", true);

  playNextMatchButton.disabled = true;
  playNextMatchButton.querySelector("span").textContent = "Playing...";
}

function announceWinner(winner) {
  const winnerSection = document.getElementById("winner-section");
  if (winnerSection) {
    winnerSection.innerHTML = `
            <div class="winner-announcement">
                <h2 class="text-center">Winner: ${winner}</h2>
            </div>
        `;

    // Add styles and animations
    const winnerAnnouncement = document.querySelector(".winner-announcement");
    winnerAnnouncement.style.position = "fixed";
    winnerAnnouncement.style.top = "50%";
    winnerAnnouncement.style.left = "50%";
    winnerAnnouncement.style.transform = "translate(-50%, -50%)";
    winnerAnnouncement.style.padding = "20px";
    winnerAnnouncement.style.backgroundColor = "rgba(0, 0, 0, 0.8)";
    winnerAnnouncement.style.color = "white";
    winnerAnnouncement.style.borderRadius = "10px";
    winnerAnnouncement.style.boxShadow = "0 0 10px rgba(0, 0, 0, 0.5)";
    winnerAnnouncement.style.textAlign = "center";
    winnerAnnouncement.style.fontSize = "2em";
    winnerAnnouncement.style.zIndex = "1000";
    winnerAnnouncement.style.opacity = "0";
    winnerAnnouncement.style.transition = "opacity 1s ease-in-out";

    // Fade in the announcement
    setTimeout(() => {
      winnerAnnouncement.style.opacity = "1";
    }, 100);

    // Add a confetti effect
    const confettiContainer = document.createElement("div");
    confettiContainer.classList.add("confetti-container");
    document.body.appendChild(confettiContainer);

    for (let i = 0; i < 100; i++) {
      const confetti = document.createElement("div");
      confetti.classList.add("confetti");
      confetti.style.position = "fixed";
      confetti.style.top = `${Math.random() * 100}%`;
      confetti.style.left = `${Math.random() * 100}%`;
      confetti.style.width = "10px";
      confetti.style.height = "10px";
      confetti.style.backgroundColor = `hsl(${Math.random() * 360}, 100%, 50%)`;
      confetti.style.opacity = "0";
      confetti.style.transition =
        "opacity 1s ease-in-out, transform 2s ease-in-out";
      confettiContainer.appendChild(confetti);

      setTimeout(() => {
        confetti.style.opacity = "1";
        confetti.style.transform = `translateY(${Math.random() * 200 - 100}px) translateX(${Math.random() * 200 - 100}px) rotate(${Math.random() * 360}deg)`;
      }, 100);
    }

    // Remove confetti after animation
    setTimeout(() => {
      confettiContainer.remove();
    }, 3000);
  } else {
    console.error("[announceWinner] Winner section not found"); // Add this line for debugging
  }
}

export async function deleteTournament(tournamentId) {
  try {
    const deleteTournament = await fetchAuthData(
      `/tournament/delete/${tournamentId}/`,
      "DELETE",
    );
    if (deleteTournament.status === 200) {
      console.log("Tournament deleted successfully", tournamentId);
      // window.location.href = '/#home'; //TODO: ???
      // renderHomePage();
      renderPage("home");
    } else {
      console.error("Failed to delete tournament:", deleteTournament.data);
    }
  } catch (error) {
    console.error("Error deleting tournament:", error);
  }
}

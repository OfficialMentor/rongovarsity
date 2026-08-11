// results.js
import {
  getSeats,
  getCandidates
} from "./firebase.js";

// -------------------------
// LOAD RESULTS
// -------------------------
async function loadResults() {
  const seats = await getSeats();
  const candidates = await getCandidates();

  const container = document.getElementById("resultsContainer");
  container.innerHTML = "";

  // Group candidates by seat
  for (const seatId in seats) {
    const seat = seats[seatId];

    const seatDiv = document.createElement("div");
    seatDiv.classList.add("seat-block");

    seatDiv.innerHTML = `<h3>${seat.name}</h3>`;

    // List candidates under this seat
    for (const candId in candidates) {
      const cand = candidates[candId];

      if (cand.seatId === seatId) {
        const candDiv = document.createElement("p");
        candDiv.textContent = `${cand.name}: ${cand.votes} votes`;
        seatDiv.appendChild(candDiv);
      }
    }

    container.appendChild(seatDiv);
  }
}

// -------------------------
// INITIAL LOAD
// -------------------------
loadResults();

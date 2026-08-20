// results.js
import { getSeats, getCandidates } from "./firebase.js";

// -------------------------
// LOAD RESULTS
// -------------------------
async function loadResults() {
  const seats = await getSeats();
  const candidates = await getCandidates();
  const container = document.getElementById("resultsList");
  container.innerHTML = "";

  for (const seatId in seats) {
    const seat = seats[seatId];
    const seatDiv = document.createElement("div");
    seatDiv.innerHTML = `<h3>${seat.name}</h3>`;
    container.appendChild(seatDiv);

    // filter candidates belonging to this seat
    for (const candId in candidates) {
      const cand = candidates[candId];
      if (cand.seatId === seatId) {
        const votes = cand.votes || 0;
        const candDiv = document.createElement("div");
        candDiv.innerHTML = `<p>${cand.name}: ${votes} votes</p>`;
        container.appendChild(candDiv);
      }
    }
  }
}

// -------------------------
// AUTO REFRESH RESULTS
// -------------------------
setInterval(loadResults, 3000); // refresh every 3 seconds
loadResults();

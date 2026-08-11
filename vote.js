// vote.js
import {
  getVoter,
  saveVote,
  incrementCandidateVote,
  getCandidates,
  markVoterAsVoted
} from "./firebase.js";

// -------------------------
// LOGIN
// -------------------------
window.voterLogin = async function () {
  const adm = document.getElementById("admInput").value.trim();
  const pass = document.getElementById("passInput").value.trim();

  if (!adm || !pass) return alert("Enter admission number and password");

  const voter = await getVoter(adm);

  if (!voter) return alert("Voter not found");
  if (voter.password !== pass) return alert("Incorrect password");
  if (voter.hasVoted) return alert("You have already voted");

  // Show voting UI
  document.getElementById("loginCard").classList.add("hidden");
  document.getElementById("voteCard").classList.remove("hidden");

  loadCandidates();
};

// -------------------------
// LOAD CANDIDATES
// -------------------------
async function loadCandidates() {
  const candidates = await getCandidates();
  const container = document.getElementById("candidateList");
  container.innerHTML = "";

  for (const id in candidates) {
    const cand = candidates[id];

    const btn = document.createElement("button");
    btn.textContent = `${cand.name} (${cand.seatId})`;
    btn.onclick = () => castVote(id);

    container.appendChild(btn);
  }
}

// -------------------------
// CAST VOTE
// -------------------------
async function castVote(candId) {
  const adm = document.getElementById("admInput").value.trim();

  await saveVote(adm, candId);
  await incrementCandidateVote(candId);
  await markVoterAsVoted(adm);

  alert("Vote cast successfully!");

  document.getElementById("voteCard").classList.add("hidden");
}

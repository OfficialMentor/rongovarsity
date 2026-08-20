// vote.js
import {
  getVoter,
  markVoterAsVoted,
  incrementCandidateVote,
  saveVote,
  getCandidates
} from "./firebase.js";

// -------------------------
// VOTER LOGIN
// -------------------------
window.voterLogin = async function () {
  const adm = document.getElementById("loginAdm").value.trim();
  const pass = document.getElementById("loginPass").value.trim();

  if (!adm || !pass) return alert("Enter admission and password");

  const voter = await getVoter(adm);
  if (!voter) return alert("No voter found with that admission number");

  if (voter.password === "UNSET") {
    return alert("Password not set. Contact admin.");
  }

  if (voter.password !== pass) {
    return alert("Incorrect password");
  }

  if (voter.hasVoted) {
    return alert("You have already voted");
  }

  // login success → show voting page
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
    const div = document.createElement("div");
    div.innerHTML = `
      <p>${cand.name}</p>
      <button onclick="castVote('${id}')">Vote</button>
    `;
    container.appendChild(div);
  }
}

// -------------------------
// CAST VOTE
// -------------------------
window.castVote = async function (candId) {
  const adm = document.getElementById("loginAdm").value.trim();

  // save vote record
  await saveVote(adm, candId);

  // increment candidate vote count
  await incrementCandidateVote(candId);

  // mark voter as voted
  await markVoterAsVoted(adm);

  alert("Vote submitted successfully!");

  // hide voting card
  document.getElementById("voteCard").classList.add("hidden");
  document.getElementById("thankYouCard").classList.remove("hidden");
};

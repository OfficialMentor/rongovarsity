// admin.js
import {
  addSeat,
  deleteSeat,
  getSeats,
  addCandidate,
  deleteCandidate,
  getCandidates,
  addVoter,
  deleteVoter,
  getVoters,
  resetPassword,
  updateElectionTitle,
  addAdminPassword,
  addLog
} from "./firebase.js";

// -------------------------
// LOAD SEATS
// -------------------------
async function loadSeats() {
  const seats = await getSeats();
  const container = document.getElementById("seatList");
  container.innerHTML = "";

  for (const id in seats) {
    const seat = seats[id];
    const div = document.createElement("div");
    div.innerHTML = `
      <p>${seat.name}</p>
      <button onclick="removeSeat('${id}')">Delete</button>
    `;
    container.appendChild(div);
  }
}

// -------------------------
// ADD SEAT
// -------------------------
window.createSeat = async function () {
  const name = document.getElementById("seatName").value.trim();
  if (!name) return alert("Enter seat name");

  await addSeat(name);
  await addLog("Add Seat", name);
  loadSeats();
};

// -------------------------
// DELETE SEAT
// -------------------------
window.removeSeat = async function (id) {
  await deleteSeat(id);
  await addLog("Delete Seat", id);
  loadSeats();
};

// -------------------------
// LOAD CANDIDATES
// -------------------------
async function loadCandidates() {
  const candidates = await getCandidates();
  const seats = await getSeats();
  const container = document.getElementById("candidateList");
  container.innerHTML = "";

  for (const id in candidates) {
    const cand = candidates[id];
    const seatName = seats[cand.seatId]?.name || "Unknown Seat";

    const div = document.createElement("div");
    div.innerHTML = `
      <p>${cand.name} — ${seatName}</p>
      <button onclick="removeCandidate('${id}')">Delete</button>
    `;
    container.appendChild(div);
  }
}

// -------------------------
// ADD CANDIDATE
// -------------------------
window.createCandidate = async function () {
  const name = document.getElementById("candidateName").value.trim();
  const seatId = document.getElementById("candidateSeat").value;

  if (!name || !seatId) return alert("Enter candidate name and seat");

  await addCandidate(seatId, name);
  await addLog("Add Candidate", name);
  loadCandidates();
};

// -------------------------
// DELETE CANDIDATE
// -------------------------
window.removeCandidate = async function (id) {
  await deleteCandidate(id);
  await addLog("Delete Candidate", id);
  loadCandidates();
};

// -------------------------
// LOAD VOTERS
// -------------------------
async function loadVoters() {
  const voters = await getVoters();
  const container = document.getElementById("voterList");
  container.innerHTML = "";

  for (const adm in voters) {
    const voter = voters[adm];
    const div = document.createElement("div");
    div.innerHTML = `
      <p>${voter.admission} — ${voter.name}</p>
      <button onclick="removeVoter('${adm}')">Delete</button>
      <button onclick="resetVoterPass('${adm}')">Reset Password</button>
    `;
    container.appendChild(div);
  }
}

// -------------------------
// ADD VOTER
// -------------------------
window.createVoter = async function () {
  const adm = document.getElementById("voterAdm").value.trim();
  const name = document.getElementById("voterName").value.trim();

  if (!adm || !name) return alert("Enter admission number and name");

  await addVoter(adm, name);
  await addLog("Add Voter", adm);
  loadVoters();
};

// -------------------------
// DELETE VOTER
// -------------------------
window.removeVoter = async function (adm) {
  await deleteVoter(adm);
  await addLog("Delete Voter", adm);
  loadVoters();
};

// -------------------------
// RESET PASSWORD
// -------------------------
window.resetVoterPass = async function (adm) {
  await resetPassword(adm);
  await addLog("Reset Password", adm);
  alert("Password reset to UNSET");
};

// -------------------------
// UPDATE ELECTION TITLE
// -------------------------
window.updateTitle = async function () {
  const title = document.getElementById("electionTitle").value.trim();
  if (!title) return alert("Enter title");

  await updateElectionTitle(title);
  await addLog("Update Title", title);
  alert("Election title updated");
};

// -------------------------
// ADD ADMIN PASSWORD
// -------------------------
window.createAdminPassword = async function () {
  const pass = document.getElementById("adminPass").value.trim();
  if (!pass) return alert("Enter password");

  await addAdminPassword(pass);
  await addLog("Add Admin Password", pass);
  alert("Admin password added");
};

// -------------------------
// INITIAL LOAD
// -------------------------
loadSeats();
loadCandidates();
loadVoters();

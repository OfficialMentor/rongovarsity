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
// ADMIN LOGIN
// -------------------------
document.getElementById("loginBtn").onclick = () => {
  const pass = document.getElementById("adminPass").value.trim();

  // Replace with your real admin password or Firebase check
  if (pass === "RUAdmin2026") {
    document.getElementById("loginCard").classList.add("hidden");
    document.getElementById("adminCard").classList.remove("hidden");
    document.getElementById("logoutBtn").classList.remove("hidden");
    alert("Login successful!");
  } else {
    alert("Incorrect admin password.");
  }
};

// -------------------------
// LOGOUT
// -------------------------
document.getElementById("logoutBtn").onclick = () => {
  document.getElementById("adminCard").classList.add("hidden");
  document.getElementById("loginCard").classList.remove("hidden");
  document.getElementById("logoutBtn").classList.add("hidden");
};


// -------------------------
// LOAD SEATS
// -------------------------
async function loadSeats() {
  const seats = await getSeats();
  const container = document.getElementById("seatsList");
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

  // also refresh seatSelect dropdown
  const select = document.getElementById("seatSelect");
  select.innerHTML = "";
  for (const id in seats) {
    const seat = seats[id];
    const option = document.createElement("option");
    option.value = id;
    option.textContent = seat.name;
    select.appendChild(option);
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
  document.getElementById("seatName").value = "";
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
  const container = document.getElementById("candidatesList");
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
  const seatId = document.getElementById("seatSelect").value;

  if (!name || !seatId) return alert("Enter candidate name and select seat");

  await addCandidate(seatId, name);
  await addLog("Add Candidate", name);
  document.getElementById("candidateName").value = "";
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
  const container = document.getElementById("votersList");
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
  document.getElementById("voterAdm").value = "";
  document.getElementById("voterName").value = "";
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
  loadVoters();
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
  const pass = document.getElementById("newAdminPass").value.trim();
  if (!pass) return alert("Enter password");

  await addAdminPassword(pass);
  await addLog("Add Admin Password", pass);
  document.getElementById("newAdminPass").value = "";
  alert("Admin password added");
};

// -------------------------
// INITIAL LOAD
// -------------------------
loadSeats();
loadCandidates();
loadVoters();

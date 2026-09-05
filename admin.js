// admin.js
import { db } from "./firebase.js";

// DOM references
const loginBtn = document.getElementById("loginBtn");
const adminPassInput = document.getElementById("adminPass");
const loginCard = document.getElementById("loginCard");
const adminCard = document.getElementById("adminCard");
const logoutBtn = document.getElementById("logoutBtn");

const saveTitleBtn = document.getElementById("saveTitleBtn");
const electionTitleInput = document.getElementById("electionTitle");

const addSeatBtn = document.getElementById("addSeatBtn");
const seatNameInput = document.getElementById("seatName");
const seatsList = document.getElementById("seatsList");
const seatSelect = document.getElementById("seatSelect");

const addCandidateBtn = document.getElementById("addCandidateBtn");
const candidateNameInput = document.getElementById("candidateName");
const candidatesList = document.getElementById("candidatesList");

const addVoterBtn = document.getElementById("addVoterBtn");
const voterAdmInput = document.getElementById("voterAdm");
const voterNameInput = document.getElementById("voterName");
const votersList = document.getElementById("votersList");

const resetPassBtn = document.getElementById("resetPassBtn");
const resetAdmInput = document.getElementById("resetAdm");

const addAdminBtn = document.getElementById("addAdminBtn");
const newAdminPassInput = document.getElementById("newAdminPass");

const resetElectionBtn = document.getElementById("resetElectionBtn");
const logsList = document.getElementById("logsList");

// --- LOGIN ---
loginBtn.addEventListener("click", () => {
  const pass = adminPassInput.value.trim();
  if (pass === "yourAdminPassword") {
    if (confirm("Login successful! Proceed to Admin Panel?")) {
      loginCard.classList.add("hidden");
      adminCard.classList.remove("hidden");
      logoutBtn.classList.remove("hidden");
      logAction("Admin logged in.");
    }
  } else {
    alert("❌ Incorrect password.");
  }
});

logoutBtn.addEventListener("click", () => {
  if (confirm("Logout now?")) {
    adminCard.classList.add("hidden");
    loginCard.classList.remove("hidden");
    logoutBtn.classList.add("hidden");
    adminPassInput.value = "";
    logAction("Admin logged out.");
  }
});

// --- SAVE TITLE ---
saveTitleBtn.addEventListener("click", () => {
  const title = electionTitleInput.value.trim();
  if (title) {
    db.ref("electionTitle").set(title);
    alert("✅ Title saved.");
    logAction("Election title set: " + title);
  }
});

// --- ADD SEAT ---
addSeatBtn.addEventListener("click", () => {
  const seat = seatNameInput.value.trim();
  if (seat) {
    db.ref("seats").push(seat);
    alert("✅ Seat added.");
    logAction("Seat added: " + seat);
  }
});

// --- ADD CANDIDATE ---
addCandidateBtn.addEventListener("click", () => {
  const seat = seatSelect.value;
  const candidate = candidateNameInput.value.trim();
  if (seat && candidate) {
    db.ref("candidates").push({ seat, name: candidate });
    alert("✅ Candidate added.");
    logAction("Candidate added: " + candidate + " for " + seat);
  }
});

// --- ADD VOTER ---
addVoterBtn.addEventListener("click", () => {
  const adm = voterAdmInput.value.trim();
  const name = voterNameInput.value.trim();
  if (adm && name) {
    db.ref("voters").push({ adm, name, password: "default123" });
    alert("✅ Voter registered.");
    logAction("Voter registered: " + name + " (" + adm + ")");
  }
});

// --- RESET VOTER PASSWORD ---
resetPassBtn.addEventListener("click", () => {
  const adm = resetAdmInput.value.trim();
  if (adm) {
    db.ref("voters").orderByChild("adm").equalTo(adm).once("value", snapshot => {
      snapshot.forEach(child => {
        child.ref.update({ password: "default123" });
      });
      alert("✅ Password reset for " + adm);
      logAction("Password reset for voter: " + adm);
    });
  }
});

// --- ADD ADMIN ACCOUNT ---
addAdminBtn.addEventListener("click", () => {
  const newPass = newAdminPassInput.value.trim();
  if (newPass) {
    db.ref("admins").push({ password: newPass });
    alert("✅ New admin account added.");
    logAction("New admin account created.");
  }
});

// --- RESET ENTIRE ELECTION ---
resetElectionBtn.addEventListener("click", () => {
  if (confirm("⚠ WARNING: This will delete ALL election data. Continue?")) {
    Promise.all([
      db.ref("electionTitle").remove(),
      db.ref("seats").remove(),
      db.ref("candidates").remove(),
      db.ref("voters").remove(),
      db.ref("votes").remove()
    ])
    .then(() => {
      alert("✅ Election reset successfully!");
      logAction("Election reset.");
    })
    .catch(err => {
      console.error(err);
      alert("❌ Error resetting election.");
    });
  }
});

// --- LOGGING ---
function logAction(msg) {
  const time = new Date().toLocaleString();
  const entry = time + " - " + msg + "<br>";
  logsList.innerHTML += entry;
}

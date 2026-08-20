// firebase.js
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-app.js";
import {
  getDatabase,
  ref,
  set,
  get,
  child,
  push,
  update,
  remove
} from "https://www.gstatic.com/firebasejs/9.6.1/firebase-database.js";

// -------------------------
// CONFIGURATION
// -------------------------
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_PROJECT.firebaseapp.com",
  databaseURL: "https://YOUR_PROJECT.firebaseio.com",
  projectId: "YOUR_PROJECT",
  storageBucket: "YOUR_PROJECT.appspot.com",
  messagingSenderId: "YOUR_SENDER_ID",
  appId: "YOUR_APP_ID"
};

export const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

// -------------------------
// SEATS
// -------------------------
export async function addSeat(name) {
  const seatRef = push(ref(db, "seats"));
  await set(seatRef, { name });
}

export async function deleteSeat(id) {
  await remove(ref(db, `seats/${id}`));
}

export async function getSeats() {
  const snapshot = await get(ref(db, "seats"));
  return snapshot.exists() ? snapshot.val() : {};
}

// -------------------------
// CANDIDATES
// -------------------------
export async function addCandidate(seatId, name) {
  const candRef = push(ref(db, "candidates"));
  await set(candRef, { name, seatId, votes: 0 });
}

export async function deleteCandidate(id) {
  await remove(ref(db, `candidates/${id}`));
}

export async function getCandidates() {
  const snapshot = await get(ref(db, "candidates"));
  return snapshot.exists() ? snapshot.val() : {};
}

export async function incrementCandidateVote(candId) {
  const candRef = ref(db, `candidates/${candId}/votes`);
  const snapshot = await get(candRef);
  const current = snapshot.exists() ? snapshot.val() : 0;
  await set(candRef, current + 1);
}

// -------------------------
// VOTERS
// -------------------------
export async function addVoter(adm, name) {
  await set(ref(db, `voters/${adm}`), {
    admission: adm,
    name,
    password: "UNSET",
    hasVoted: false
  });
}

export async function deleteVoter(adm) {
  await remove(ref(db, `voters/${adm}`));
}

export async function getVoters() {
  const snapshot = await get(ref(db, "voters"));
  return snapshot.exists() ? snapshot.val() : {};
}

export async function getVoter(adm) {
  const snapshot = await get(ref(db, `voters/${adm}`));
  return snapshot.exists() ? snapshot.val() : null;
}

export async function resetPassword(adm) {
  await update(ref(db, `voters/${adm}`), { password: "UNSET", hasVoted: false });
}

export async function markVoterAsVoted(adm) {
  await update(ref(db, `voters/${adm}`), { hasVoted: true });
}

// -------------------------
// VOTES
// -------------------------
export async function saveVote(adm, candId) {
  const voteRef = push(ref(db, "votes"));
  await set(voteRef, { voter: adm, candidateId: candId, time: Date.now() });
}

// -------------------------
// ELECTION TITLE
// -------------------------
export async function updateElectionTitle(title) {
  await set(ref(db, "election/title"), title);
}

// -------------------------
// ADMIN PASSWORDS
// -------------------------
export async function addAdminPassword(pass) {
  const adminRef = push(ref(db, "admins"));
  await set(adminRef, { password: pass });
}

// -------------------------
// LOGS
// -------------------------
export async function addLog(action, detail) {
  const logRef = push(ref(db, "logs"));
  await set(logRef, { time: new Date().toLocaleString(), action, detail });
}

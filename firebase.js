// firebase.js
import {
  initializeApp
} from "https://www.gstatic.com/firebasejs/12.12.0/firebase-app.js";

import {
  getDatabase,
  ref,
  set,
  push,
  get,
  update,
  remove
} from "https://www.gstatic.com/firebasejs/12.12.0/firebase-database.js";

// -------------------------
// FIREBASE CONFIG
// -------------------------
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBWb5JwcfI3c0G9sogQYbpGwUdVMiAy8Io",
  authDomain: "rongovarsity-voting.firebaseapp.com",
  databaseURL: "https://rongovarsity-voting-default-rtdb.firebaseio.com",
  projectId: "rongovarsity-voting",
  storageBucket: "rongovarsity-voting.firebasestorage.app",
  messagingSenderId: "1068169084539",
  appId: "1:1068169084539:web:a59727e8ef82fb183facde",
  measurementId: "G-ZQWC4C6FYJ"
};

// -------------------------
// INIT
// -------------------------
const app = initializeApp(firebaseConfig);
export const db = getDatabase(app);

// -------------------------
// SEATS
// -------------------------
export async function addSeat(name) {
  const id = push(ref(db, "seats")).key;
  await set(ref(db, "seats/" + id), { name });
}

export async function deleteSeat(id) {
  await remove(ref(db, "seats/" + id));
}

export async function getSeats() {
  const snap = await get(ref(db, "seats"));
  return snap.exists() ? snap.val() : {};
}

// -------------------------
// CANDIDATES
// -------------------------
export async function addCandidate(seatId, name) {
  const id = push(ref(db, "candidates")).key;
  await set(ref(db, "candidates/" + id), {
    seatId,
    name,
    votes: 0
  });
}

export async function deleteCandidate(id) {
  await remove(ref(db, "candidates/" + id));
}

export async function getCandidates() {
  const snap = await get(ref(db, "candidates"));
  return snap.exists() ? snap.val() : {};
}

export async function incrementCandidateVote(id) {
  const snap = await get(ref(db, "candidates/" + id));
  if (!snap.exists()) return;

  const current = snap.val().votes || 0;
  await update(ref(db, "candidates/" + id), { votes: current + 1 });
}

// -------------------------
// VOTERS
// -------------------------
export async function addVoter(adm, name) {
  await set(ref(db, "voters/" + adm), {
    admission: adm,
    name,
    password: "UNSET",
    hasVoted: false
  });
}

export async function deleteVoter(adm) {
  await remove(ref(db, "voters/" + adm));
}

export async function getVoters() {
  const snap = await get(ref(db, "voters"));
  return snap.exists() ? snap.val() : {};
}

export async function getVoter(adm) {
  const snap = await get(ref(db, "voters/" + adm));
  return snap.exists() ? snap.val() : null;
}

export async function resetPassword(adm) {
  await update(ref(db, "voters/" + adm), { password: "UNSET" });
}

export async function markVoterAsVoted(adm) {
  await update(ref(db, "voters/" + adm), { hasVoted: true });
}

// -------------------------
// VOTES
// -------------------------
export async function saveVote(adm, candId) {
  await set(ref(db, "votes/" + adm), {
    candidateId: candId,
    time: Date.now()
  });
}

// -------------------------
// ELECTION TITLE
// -------------------------
export async function updateElectionTitle(title) {
  await set(ref(db, "title"), title);
}

// -------------------------
// ADMIN PASSWORD
// -------------------------
export async function addAdminPassword(pass) {
  await set(ref(db, "adminPassword"), pass);
}

// -------------------------
// LOGS
// -------------------------
export async function addLog(action, detail) {
  const id = push(ref(db, "logs")).key;
  await set(ref(db, "logs/" + id), {
    action,
    detail,
    time: Date.now()
  });
}

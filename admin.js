import { db } from './firebase.js';
import { doc, setDoc, serverTimestamp, Timestamp } from 'https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js';

document.getElementById("approve").onclick = async () => {
  const uid = document.getElementById("uid").value.trim();
  const days = parseInt(document.getElementById("duration").value);

  if (!uid || isNaN(days)) return alert("Invalid input");

  const expiresAt = Timestamp.fromDate(new Date(Date.now() + days * 24 * 60 * 60 * 1000));

  try {
    await setDoc(doc(db, "subscribers", uid), {
      subscribed: true,
      expiresAt: expiresAt,
      createdAt: serverTimestamp()
    });
    document.getElementById("status").textContent = "User approved successfully!";
  } catch (err) {
    console.error("Error approving user:", err);
    document.getElementById("status").textContent = "Error approving user.";
  }
};

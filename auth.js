// auth.js
import { signInAnonymously, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";
import { getDoc, doc } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";
import { auth, db } from './firebase-config.js';

export let currentUser = null;
export let isSubscribed = false;

onAuthStateChanged(auth, async (user) => {
  if (user) {
    currentUser = user;
    const docRef = doc(db, "subscribers", user.uid);
    try {
      const snap = await getDoc(docRef);
      if (snap.exists()) {
        const data = snap.data();
        const now = new Date();
        if (data.subscribed && data.expiresAt.toDate() > now) {
          isSubscribed = true;
        }
      }
    } catch (err) {
      console.error("Subscription check error", err);
    }
  } else {
    await signInAnonymously(auth);
  }
});

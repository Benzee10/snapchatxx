// firebase-config.js
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyB2kxR_sdUY7bmluAkLqh6MDbSb46J-VJo",
  authDomain: "companion-app-a38db.firebaseapp.com",
  projectId: "companion-app-a38db",
  storageBucket: "companion-app-a38db.firebasestorage.app",
  messagingSenderId: "448219824645",
  appId: "1:448219824645:web:567775c25d6b8c560e126c",
};

export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);

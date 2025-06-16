import { auth } from './firebase.js';
import { db } from './firebase.js';
import { doc, getDoc } from "firebase/firestore";

const modelsUrl = "./assets/models.json";
let models = [];
let userUID = null;
let subscribed = false;

// On window load
window.addEventListener("load", async () => {
  showLoader(true);
  showSkeletons(); // show placeholder cards while loading
  await handleAuthState();
  await loadModels();
  showLoader(false);
});

// Handle login & UID
async function handleAuthState() {
  return new Promise((resolve) => {
    auth.onAuthStateChanged(async (user) => {
      const uidSpan = document.getElementById("user-uid");

      if (user) {
        userUID = user.uid;
        uidSpan.textContent = user.uid;
        subscribed = await checkSubscription(user.uid);
      } else {
        userUID = null;
        uidSpan.textContent = "Not logged in";
        subscribed = false;
        document.getElementById("subscription-info").textContent = "Please log in.";
      }

      resolve();
    });
  });
}

// Check subscription status
async function checkSubscription(uid) {
  const subRef = doc(db, "subscribers", uid);
  try {
    const snap = await getDoc(subRef);
    if (!snap.exists()) throw new Error("not_subscribed");

    const data = snap.data();
    if (!data.expiresAt || typeof data.expiresAt.toDate !== "function") {
      throw new Error("invalid_expiration");
    }

    const expireDate = data.expiresAt.toDate();
    const timeLeft = expireDate - new Date();

    if (timeLeft <= 0) throw new Error("expired");

    const days = Math.floor(timeLeft / (1000 * 60 * 60 * 24));
    const hours = Math.floor((timeLeft / (1000 * 60 * 60)) % 24);
    const countdown = `${days} day(s) ${hours} hour(s) left`;

    document.getElementById("subscription-info").textContent = countdown;
    return true;
  } catch {
    document.getElementById("subscription-info").textContent = "Not subscribed.";
    return false;
  }
}

// Load model profiles from JSON
async function loadModels() {
  try {
    const res = await fetch(modelsUrl);
    models = await res.json();
    renderModels(models);
  } catch (err) {
    console.error("Failed to load models:", err);
    document.getElementById("profile-gallery").innerHTML = "<p>Error loading profiles.</p>";
  }
}

// Show fake skeleton cards while loading
function showSkeletons(count = 6) {
  const gallery = document.getElementById("profile-gallery");
  gallery.innerHTML = "";
  for (let i = 0; i < count; i++) {
    const card = document.createElement("div");
    card.className = "skeleton-card";
    gallery.appendChild(card);
  }
}

// Render all models or filtered results
function renderModels(data) {
  const gallery = document.getElementById("profile-gallery");
  gallery.innerHTML = "";

  if (!Array.isArray(data) || data.length === 0) {
    gallery.innerHTML = "<p>No profiles found.</p>";
    return;
  }

  data.forEach((model) => {
    const card = document.createElement("div");
    card.className = "profile-card";
    card.innerHTML = `
      <img src="${model.imageUrl}" alt="${model.name}" />
      <div class="card-info">
        <h2>${model.name}</h2>
        <p class="bio">${model.bio}</p>
        <p class="country">${model.country}</p>
        ${
          subscribed
            ? `<a href="https://wa.me/${model.whatsapp.replace(/\D/g, '')}" target="_blank">
                <button class="chat-btn">Chat on WhatsApp</button>
              </a>`
            : `<button class="chat-btn" onclick="alert('Access locked. Please subscribe.')">Unlock WhatsApp</button>`
        }
      </div>`;
    gallery.appendChild(card);
  });
}

// Loader visibility
function showLoader(visible) {
  document.getElementById("loader").style.display = visible ? "flex" : "none";
}

// Filtering by country and search
document.getElementById("country").addEventListener("change", filterModels);
document.getElementById("search").addEventListener("input", filterModels);

function filterModels() {
  const country = document.getElementById("country").value.toLowerCase();
  const search = document.getElementById("search").value.toLowerCase();

  const filtered = models.filter((m) => {
    const nameMatch = m.name.toLowerCase().includes(search);
    const countryMatch = !country || m.country.toLowerCase() === country;
    return nameMatch && countryMatch;
  });

  renderModels(filtered);
}

// UID copy button
document.getElementById("copy-uid").addEventListener("click", () => {
  const uid = document.getElementById("user-uid").textContent;
  if (!uid || uid === "Not logged in") {
    alert("No UID available. Please log in first.");
    return;
  }

  navigator.clipboard.writeText(uid).then(() => {
    alert("UID copied to clipboard.");
  });
});

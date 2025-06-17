import { createClient } from "https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm";

const supabase = createClient(
  "https://vcgexvujgvfwbaktnwry.supabase.co",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZjZ2V4dnVqZ3Zmd2Jha3Rud3J5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTAxNjUzNDgsImV4cCI6MjA2NTc0MTM0OH0.6DvFHYliTSOloejLDWysgpjvS0f5YAm61q1Zq-OMU8k"
);

let models = [];

async function checkAuthAndLoad() {
  const { data: { session } } = await supabase.auth.getSession();
  if (!session) {
    alert("Please log in first.");
    window.location.href = "auth.html";
    return;
  }

  const user = session.user;
  const { data: userData, error } = await supabase
    .from("users")
    .select("subscribed, subscription_expires")
    .eq("id", user.id)
    .single();

  if (error || !userData) {
    alert("User not found in database. Contact admin.");
    return;
  }

  // Auto-expire if time is up
  const now = new Date();
  const expires = new Date(userData.subscription_expires);
  if (expires < now) {
    await supabase
      .from("users")
      .update({ subscribed: false })
      .eq("id", user.id);
    userData.subscribed = false;
  }

  if (!userData.subscribed) {
    document.getElementById("locked").style.display = "block";
    document.getElementById("loader").style.display = "none";
    return;
  }

  document.getElementById("filters").style.display = "flex";
  loadModels();
}

async function loadModels() {
  const { data, error } = await supabase
    .from("users")
    .select("*")
    .eq("subscribed", true);

  if (error) {
    console.error("Failed to load profiles", error);
    return;
  }

  models = data;
  displayModels(models);
}

function displayModels(data) {
  const gallery = document.getElementById("profile-gallery");
  gallery.innerHTML = "";
  document.getElementById("loader").style.display = "none";

  if (data.length === 0) {
    gallery.innerHTML = "<p>No profiles found.</p>";
    return;
  }

  data.forEach((model) => {
    const card = document.createElement("div");
    card.className = "profile-card";
    card.innerHTML = `
      <img src="${model.image_url}" alt="${model.name}" />
      <div class="card-info">
        <h2>${model.name}</h2>
        <p class="bio">${model.bio}</p>
        <p class="country">${model.country}</p>
        <a href="https://wa.me/${model.whatsapp}" target="_blank">
          <button>Chat on WhatsApp</button>
        </a>
      </div>`;
    gallery.appendChild(card);
  });
}

function filterModels() {
  const country = document.getElementById("country").value.toLowerCase();
  const search = document.getElementById("search").value.toLowerCase();

  const filtered = models.filter((m) => {
    const nameMatch = m.name.toLowerCase().includes(search);
    const countryMatch = country === "" || m.country.toLowerCase() === country;
    return nameMatch && countryMatch;
  });

  displayModels(filtered);
}

document.getElementById("country").addEventListener("change", filterModels);
document.getElementById("search").addEventListener("input", filterModels);

checkAuthAndLoad();

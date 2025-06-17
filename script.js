import { supabase } from './supabase-config.js';

let models = [];

async function loadModels() {
  const { data, error } = await supabase.from('models').select('*');
  if (error) {
    console.error("Error loading models", error);
    document.getElementById("profile-gallery").innerHTML = "<p>Failed to load profiles.</p>";
    return;
  }
  models = data;
  displayModels(models);
}

function displayModels(data) {
  const gallery = document.getElementById("profile-gallery");
  gallery.innerHTML = "";
  if (data.length === 0) {
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
        <button onclick="unlock('${model.whatsapp}')">Chat on WhatsApp</button>
      </div>`;
    gallery.appendChild(card);
  });
}

window.unlock = function (number) {
  const subscribed = localStorage.getItem('subscribed') === 'true';
  if (subscribed) {
    window.open(`https://wa.me/${number.replace('+', '')}`, "_blank");
  } else {
    alert("This profile is locked. Subscribe to unlock full contact.");
  }
};

function checkSubscriptionExpiry() {
  const expiry = localStorage.getItem('sub_expiry');
  if (expiry && Date.now() > parseInt(expiry)) {
    localStorage.setItem('subscribed', 'false');
  }
}
checkSubscriptionExpiry();

document.getElementById("country").addEventListener("change", filterModels);
document.getElementById("search").addEventListener("input", filterModels);

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

window.addEventListener("load", loadModels);

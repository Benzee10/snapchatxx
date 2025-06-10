let modelsData = {};
let currentModels = [];
const countrySelect = document.getElementById("countrySelect");
const searchInput = document.getElementById("searchInput");
const modelsContainer = document.getElementById("modelsContainer");

// Load JSON
fetch("data/models.json")
  .then(res => res.json())
  .then(data => {
    modelsData = data;
    populateCountrySelect();
  })
  .catch(err => console.error("Error loading model data:", err));

function populateCountrySelect() {
  Object.keys(modelsData).forEach(country => {
    const option = document.createElement("option");
    option.value = country;
    option.textContent = country;
    countrySelect.appendChild(option);
  });
}

function clearModels() {
  modelsContainer.innerHTML = "";
}

function renderModels(models) {
  clearModels();
  currentModels = models;

  models.forEach(model => {
    const card = document.createElement("div");
    card.className = "model-card";

    card.innerHTML = `
      <img src="${model.photo}" class="model-photo" alt="${model.name}" />
      <div class="model-name">${model.name}, ${model.age}</div>
      <div class="model-bio">${model.bio}</div>
      <div class="model-price">Subscription: $${model.price}</div>
      <button class="chat-btn" id="pay-${model.id}">Pay & Chat</button>
    `;

    card.querySelector("button").addEventListener("click", () => handlePayment(model));
    modelsContainer.appendChild(card);
  });
}

countrySelect.addEventListener("change", e => {
  const country = e.target.value;
  if (modelsData[country]) {
    renderModels(modelsData[country]);
  }
});

searchInput.addEventListener("input", e => {
  const searchTerm = e.target.value.toLowerCase();
  const filtered = currentModels.filter(model =>
    model.name.toLowerCase().includes(searchTerm)
  );
  renderModels(filtered);
});

function handlePayment(model) {
  const tg = window.Telegram.WebApp;
  tg.MainButton.text = `Pay $${model.price} to chat with ${model.name}`;
  tg.MainButton.show();

  tg.MainButton.onClick(() => {
    tg.MainButton.setText("Processing...");
    const fakeSuccess = true;

    if (fakeSuccess) {
      tg.MainButton.hide();
      openWhatsAppChat(model.whatsapp, model.name);
    }
  });
}

function openWhatsAppChat(number, name) {
  const message = encodeURIComponent(`Hi ${name}, I’m ready to chat!`);
  const waURL = `https://wa.me/${number.replace(/\D/g, "")}?text=${message}`;
  window.open(waURL, "_blank");
}

let modelsData = {};
const countrySelect = document.getElementById("countrySelect");
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

function renderModels(country) {
  clearModels();
  if (!modelsData[country]) return;

  modelsData[country].forEach(model => {
    const card = document.createElement("div");
    card.className = "model-card";

    card.innerHTML = `
      <img src="${model.photo}" class="model-photo" alt="${model.name}" />
      <div class="model-info">
        <div class="model-name">${model.name}, ${model.age}</div>
        <div class="model-bio">${model.bio}</div>
        <div class="model-price">Subscription: $${model.price}</div>
      </div>
      <button class="chat-btn enabled" id="pay-${model.id}">Pay & Chat</button>
    `;

    const btn = card.querySelector(`#pay-${model.id}`);
    btn.addEventListener("click", () => handlePayment(model));
    modelsContainer.appendChild(card);
  });
}

countrySelect.addEventListener("change", e => {
  renderModels(e.target.value);
});

// Simulated payment + Telegram Payments (test flow)
function handlePayment(model) {
  const tg = window.Telegram.WebApp;

  tg.MainButton.text = `Pay $${model.price} to chat with ${model.name}`;
  tg.MainButton.show();

  tg.MainButton.onClick(() => {
    tg.MainButton.setText("Processing...");

    // Simulate payment - you would use your backend to generate a real invoice
    const fakePaymentSuccess = true; // simulate it

    if (fakePaymentSuccess) {
      tg.MainButton.hide();
      openWhatsAppChat(model.whatsapp, model.name);
    } else {
      alert("Payment failed.");
      tg.MainButton.setText("Try Again");
    }
  });
}

function openWhatsAppChat(number, name) {
  const encodedMsg = encodeURIComponent(`Hi ${name}, I'm ready to chat! 😍`);
  const chatURL = `https://wa.me/${number.replace(/\D/g, "")}?text=${encodedMsg}`;
  window.open(chatURL, "_blank");
}

async function loadModels(country) {
  try {
    const res = await fetch('assets/models.json');
    const data = await res.json();
    return data[country] || [];
  } catch (e) {
    console.error("Failed to load model data", e);
    return [];
  }
}

const countrySelect = document.getElementById('countrySelect');
const modelList = document.getElementById('modelList');
const subscriptionStatus = document.getElementById('subscriptionStatus');

const hasSubscription = () => localStorage.getItem('premium') === 'true';

const promptSubscription = () => {
  if (confirm("Unlock premium access to chat with models. Subscribe now for $10/month?")) {
    // Simulate real payment or integrate Stripe/Telegram here
    localStorage.setItem('premium', 'true');
    alert("Subscription successful! Enjoy full access.");
    updateSubscriptionStatus();
  }
};

const updateSubscriptionStatus = () => {
  if (hasSubscription()) {
    subscriptionStatus.textContent = "✅ Premium Access Active";
    subscriptionStatus.style.color = "#22c55e";
  } else {
    subscriptionStatus.textContent = "🚫 Premium Access Locked - Subscribe to unlock WhatsApp chats.";
    subscriptionStatus.style.color = "#f87171";
  }
};

countrySelect.addEventListener('change', async () => {
  const selected = countrySelect.value;
  modelList.innerHTML = '';
  const models = await loadModels(selected);

  models.forEach(model => {
    const card = document.createElement('div');
    card.className = 'model-card';

    card.innerHTML = `
      ${hasSubscription() ? '<div class="badge">Premium</div>' : ''}
      <img src="${model.image}" alt="${model.name}" />
      <h3>${model.name}, ${model.age}</h3>
      <p>${model.bio}</p>
      <a class="chat-btn" href="#" data-whatsapp="${model.whatsapp}" data-price="${model.price}">
        💬 Chat on WhatsApp ($${model.price})
      </a>
    `;

    modelList.appendChild(card);
  });

  document.querySelectorAll('.chat-btn').forEach(btn => {
    btn.addEventListener('click', e => {
      e.preventDefault();
      if (!hasSubscription()) {
        promptSubscription();
      } else {
        const phone = btn.getAttribute('data-whatsapp');
        window.open(`https://wa.me/${phone}?text=Hi%20I%20want%20to%20chat%20with%20you`, '_blank');
      }
    });
  });
});

updateSubscriptionStatus();

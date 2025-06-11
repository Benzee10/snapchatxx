
// Wait for Telegram Mini App to initialize
window.Telegram.WebApp.ready();

let telegramUserId = null;
document.addEventListener('DOMContentLoaded', async () => {
  const user = Telegram.WebApp.initDataUnsafe?.user;
  telegramUserId = user?.id;

  updateSubscriptionStatus();
  loadAllModels(); // populate list on load
});

// Check local storage for subscription
function hasSubscription() {
  return localStorage.getItem('premium') === 'true';
}

function updateSubscriptionStatus() {
  const el = document.getElementById('subscriptionStatus');
  if (hasSubscription()) {
    el.textContent = '✅ Premium Access Active';
    el.style.color = '#22c55e';
  } else {
    el.textContent = '🚫 Premium Locked — Subscribe to chat';
    el.style.color = '#f87171';
  }
}

// Load models data and render
async function loadAllModels() {
  const country = document.getElementById('countrySelect').value;
  if (!country) return;

  let models = [];
  try {
    const res = await fetch('/assets/models.json');
    const data = await res.json();
    models = data[country] || [];
  } catch (e) {
    console.error('Failed to load models:', e);
    return;
  }

  const container = document.getElementById('modelList');
  container.innerHTML = '';

  models.forEach(m => {
    const card = document.createElement('div');
    card.className = 'model-card';
    card.innerHTML = `
      ${hasSubscription() ? '<div class="badge">Premium</div>' : ''}
      <img src="${m.image}" alt="${m.name}"/>
      <h3>${m.name}, ${m.age}</h3>
      <p>${m.bio}</p>
      <button class="chat-btn">💬 Chat ($${m.price})</button>
    `;
    container.appendChild(card);

    card.querySelector('.chat-btn').addEventListener('click', () => {
      if (hasSubscription()) {
        window.open(`https://wa.me/${m.whatsapp}`, '_blank');
      } else {
        startPayment();
      }
    });
  });
}

// Setup the country select listener
document.getElementById('countrySelect').addEventListener('change', loadAllModels);

// Trigger FreeKassa payment redirect
function startPayment() {
  if (!telegramUserId) {
    alert('Unable to detect Telegram user. Please reopen the mini-app.');
    return;
  }

  const amount = 5; // can be made dynamic per model
  const payUrl = `https://pay.freekassa.ru/?m=62869&oa=${amount}&o=${telegramUserId}&currency=USD`;
  window.location.href = payUrl;
}

import { db } from '../firebase-config.js';

let telegramUserId = null;

window.Telegram.WebApp.ready();

window.addEventListener('DOMContentLoaded', async () => {
  const user = Telegram.WebApp.initDataUnsafe?.user;
  telegramUserId = user?.id;

  const status = document.getElementById('subscriptionStatus');
  const res = await fetch(`/api/check-paid?userId=${telegramUserId}`);
  const { paid } = await res.json();

  if (paid) localStorage.setItem('premium', 'true');
  else localStorage.setItem('premium', 'false');

  updateSubscriptionStatus();
});

function hasSubscription() {
  return localStorage.getItem('premium') === 'true';
}

function updateSubscriptionStatus() {
  const status = document.getElementById('subscriptionStatus');
  if (hasSubscription()) {
    status.textContent = '✅ Premium Access Active';
    status.style.color = '#22c55e';
  } else {
    status.textContent = '🚫 Premium Locked - subscribe to chat';
    status.style.color = '#f87171';
  }
}

async function loadModels(country) {
  const res = await fetch('assets/models.json');
  const data = await res.json();
  return data[country] || [];
}

document.getElementById('countrySelect').addEventListener('change', async () => {
  const models = await loadModels(countrySelect.value);
  modelList.innerHTML = '';
  models.forEach(m => {
    const card = document.createElement('div');
    card.className = 'model-card';
    card.innerHTML = `
      ${hasSubscription() ? '<div class="badge">Premium</div>' : ''}
      <img src="${m.image}" alt="${m.name}"/>
      <h3>${m.name}, ${m.age}</h3>
      <p>${m.bio}</p>
      <button class="chat-btn" data-whatsapp="${m.whatsapp}" data-price="${m.price}">
        💬 Chat ($${m.price})
      </button>
    `;
    modelList.appendChild(card);
    
    card.querySelector('.chat-btn').onclick = () => {
      if (hasSubscription()) {
        window.open(`https://wa.me/${m.whatsapp}`, '_blank');
      } else {
        return startPayment();
      }
    };
  });
});

function startPayment() {
  const amount = 5; // Modify as needed or make dynamic
  const payUrl = `https://pay.freekassa.ru/?m=62869&oa=${amount}&o=${telegramUserId}&currency=USD`;
  window.location.href = payUrl;
}

let models = [];

fetch('data/models.json')
  .then(res => res.json())
  .then(data => {
    models = data;
    renderModels(models);
  });

const container = document.getElementById('modelContainer');
const searchInput = document.getElementById('searchInput');
const countrySelect = document.getElementById('countrySelect');

searchInput.addEventListener('input', () => {
  filterModels();
});

countrySelect.addEventListener('change', () => {
  filterModels();
});

function filterModels() {
  const search = searchInput.value.toLowerCase();
  const country = countrySelect.value;

  const filtered = models.filter(m =>
    (country === 'all' || m.country === country) &&
    m.name.toLowerCase().includes(search)
  );

  renderModels(filtered);
}

function renderModels(modelList) {
  container.innerHTML = "";

  modelList.forEach(model => {
    const card = document.createElement("div");
    card.className = "model-card";

    card.innerHTML = `
      <img src="${model.image}" alt="${model.name}" />
      <h3>${model.name}</h3>
      <p>${model.country}</p>
      <p>${model.bio}</p>
      <button onclick="handlePayment('${model.whatsapp}')">Chat</button>
      <div class="favorite" onclick="toggleFavorite(this)">❤️</div>
    `;

    container.appendChild(card);
  });
}

function toggleFavorite(el) {
  el.classList.toggle("active");
}

// This function simulates Telegram Payments
function handlePayment(whatsappLink) {
  // Simulate payment confirmation
  const confirmed = confirm("Confirm payment to chat?");
  if (confirmed) {
    window.open(`https://wa.me/${whatsappLink}`, '_blank');
  }
}

const spinner = document.getElementById("loadingSpinner");
const toggle = document.getElementById("darkModeToggle");

toggle.addEventListener("change", () => {
  document.body.classList.toggle("dark-mode");
});

spinner.style.display = "block";
fetch("data/models.json")
  .then(res => res.json())
  .then(data => {
    spinner.style.display = "none";
    models = data;
    renderModels(models);
  });


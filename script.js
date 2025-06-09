const modelData = {
  nigeria: [
    {
      name: "Queen B",
      age: 24,
      bio: "Thick and sweet, based in Lagos",
      image: "https://yourdomain.com/images/queenb.jpg",
      whatsapp: "2348123456789",
      price: 5
    },
    {
      name: "Nia",
      age: 22,
      bio: "Petite beauty, Abuja based",
      image: "https://yourdomain.com/images/nia.jpg",
      whatsapp: "2348034567890",
      price: 4
    }
  ],
  southafrica: [
    {
      name: "Zoe",
      age: 25,
      bio: "Sultry and stylish from Johannesburg",
      image: "https://yourdomain.com/images/zoe.jpg",
      whatsapp: "27712345678",
      price: 6
    }
  ],
  usa: [
    {
      name: "Lola",
      age: 27,
      bio: "Blonde bombshell from LA",
      image: "https://yourdomain.com/images/lola.jpg",
      whatsapp: "12025550123",
      price: 10
    }
  ]
};

const countrySelect = document.getElementById('countrySelect');
const modelList = document.getElementById('modelList');

countrySelect.addEventListener('change', () => {
  const selected = countrySelect.value;
  modelList.innerHTML = '';

  if (!selected || !modelData[selected]) return;

  modelData[selected].forEach(model => {
    const card = document.createElement('div');
    card.className = 'model-card';
    card.innerHTML = `
      <img src="${model.image}" alt="${model.name}" />
      <h3>${model.name}, ${model.age}</h3>
      <p>${model.bio}</p>
      <a class="chat-btn" href="https://wa.me/${model.whatsapp}?text=Hi%20I%20want%20to%20chat%20with%20you" target="_blank">
        💬 Chat on WhatsApp ($${model.price})
      </a>
    `;
    modelList.appendChild(card);
  });
});

import { createClient } from "https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm";

const supabase = createClient(
  "https://vcgexvujgvfwbaktnwry.supabase.co",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZjZ2V4dnVqZ3Zmd2Jha3Rud3J5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTAxNjUzNDgsImV4cCI6MjA2NTc0MTM0OH0.6DvFHYliTSOloejLDWysgpjvS0f5YAm61q1Zq-OMU8k"
);

const ADMIN_PASSWORD = "F7b4ebee";

let userList = [];

window.checkPassword = async function () {
  const pass = document.getElementById("admin-pass").value;
  if (pass === ADMIN_PASSWORD) {
    document.getElementById("password-protect").style.display = "none";
    document.getElementById("admin-panel").style.display = "block";
    await loadUnsubscribedUsers();
  } else {
    document.getElementById("pass-status").textContent = "Wrong password!";
  }
};

async function loadUnsubscribedUsers() {
  const { data, error } = await supabase
    .from("users")
    .select("id, email, phone")
    .eq("subscribed", false);

  const select = document.getElementById("user-select");
  userList = data || [];

  userList.forEach((user) => {
    const option = document.createElement("option");
    option.value = user.id;
    option.textContent = user.email;
    select.appendChild(option);
  });
}

window.approveUser = async function () {
  const userId = document.getElementById("user-select").value;
  const expires = document.getElementById("expire-date").value;
  const expiration = new Date(expires).toISOString();

  if (!userId || !expires) {
    document.getElementById("status-msg").textContent = "Please select user and expiration date.";
    return;
  }

  const { error } = await supabase
    .from("users")
    .update({
      subscribed: true,
      subscription_expires: expiration
    })
    .eq("id", userId);

  if (error) {
    document.getElementById("status-msg").textContent = "❌ Failed to approve.";
  } else {
    const user = userList.find(u => u.id === userId);
    document.getElementById("status-msg").textContent = `✅ ${user.email} approved!`;

    if (user.phone) {
      const msg = encodeURIComponent(`Hey! You've been approved on Escort App. Subscription valid till ${expires}.`);
      document.getElementById("whatsapp-link").href = `https://wa.me/${user.phone.replace(/\D/g, "")}?text=${msg}`;
      document.getElementById("whatsapp-container").style.display = "block";
    }
  }
};

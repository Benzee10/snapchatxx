import { createClient } from "https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm";

const supabase = createClient(
  "https://vcgexvujgvfwbaktnwry.supabase.co",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZjZ2V4dnVqZ3Zmd2Jha3Rud3J5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTAxNjUzNDgsImV4cCI6MjA2NTc0MTM0OH0.6DvFHYliTSOloejLDWysgpjvS0f5YAm61q1Zq-OMU8k"
);

const ADMIN_PASSWORD = "F7b4ebee"; // your custom admin password

window.checkPassword = function () {
  const pass = document.getElementById("admin-pass").value;
  if (pass === ADMIN_PASSWORD) {
    document.getElementById("password-protect").style.display = "none";
    document.getElementById("admin-panel").style.display = "block";
  } else {
    document.getElementById("pass-status").textContent = "Wrong password!";
  }
};

window.approveUser = async function () {
  const userId = document.getElementById("user-id").value.trim();
  const expires = document.getElementById("expire-date").value;
  const expiration = new Date(expires).toISOString();

  let query;

  if (userId.includes("@")) {
    // Email
    const { data: user, error } = await supabase
      .from("users")
      .select("id")
      .ilike("email", userId)
      .single();

    if (error || !user) {
      document.getElementById("status-msg").textContent = "User not found.";
      return;
    }
    query = { id: user.id };
  } else {
    // UID
    query = { id: userId };
  }

  const { error: updateError } = await supabase
    .from("users")
    .update({
      subscribed: true,
      subscription_expires: expiration,
    })
    .match(query);

  if (updateError) {
    document.getElementById("status-msg").textContent = "Failed to update.";
  } else {
    document.getElementById("status-msg").textContent = "User approved ✅";
  }
};

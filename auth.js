import { createClient } from "https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm";

const supabase = createClient(
  "https://vcgexvujgvfwbaktnwry.supabase.co",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZjZ2V4dnVqZ3Zmd2Jha3Rud3J5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTAxNjUzNDgsImV4cCI6MjA2NTc0MTM0OH0.6DvFHYliTSOloejLDWysgpjvS0f5YAm61q1Zq-OMU8k"
);

let mode = "login";

const emailInput = document.getElementById("email");
const passInput = document.getElementById("password");
const submitBtn = document.getElementById("submit");
const toggleBtn = document.getElementById("toggle-mode");
const formTitle = document.getElementById("form-title");

submitBtn.onclick = async () => {
  const email = emailInput.value.trim();
  const password = passInput.value;

  if (!email || !password) return alert("Please fill in all fields");

  if (mode === "login") {
    const { error, data } = await supabase.auth.signInWithPassword({ email, password });
    if (error) return alert("Login failed: " + error.message);
  } else {
    const { error } = await supabase.auth.signUp({ email, password });
    if (error) return alert("Registration failed: " + error.message);
    alert("Registered! Now login.");
    toggle();
    return;
  }

  location.href = "viewer.html";
};

toggleBtn.onclick = toggle;

function toggle() {
  mode = mode === "login" ? "register" : "login";
  formTitle.innerText = mode === "login" ? "Login" : "Register";
  submitBtn.innerText = mode === "login" ? "Login" : "Register";
  toggleBtn.innerText = mode === "login"
    ? "Don’t have an account? Register"
    : "Already have an account? Login";
}

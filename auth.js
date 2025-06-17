import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm';

const supabase = createClient(
  'https://vcgexvujgvfwbaktnwry.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZjZ2V4dnVqZ3Zmd2Jha3Rud3J5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTAxNjUzNDgsImV4cCI6MjA2NTc0MTM0OH0.6DvFHYliTSOloejLDWysgpjvS0f5YAm61q1Zq-OMU8k'
);

const title = document.getElementById('title');
const email = document.getElementById('email');
const password = document.getElementById('password');
const submit = document.getElementById('submit');
const toggle = document.getElementById('toggle');

let mode = 'login';

toggle.addEventListener('click', () => {
  if (mode === 'login') {
    mode = 'register';
    title.innerText = 'Register';
    submit.innerText = 'Register';
    toggle.innerText = 'Already have an account? Login';
  } else {
    mode = 'login';
    title.innerText = 'Login';
    submit.innerText = 'Login';
    toggle.innerText = 'Don’t have an account? Register';
  }
});

submit.addEventListener('click', async () => {
  const e = email.value.trim();
  const p = password.value;

  if (!e || !p) return alert('Please fill in all fields.');

  if (mode === 'login') {
    const { error } = await supabase.auth.signInWithPassword({ email: e, password: p });
    if (error) return alert('Login error: ' + error.message);
  } else {
    const { error } = await supabase.auth.signUp({ email: e, password: p });
    if (error) return alert('Signup error: ' + error.message);
    alert('Registered! Please login.');
    toggle.click();
    return;
  }

  window.location.href = 'index.html';
});

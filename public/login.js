const form = document.getElementById('loginForm');
const msg = document.getElementById('message');
const submitBtn = document.getElementById('submitBtn');

const emailInput = document.getElementById('email');
const pwInput = document.getElementById('password');

const emailHint = document.getElementById('emailHint');
const passwordHint = document.getElementById('passwordHint');

function show(text, cls){
  msg.textContent = text;
  msg.className = cls || '';
}

function validateEmail(v){
  return /^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(v);
}

function updateSubmit(){
  const ok = validateEmail(emailInput.value.trim()) && pwInput.value.length >= 6;
  submitBtn.disabled = !ok;
}

emailInput.addEventListener('input', () => {
  if (validateEmail(emailInput.value.trim())){
    emailInput.classList.add('valid'); emailInput.classList.remove('invalid');
    emailHint.textContent = '';
  } else {
    emailInput.classList.add('invalid'); emailInput.classList.remove('valid');
    emailHint.textContent = 'Formato de correo inválido';
  }
  updateSubmit();
});

pwInput.addEventListener('input', () => {
  if (pwInput.value.length >= 6){
    pwInput.classList.add('valid'); pwInput.classList.remove('invalid');
    passwordHint.textContent = '';
  } else {
    pwInput.classList.add('invalid'); pwInput.classList.remove('valid');
    passwordHint.textContent = 'Mínimo 6 caracteres';
  }
  updateSubmit();
});

form.addEventListener('submit', async (e) => {
  e.preventDefault();
  show('', '');
  const email = emailInput.value.trim();
  const password = pwInput.value;

  if (!validateEmail(email)) return show('Correo inválido', 'error');
  if (password.length < 6) return show('La contraseña es muy corta', 'error');

  try{
    submitBtn.disabled = true;
    show('Iniciando sesión...');
    const res = await fetch('/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });
    const data = await res.json();
    if (!res.ok) {
      show(data?.error || 'Error al iniciar sesión', 'error');
      submitBtn.disabled = false;
      return;
    }

    // Guardar token y redirigir
    try { localStorage.setItem('token', data.token); } catch(_){}
    show('Login exitoso. Redirigiendo…', 'success');
    setTimeout(() => window.location.href = '/', 800);
  } catch(err){
    console.error(err);
    show('No se pudo conectar con el servidor', 'error');
    submitBtn.disabled = false;
  }
});

const form = document.getElementById('registerForm');
const msg = document.getElementById('message');
const submitBtn = document.getElementById('submitBtn');

const nameInput = document.getElementById('name');
const emailInput = document.getElementById('email');
const pwInput = document.getElementById('password');
const confirmInput = document.getElementById('passwordConfirm');
const pwBar = document.getElementById('pwBar');

const nameHint = document.getElementById('nameHint');
const emailHint = document.getElementById('emailHint');
const passwordHint = document.getElementById('passwordHint');
const confirmHint = document.getElementById('confirmHint');

function show(text, cls){
  msg.textContent = text;
  msg.className = cls || '';
}

function validateEmail(v){
  return /^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(v);
}

function passwordStrength(pw){
  let score = 0;
  if (pw.length >= 6) score++;
  if (/[A-Z]/.test(pw)) score++;
  if (/[0-9]/.test(pw)) score++;
  if (/[^A-Za-z0-9]/.test(pw)) score++;
  return score; // 0..4
}

function updateSubmitState(){
  const valid = nameInput.value.trim().length >=2 && validateEmail(emailInput.value.trim()) && pwInput.value.length >=6 && pwInput.value === confirmInput.value;
  submitBtn.disabled = !valid;
}

nameInput.addEventListener('input', () => {
  const v = nameInput.value.trim();
  if (v.length >= 2){
    nameInput.classList.add('valid'); nameInput.classList.remove('invalid');
    nameHint.textContent = '';
  } else {
    nameInput.classList.add('invalid'); nameInput.classList.remove('valid');
    nameHint.textContent = 'Ingrese al menos 2 caracteres';
  }
  updateSubmitState();
});

emailInput.addEventListener('input', () => {
  const v = emailInput.value.trim();
  if (validateEmail(v)){
    emailInput.classList.add('valid'); emailInput.classList.remove('invalid');
    emailHint.textContent = '';
  } else {
    emailInput.classList.add('invalid'); emailInput.classList.remove('valid');
    emailHint.textContent = 'Formato de correo inválido';
  }
  updateSubmitState();
});

pwInput.addEventListener('input', () => {
  const pw = pwInput.value;
  const score = passwordStrength(pw);
  const pct = Math.min(100, (score / 4) * 100);
  pwBar.style.width = pct + '%';
  pwBar.classList.remove('weak','medium','strong');
  if (score <=1) pwBar.classList.add('weak');
  else if (score <=3) pwBar.classList.add('medium');
  else pwBar.classList.add('strong');

  if (pw.length >= 6) {
    passwordHint.textContent = '';
    pwInput.classList.add('valid'); pwInput.classList.remove('invalid');
  } else {
    passwordHint.textContent = 'Mínimo 6 caracteres';
    pwInput.classList.add('invalid'); pwInput.classList.remove('valid');
  }

  // also update confirmation validity
  if (confirmInput.value.length) {
    if (pw === confirmInput.value) {
      confirmHint.textContent = '';
      confirmInput.classList.add('valid'); confirmInput.classList.remove('invalid');
    } else {
      confirmHint.textContent = 'No coincide';
      confirmInput.classList.add('invalid'); confirmInput.classList.remove('valid');
    }
  }

  updateSubmitState();
});

confirmInput.addEventListener('input', () => {
  if (confirmInput.value === pwInput.value) {
    confirmHint.textContent = '';
    confirmInput.classList.add('valid'); confirmInput.classList.remove('invalid');
  } else {
    confirmHint.textContent = 'No coincide';
    confirmInput.classList.add('invalid'); confirmInput.classList.remove('valid');
  }
  updateSubmitState();
});

form.addEventListener('submit', async (e) => {
  e.preventDefault();
  show('', '');

  const name = nameInput.value.trim();
  const email = emailInput.value.trim();
  const password = pwInput.value;
  const passwordConfirm = confirmInput.value;

  if (!name || name.length < 2) return show('Ingrese un nombre válido', 'error');
  if (!email || !validateEmail(email)) return show('Ingrese un correo válido', 'error');
  if (!password || password.length < 6) return show('La contraseña debe tener al menos 6 caracteres', 'error');
  if (password !== passwordConfirm) return show('Las contraseñas no coinciden', 'error');

  const [firstName, ...rest] = name.split(' ');

  try{
    show('Enviando…');
    submitBtn.disabled = true;
    const res = await fetch('/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ firstName, lastName: rest.join(' '), email, password })
    });

    const data = await res.json();
    if (!res.ok) {
      show(data?.error || 'Error del servidor', 'error');
      submitBtn.disabled = false;
      return;
    }

    show('Registro exitoso. Redirigiendo…', 'success');
    setTimeout(() => window.location.href = '/', 900);
  }catch(err){
    console.error(err);
    show('No se pudo conectar con el servidor', 'error');
    submitBtn.disabled = false;
  }
});

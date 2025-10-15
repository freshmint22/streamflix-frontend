const form = document.getElementById('registerForm');
const msg = document.getElementById('message');

function show(text, cls){
  msg.textContent = text;
  msg.className = cls || '';
}

form.addEventListener('submit', async (e) => {
  e.preventDefault();
  show('', '');

  const name = document.getElementById('name').value.trim();
  const email = document.getElementById('email').value.trim();
  const password = document.getElementById('password').value;
  const passwordConfirm = document.getElementById('passwordConfirm').value;

  if (!name || name.length < 2) return show('Ingrese un nombre válido', 'error');
  if (!email || !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) return show('Ingrese un correo válido', 'error');
  if (!password || password.length < 6) return show('La contraseña debe tener al menos 6 caracteres', 'error');
  if (password !== passwordConfirm) return show('Las contraseñas no coinciden', 'error');

  // Mapear campos al mock server: firstName, lastName (opcional), email, password
  const [firstName, ...rest] = name.split(' ');

  try{
    show('Enviando…');
    const res = await fetch('/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ firstName, lastName: rest.join(' '), email, password })
    });

    const data = await res.json();
    if (!res.ok) {
      show(data?.error || 'Error del servidor', 'error');
      return;
    }

    // Registro correcto (mock devuelve token)
    show('Registro exitoso. Redirigiendo…', 'success');
    setTimeout(() => {
      // En una app real: guardar token y redirigir
      window.location.href = '/';
    }, 900);
  }catch(err){
    console.error(err);
    show('No se pudo conectar con el servidor', 'error');
  }
});

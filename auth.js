(function(){
  function setUser(user){ if (user) localStorage.setItem('cwps:user', JSON.stringify(user)); else localStorage.removeItem('cwps:user'); }

  // Tab toggling (single file auth)
  const tabs = Array.from(document.querySelectorAll('.auth-card .tablink[data-auth]'));
  if (tabs.length) {
    tabs.forEach(b=> b.addEventListener('click', (e) => {
        e.preventDefault();
        tabs.forEach(x=>x.classList.remove('active')); b.classList.add('active');
        const isSignup = b.getAttribute('data-auth') === 'signup';
        document.getElementById('loginForm').classList.toggle('hidden', isSignup);
        document.getElementById('signupForm').classList.toggle('hidden', !isSignup);
    }));
  }

  // --- Inline Error Helpers ---
  function showAuthError(input, message) {
    let error = input.parentElement.querySelector('.input-error');
    if (!error) {
      error = document.createElement('div');
      error.className = 'input-error';
      input.parentElement.appendChild(error);
    }
    error.textContent = message;
    error.style.display = 'block';
  }
  function clearAuthErrors(formType) {
    const form = document.getElementById(formType === 'login' ? 'loginForm' : 'signupForm');
    form.querySelectorAll('.input-error').forEach(e => e.remove());
    form.querySelectorAll('input').forEach(i => i.removeAttribute('aria-invalid'));
  }

  // Login handling
  const loginForm = document.getElementById('loginForm');
  if (loginForm) loginForm.addEventListener('submit', (e)=>{
    e.preventDefault();
    const email = document.getElementById('loginEmail');
    const pass = document.getElementById('loginPassword');
    clearAuthErrors('login');
    let hasError = false;
    const saved = JSON.parse(localStorage.getItem('cwps:auth:'+email.value.trim())||'null');
    if (!saved) {
      showAuthError(email, 'No account found for this email.');
      email.setAttribute('aria-invalid', 'true');
      hasError = true;
    } else if (saved.password !== pass.value) {
      showAuthError(pass, 'Incorrect password.');
      pass.setAttribute('aria-invalid', 'true');
      hasError = true;
    }
    if (!hasError) {
      setUser({ email: email.value.trim(), name: saved.name||email.value.trim() });
      window.location.href = 'index.html';
    }
  });

  // Signup handling
  const signupForm = document.getElementById('signupForm');
  if (signupForm) signupForm.addEventListener('submit', (e)=>{
    e.preventDefault();
    const name = document.getElementById('signupName');
    const email = document.getElementById('signupEmail');
    const pass = document.getElementById('signupPassword');
    const confirm = document.getElementById('signupConfirm');
    clearAuthErrors('signup');
    let hasError = false;
    if (pass.value.length < 8) {
      showAuthError(pass, 'Password must be at least 8 characters');
      pass.setAttribute('aria-invalid', 'true');
      hasError = true;
    }
    if (pass.value !== confirm.value) {
      showAuthError(confirm, 'Passwords do not match');
      confirm.setAttribute('aria-invalid', 'true');
      hasError = true;
    }
    if (!hasError) {
      localStorage.setItem('cwps:auth:'+email.value.trim(), JSON.stringify({ name: name.value.trim(), password: pass.value }));
      setUser({ email: email.value.trim(), name: name.value.trim() });
      window.location.href = 'index.html';
    }
  });

  // Show/hide password toggles with aria + icon state
  document.querySelectorAll('.show-btn').forEach(btn => {
    btn.setAttribute('aria-pressed', 'false');
    btn.addEventListener('click', () => {
      const id = btn.getAttribute('data-target');
      const input = document.getElementById(id);
      const show = input.getAttribute('type') === 'password';
      input.setAttribute('type', show ? 'text' : 'password');
      btn.setAttribute('aria-pressed', String(show));
      btn.title = show ? 'Hide password' : 'Show password';
      btn.textContent = show ? '🙈' : '👁';
    });
  });
})();


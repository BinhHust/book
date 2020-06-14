/*eslint-disable*/
import '@babel/polyfill';
import { verifyToken } from './verifyToken';
import { signup, logout, login } from './auth';

const $verifyEmail = document.querySelector('.verify-email');
const $signupForm = document.getElementById('signup-form');
const $signupContainer = document.getElementById('signup-container');
const $loginForm = document.getElementById('login-form');
const $logoutBtn = document.getElementById('logout');

if ($verifyEmail) {
  $verifyEmail.addEventListener('click', () => {
    const token = window.location.pathname.split('/')[2];
    verifyToken(token);
  });
}

if ($signupForm) {
  $signupForm.addEventListener('submit', async e => {
    e.preventDefault();
    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const passwordConfirm = document.getElementById('passwordConfirm').value;

    const res = await signup({ name, email, password, passwordConfirm });

    if (res === 'success') {
      $signupContainer.innerHTML = `
        <p class="display-4 text-warning">Please check email to verify account.</p>
      `;
    }
  });
}

if ($loginForm) {
  $loginForm.addEventListener('submit', async e => {
    e.preventDefault();
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    const res = await login({ email, password });
  });
}

if ($logoutBtn) {
  $logoutBtn.addEventListener('click', logout);
}

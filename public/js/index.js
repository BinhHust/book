/*eslint-disable*/
import '@babel/polyfill';
import { verifyToken } from './verifyToken';
import { signup, logout, login } from './auth';
import { updateSetting } from './updateSetting';
import { actionToCart } from './cart';

const $verifyEmail = document.querySelector('.verify-email');
const $signupForm = document.getElementById('signup-form');
const $signupContainer = document.getElementById('signup-container');

const $loginForm = document.getElementById('login-form');
const $logoutBtn = document.getElementById('logout');

const $updateDataForm = document.getElementById('update-data-form');
const $updatePasswordForm = document.getElementById('update-password-form');
const $updatePasswordButton = document.getElementById('update-password-button');

const $booksContainer = document.getElementById('booksContainer');
const $cartContainer = document.getElementById('cartContainer');

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

if ($updateDataForm)
  $updateDataForm.addEventListener('submit', e => {
    e.preventDefault();
    const form = new FormData();
    form.append('name', document.getElementById('name').value);
    form.append('email', document.getElementById('email').value);
    form.append('photo', document.getElementById('photo').files[0]);

    updateSetting(form, 'data');
  });

if ($updatePasswordForm)
  $updatePasswordForm.addEventListener('submit', async e => {
    e.preventDefault();
    const passwordCurrent = document.getElementById('passwordCurrent').value;
    const password = document.getElementById('password').value;
    const passwordConfirm = document.getElementById('password').value;
    $updatePasswordButton.textContent = 'Updatting...';

    const res = await updateSetting(
      { passwordCurrent, password, passwordConfirm },
      'password'
    );

    $updatePasswordButton.textContent = 'Update password';
    if (res === 'success') {
      document.getElementById('passwordCurrent').value = '';
      document.getElementById('password').value = '';
      document.getElementById('passwordConfirm').value = '';
    }
  });

if ($booksContainer) {
  $booksContainer.addEventListener('click', e => {
    const $addToCartBtn = e.target.closest('#addToCart');
    if ($addToCartBtn) {
      const bookId = $addToCartBtn.dataset.bookId;
      // console.log(bookId);
      $addToCartBtn.textContent = 'Adding...';
      actionToCart('add', bookId);
    }
  });
}

if ($cartContainer) {
  $cartContainer.addEventListener('click', e => {
    const $deleteToCartBtn = e.target.closest('#deleteToCart');
    if ($deleteToCartBtn) {
      const bookId = $deleteToCartBtn.dataset.bookId;
      // console.log(bookId);
      $deleteToCartBtn.textContent = 'Deleting...';
      actionToCart('delete', bookId);
    }
  });
}

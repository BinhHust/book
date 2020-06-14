/*eslint-disable */

export const hideAlert = () => {
  const $alert = document.querySelector('.alert');
  if ($alert) {
    $alert.remove();
  }
};

export const showAlert = (message, type) => {
  hideAlert();

  const markup = `
    <div class="alert alert-${
      type === 'success' ? 'success' : 'danger'
    }" role="alert">
      ${message}
    </div>
  `;
  document.body.insertAdjacentHTML('afterbegin', markup);

  window.setTimeout(hideAlert, 5000);
};

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
    }" role="alert" style="position: fixed; top: 0; left: 50%; transform: translateX(-50%); z-index: 10">
      ${message}
    </div>
  `;
  document.body.insertAdjacentHTML('afterbegin', markup);

  window.setTimeout(hideAlert, 5000);
};

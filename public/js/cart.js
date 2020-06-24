/*eslint-disable*/
import axios from 'axios';
import { showAlert } from './alert';

export const actionToCart = async function(type, bookId) {
  let url;
  switch (type) {
    case 'add':
      url = `/api/v1/cart/addToCart/${bookId}`;
      break;
    case 'delete':
      url = `/api/v1/cart/deleteToCart/${bookId}`;
      break;
  }

  try {
    const res = await axios({
      method: 'GET',
      url
    });

    if (res.data.status === 'success') {
      showAlert(res.data.message, 'success');

      setTimeout(() => {
        location.reload(true);
      }, 1500);
    }
  } catch (err) {
    showAlert(err.response.data.message, 'error');
  }
};

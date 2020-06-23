/*eslint-disable*/
import axios from 'axios';
import { showAlert } from './alert';

export const addToCart = async function(bookId) {
  try {
    const res = await axios({
      method: 'GET',
      url: `/api/v1/cart/addToCart/${bookId}`
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

/*eslint-disable*/
import axios from 'axios';
import { showAlert } from './alert';

export const verifyToken = async function(token) {
  try {
    const res = await axios({
      method: 'GET',
      url: `/api/v1/users/verifyToken/${token}`
    });

    if (res.data.status === 'success') {
      showAlert('Verify token successfully.', 'success');
      window.setTimeout(() => {
        location.assign('/');
      }, 1500);
    }
  } catch (err) {
    showAlert(err.response.data.message, 'error');
  }
};

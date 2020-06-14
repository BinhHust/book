/*eslint-disable*/
import axios from 'axios';
import { showAlert } from './alert';

export const signup = async function(data) {
  try {
    const res = await axios({
      method: 'POST',
      url: '/api/v1/users/signup',
      data
    });
    return 'success';
  } catch (err) {
    showAlert(err.response.data.message, 'error');
    return 'error';
  }
};

export const login = async function(data) {
  try {
    const res = await axios({
      method: 'POST',
      url: '/api/v1/users/login',
      data
    });
    if ((res.data.status = 'success')) {
      showAlert('Login in successfull.', 'success');
      window.setTimeout(() => {
        location.assign('/');
      }, 1500);
    }
  } catch (err) {
    showAlert(err.response.data.message, 'error');
  }
};

export const logout = async () => {
  try {
    const res = await axios({
      method: 'GET',
      url: '/api/v1/users/logout'
    });
    if ((res.data.status = 'success')) location.reload(true);
  } catch (err) {
    console.log(err.response);
    showAlert('Error logging out! Try again.', 'error');
  }
};

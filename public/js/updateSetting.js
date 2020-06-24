/* eslint-disable */
import axios from 'axios';
import { showAlert } from './alert';

// type is either 'password' or 'data'
export const updateSetting = async (data, type) => {
  try {
    // console.log(data);
    const url =
      type === 'password'
        ? '/api/v1/users/updatePassword'
        : '/api/v1/users/updateMe';

    const res = await axios({
      method: 'PATCH',
      url,
      data
    });

    if (res.data.status === 'success') {
      showAlert(`${type.toUpperCase()} updated successfully!`, 'success');
    }

    return 'success';
  } catch (err) {
    showAlert(err.response.data.message, 'error');
    return 'error';
  }
};

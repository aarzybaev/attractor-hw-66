import axios from 'axios';

const axiosAPI = axios.create({
  baseURL: 'https://js23-arzybaev-default-rtdb.firebaseio.com',
});

export default axiosAPI;
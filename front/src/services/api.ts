import axios from 'axios';

const apiAxios = axios.create({
  baseURL: 'http://localhost:3000',
});

apiAxios.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');

    if (token) {
      config.headers.Authorization = `${token}`;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default apiAxios;
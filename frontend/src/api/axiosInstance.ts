import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: 'https://ai-assisted-job-application-tracker-production.up.railway.app/api',
});

axiosInstance.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default axiosInstance;
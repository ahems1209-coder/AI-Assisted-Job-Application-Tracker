import axios from 'axios';

const axiosInstance = axios.create({
  // This is your live Railway URL with /api at the end
  baseURL: 'https://ai-assisted-job-application-tracker-production.up.railway.app/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add a request interceptor to attach the token if it exists
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default axiosInstance;
import axios from 'axios';

const API = axios.create({
  baseURL: 'ai-assisted-job-application-tracker-production.up.railway.app',
});

// Automatically attach JWT token to every request
API.interceptors.request.use((req) => {
  const token = localStorage.getItem('token');
  if (token) {
    req.headers.Authorization = `Bearer ${token}`;
  }
  return req;
});

export default API;
import axios from 'axios';

const API = axios.create({
  // Use the env variable, or fall back to localhost if not set
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
});

// Automatically add the Admin Token to requests if it exists
API.interceptors.request.use((req) => {
  if (localStorage.getItem('adminToken')) {
    req.headers.Authorization = `Bearer ${localStorage.getItem('adminToken')}`;
  }
  return req;
});

export default API;
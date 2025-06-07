import axios from 'axios';

export const api = axios.create({
  baseURL: 'http://localhost:8000',
});

api.interceptors.request.use((config) => {
  const isPublicEndpoint = ['/api/users/', '/api/token/'].some((url) =>
    config.url?.startsWith(url)
  );
  const token = localStorage.getItem('access');
  if (!isPublicEndpoint && token && config.headers) {
    config.headers['Authorization'] = `Bearer ${token}`;
  }
  return config;
});

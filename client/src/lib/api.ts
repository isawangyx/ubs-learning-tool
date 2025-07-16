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

api.interceptors.response.use(null, async (error) => {
  if (error.response?.status === 401) {
    // try refreshing
    const refresh = localStorage.getItem('refresh');
    if (refresh) {
      const { data } = await axios.post('/api/token/refresh/', { refresh });
      localStorage.setItem('access', data.access);
      error.config.headers!['Authorization'] = `Bearer ${data.access}`;
      return axios.request(error.config);
    }
  }
  return Promise.reject(error);
});

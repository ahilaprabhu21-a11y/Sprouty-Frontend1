import axios from 'axios';

const baseURL = import.meta.env.VITE_API_URL || 'https://localhost:7028/api';

export const api = axios.create({ baseURL });

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('sprouty_token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

api.interceptors.response.use(
  (r) => r,
  (err) => {
    if (err?.response?.status === 401 && location.pathname !== '/login' && location.pathname !== '/signup') {
      localStorage.removeItem('sprouty_token');
      localStorage.removeItem('sprouty_user');
      location.href = '/login';
    }
    return Promise.reject(err);
  }
);

export async function uploadFile(file: File, subfolder = 'media'): Promise<{ url: string; mediaType: 'image' | 'video' }> {
  const fd = new FormData();
  fd.append('file', file);
  const { data } = await api.post(`/upload?subfolder=${encodeURIComponent(subfolder)}`, fd, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return data;
}

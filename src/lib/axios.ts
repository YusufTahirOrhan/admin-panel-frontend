import axios from 'axios';
import { useAuthStore } from '@/stores/auth-store';
import { authService } from './auth-service';
import { installAuthRefreshInterceptor } from './auth-interceptors';

export const api = axios.create({
  timeout: 15000,
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080',
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use(
  (config) => {
    let token = useAuthStore.getState().accessToken;
    if (!token && typeof window !== 'undefined') {
      try {
        const rawStorage = localStorage.getItem('optimaxx-auth-storage');
        if (rawStorage) {
          const parsed = JSON.parse(rawStorage);
          token = parsed?.state?.accessToken || null;
          if (token) {
            useAuthStore.getState().setAccessToken(token);
          }
        }
      } catch { /* Storage may be unavailable in private browsing. */ }
    }

    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }

    // Attach Device ID if available (from localStorage)
    if (typeof window !== 'undefined') {
      let deviceId = localStorage.getItem('deviceId');
      if (!deviceId) {
        deviceId = crypto.randomUUID();
        localStorage.setItem('deviceId', deviceId);
      }
      config.headers['X-Device-Id'] = deviceId;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

installAuthRefreshInterceptor(api, {
  refresh: () => authService.refresh(),
  getAccessToken: () => useAuthStore.getState().accessToken,
  setAccessToken: (token) => useAuthStore.getState().setAccessToken(token),
  onSessionExpired: () => {
    useAuthStore.getState().logout();
    if (typeof window !== 'undefined') {
      window.location.href = '/login';
    }
  },
});

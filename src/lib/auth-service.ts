import { useAuthStore } from '@/stores/auth-store';
import type { LoginFormData } from '@/lib/validations/auth-schemas';
import type { User } from '@/stores/auth-store';
import { api } from '@/lib/axios';

const PROXY_URL = '/api/auth';

interface LoginResponse {
  accessToken: string;
  user: User;
}

interface RefreshResponse {
  accessToken: string;
}

export const authService = {
  login: async (credentials: LoginFormData): Promise<LoginResponse> => {
    const res = await fetch(`${PROXY_URL}/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(credentials),
    });

    if (!res.ok) {
      const error = await res.json().catch(() => ({}));
      throw new Error(error.message || 'Login failed');
    }

    const data = (await res.json()) as LoginResponse;
    // Update Zustand
    useAuthStore.getState().setAccessToken(data.accessToken);
    useAuthStore.getState().setUser(data.user);
    
    return data;
  },

  refresh: async (): Promise<string> => {
    const res = await fetch(`${PROXY_URL}/refresh`, {
      method: 'POST',
    });

    if (!res.ok) {
      throw new Error('Refresh failed');
    }

    const data = (await res.json()) as RefreshResponse;
    return data.accessToken;
  },

  logout: async () => {
    await fetch(`${PROXY_URL}/logout`, {
      method: 'POST',
    });

    useAuthStore.getState().logout();
  },

  forgotPassword: async (email: string): Promise<{ message: string }> => {
    const response = await api.post<{ message: string }>('/api/v1/auth/forgot-password', { email });
    return response.data;
  },

  resetPassword: async (resetToken: string, newPassword: string): Promise<{ message: string }> => {
    const response = await api.post<{ message: string }>('/api/v1/auth/reset-password', { resetToken, newPassword });
    return response.data;
  },
};

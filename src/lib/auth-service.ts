import { useAuthStore } from '@/stores/auth-store';
import type { LoginFormData } from '@/lib/validations/auth-schemas';
import type { User } from '@/stores/auth-store';

// We use the Next.js API Routes (Proxy) to handle HttpOnly cookies
// So the authService calls /api/auth/* instead of backend directly
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
};

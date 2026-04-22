import { useAuthStore } from '@/stores/auth-store';

// We use the Next.js API Routes (Proxy) to handle HttpOnly cookies
// So the authService calls /api/auth/* instead of backend directly
const PROXY_URL = '/api/auth';

export const authService = {
  login: async (credentials: any) => {
    const res = await fetch(`${PROXY_URL}/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(credentials),
    });

    if (!res.ok) {
      const error = await res.json().catch(() => ({}));
      throw new Error(error.message || 'Login failed');
    }

    const data = await res.json();
    // Update Zustand
    useAuthStore.getState().setAccessToken(data.accessToken);
    useAuthStore.getState().setUser(data.user);
    
    return data;
  },

  refresh: async () => {
    const res = await fetch(`${PROXY_URL}/refresh`, {
      method: 'POST',
    });

    if (!res.ok) {
      throw new Error('Refresh failed');
    }

    const data = await res.json();
    return data.accessToken;
  },

  logout: async () => {
    await fetch(`${PROXY_URL}/logout`, {
      method: 'POST',
    });

    useAuthStore.getState().logout();
  },
};

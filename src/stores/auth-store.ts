import { create } from 'zustand';

interface User {
  id: string;
  email: string;
  role: 'OWNER' | 'ADMIN' | 'STAFF' | 'PUBLIC';
  name?: string;
}

interface AuthState {
  accessToken: string | null;
  user: User | null;
  setAccessToken: (token: string | null) => void;
  setUser: (user: User | null) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  accessToken: null,
  user: null,
  setAccessToken: (token: string | null) => set({ accessToken: token }),
  setUser: (user: User | null) => set({ user }),
  logout: () => set({ accessToken: null, user: null }),
}));

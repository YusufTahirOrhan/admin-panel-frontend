import { create } from 'zustand';

export type UserRole = 'OWNER' | 'ADMIN' | 'STAFF' | 'PUBLIC';

export interface User {
  id: string;
  email: string;
  role: UserRole;
  name?: string;
  fullName?: string;
}

interface AuthState {
  accessToken: string | null;
  user: User | null;
  setAccessToken: (token: string | null) => void;
  setUser: (user: User | null) => void;
  logout: () => void;
  /** Check if the current user has a specific role */
  hasRole: (role: UserRole) => boolean;
  /** Convenience getters */
  isOwner: () => boolean;
  isAdmin: () => boolean;
  isStaff: () => boolean;
  /** Display name for UI (falls back to email prefix) */
  getDisplayName: () => string;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  accessToken: null,
  user: null,
  setAccessToken: (token: string | null) => set({ accessToken: token }),
  setUser: (user: User | null) => set({ user }),
  logout: () => set({ accessToken: null, user: null }),

  hasRole: (role: UserRole) => get().user?.role === role,
  isOwner: () => get().user?.role === 'OWNER',
  isAdmin: () => get().user?.role === 'ADMIN',
  isStaff: () => get().user?.role === 'STAFF',
  getDisplayName: () => {
    const user = get().user;
    if (!user) return 'Kullanıcı';
    return user.fullName || user.name || user.email.split('@')[0];
  },
}));

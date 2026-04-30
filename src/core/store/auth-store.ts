import { create } from 'zustand';
import { persist } from 'zustand/middleware';
interface AuthState {
  token: string | null;
  user: any | null;
  isAuthenticated: boolean;
  setAuth: (token: string, user: any) => void;
  logout: () => void;
  documento: string;
  nombreCompleto: string;
  permisos: string[];
}
 

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      token: null,
      user: null,
      isAuthenticated: false,
      documento: '',
      nombreCompleto: '',
      permisos: [],

      setAuth: (token, user) => set({ token, user, isAuthenticated: true, documento: user.documento, nombreCompleto: user.nombreCompleto, permisos: user.permisos }),
      logout: () => set({ token: null, user: null, isAuthenticated: false, documento: '', nombreCompleto: '', permisos: [] }),
    }),
    {
      name: 'auth-storage',
    }
  )
);

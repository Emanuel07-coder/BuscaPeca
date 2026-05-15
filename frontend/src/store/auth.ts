import { create } from 'zustand';
import type { User, Organization, UserRole, OrganizationType } from '../types';

export interface AuthState {
  user: User | null;
  token: string | null;
  organization: Organization | null;
  isLoading: boolean;
  error: string | null;
  
  signup: (email: string, password: string, type: OrganizationType, cnpj: string, fantasyName: string, whatsapp: string, cep: string) => Promise<void>;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  setUser: (user: User | null) => void;
  setToken: (token: string | null) => void;
  loadFromStorage: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  token: null,
  organization: null,
  isLoading: false,
  error: null,

  signup: async (email, password, type, cnpj, fantasyName, whatsapp, cep) => {
    set({ isLoading: true, error: null });
    try {
      const { data } = await (await import('../lib/api')).default.post('/auth/signup', {
        email,
        password,
        type,
        cnpj,
        fantasyName,
        whatsapp,
        cep,
      });

      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
      localStorage.setItem('organization', JSON.stringify(data.organization));

      set({
        user: data.user,
        token: data.token,
        organization: data.organization,
        isLoading: false,
      });
    } catch (err: any) {
      set({
        error: err.response?.data?.error || err.message,
        isLoading: false,
      });
      throw err;
    }
  },

  login: async (email, password) => {
    set({ isLoading: true, error: null });
    try {
      const { data } = await (await import('../lib/api')).default.post('/auth/login', {
        email,
        password,
      });

      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));

      set({
        user: data.user,
        token: data.token,
        isLoading: false,
      });
    } catch (err: any) {
      set({
        error: err.response?.data?.error || err.message,
        isLoading: false,
      });
      throw err;
    }
  },

  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem('organization');
    set({
      user: null,
      token: null,
      organization: null,
    });
  },

  setUser: (user) => set({ user }),
  setToken: (token) => set({ token }),

  loadFromStorage: () => {
    const token = localStorage.getItem('token');
    const user = localStorage.getItem('user');
    const organization = localStorage.getItem('organization');

    if (token && user) {
      set({
        token,
        user: JSON.parse(user),
        organization: organization ? JSON.parse(organization) : null,
      });
    }
  },
}));

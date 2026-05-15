import { useAuthStore } from '../store/auth';

export function useAuth() {
  const store = useAuthStore();

  return {
    user: store.user,
    token: store.token,
    organization: store.organization,
    isLoading: store.isLoading,
    error: store.error,
    signup: store.signup,
    login: store.login,
    logout: store.logout,
    isAuthenticated: !!store.token,
    isMechanic: store.user?.role === 'operator',
    isAdmin: store.user?.role === 'admin',
    isSuperAdmin: store.user?.role === 'superadmin',
  };
}

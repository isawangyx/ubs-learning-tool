export function useAuth() {
    const access = localStorage.getItem('access');
    const refresh = localStorage.getItem('refresh');
    const isAuthenticated = !!access;
  
    const logout = () => {
      localStorage.removeItem('access');
      localStorage.removeItem('refresh');
      window.location.href = '/login';
    };
  
    return { access, refresh, isAuthenticated, logout };
  }
  
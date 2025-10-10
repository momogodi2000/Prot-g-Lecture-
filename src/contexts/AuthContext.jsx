import { createContext, useContext, useState, useEffect } from 'react';
import authService from '../services/auth';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [currentAdmin, setCurrentAdmin] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = authService.initAuthListener((admin) => {
      setCurrentAdmin(admin);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const login = async (email, password) => {
    const admin = await authService.loginWithEmail(email, password);
    setCurrentAdmin(admin);
    return admin;
  };

  const loginWithGoogle = async () => {
    const admin = await authService.loginWithGoogle();
    setCurrentAdmin(admin);
    return admin;
  };

  const logout = async () => {
    await authService.logout();
    setCurrentAdmin(null);
  };

  const hasPrivilege = (module, action) => {
    return authService.hasPrivilege(module, action);
  };

  const isAuthenticated = () => {
    return !!currentAdmin;
  };

  const isSuperAdmin = () => {
    return currentAdmin?.role === 'super_admin';
  };

  const value = {
    currentAdmin,
    login,
    loginWithGoogle,
    logout,
    hasPrivilege,
    isAuthenticated,
    isSuperAdmin,
    loading
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};

export default AuthContext;


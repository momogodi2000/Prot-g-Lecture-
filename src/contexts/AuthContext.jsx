import { createContext, useContext, useState, useEffect } from 'react';
import apiService from '../services/api';
import toast from 'react-hot-toast';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [currentAdmin, setCurrentAdmin] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    initializeAuth();
  }, []);

  const initializeAuth = async () => {
    try {
      setLoading(true);
      
      // Check if we have a token
      const token = apiService.getToken();
      if (!token) {
        setLoading(false);
        return;
      }

      // Verify token and get user data
      const response = await apiService.getCurrentUser();
      if (response.user) {
        setCurrentAdmin(response.user);
      } else {
        // Invalid token, clear it
        apiService.setToken(null);
      }
    } catch (error) {
      console.error('Auth initialization error:', error);
      apiService.setToken(null);
    } finally {
      setLoading(false);
    }
  };

  const login = async (email, password) => {
    try {
      const response = await apiService.login(email, password);
      if (response.user) {
        setCurrentAdmin(response.user);
        toast.success('Connexion réussie');
        return response.user;
      }
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  };

  const logout = async () => {
    try {
      await apiService.logout();
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      setCurrentAdmin(null);
      apiService.setToken(null);
      toast.success('Déconnexion réussie');
    }
  };

  const hasPrivilege = (module, action) => {
    if (!currentAdmin) return false;
    if (currentAdmin.role === 'super_admin') return true;

    const privileges = currentAdmin.privileges || {};
    return privileges[module]?.[action] === true;
  };

  const isAuthenticated = () => {
    return !!currentAdmin && !!apiService.getToken();
  };

  const isSuperAdmin = () => {
    return currentAdmin?.role === 'super_admin';
  };

  const changePassword = async (currentPassword, newPassword) => {
    try {
      await apiService.changePassword(currentPassword, newPassword);
      toast.success('Mot de passe modifié avec succès');
    } catch (error) {
      console.error('Password change error:', error);
      throw error;
    }
  };

  const value = {
    currentAdmin,
    login,
    logout,
    hasPrivilege,
    isAuthenticated,
    isSuperAdmin,
    changePassword,
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


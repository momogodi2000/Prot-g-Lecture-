import apiService from './api';

class AuthService {
  constructor() {
    this.currentAdmin = null;
  }

  // Initialize authentication (no longer needed with API-based auth)
  initAuthListener(callback) {
    // This is now handled in AuthContext through apiService
    return () => {}; // Return empty unsubscribe function
  }

  // Login with email/password - now handled through API
  async loginWithEmail(email, password) {
    try {
      const response = await apiService.login(email, password);
      return response.user;
    } catch (error) {
      console.error('Login error:', error);
      throw this.handleAuthError(error);
    }
  }

  // Logout - now handled through API
  async logout() {
    try {
      await apiService.logout();
      this.currentAdmin = null;
    } catch (error) {
      console.error('Logout error:', error);
      throw error;
    }
  }

  // Check privilege
  hasPrivilege(module, action) {
    if (!this.currentAdmin) return false;
    if (this.currentAdmin.role === 'super_admin') return true;

    const privileges = this.currentAdmin.privileges || {};
    return privileges[module]?.[action] === true;
  }

  // Get current admin
  getCurrentAdmin() {
    return this.currentAdmin;
  }

  // Check if user is authenticated
  isAuthenticated() {
    return !!this.currentAdmin;
  }

  // Check if user is super admin
  isSuperAdmin() {
    return this.currentAdmin?.role === 'super_admin';
  }

  // Handle auth errors
  handleAuthError(error) {
    // Map API error codes to user-friendly messages
    const errorMessages = {
      'INVALID_CREDENTIALS': 'Email ou mot de passe incorrect',
      'ACCOUNT_DISABLED': 'Compte désactivé. Contactez le super administrateur.',
      'TOKEN_INVALID': 'Session expirée. Veuillez vous reconnecter.',
      'USER_NOT_FOUND': 'Utilisateur non trouvé',
      'TOO_MANY_REQUESTS': 'Trop de tentatives. Réessayez plus tard.',
      'NETWORK_ERROR': 'Erreur de connexion réseau'
    };

    const message = errorMessages[error.code] || error.message || 'Une erreur est survenue';
    return new Error(message);
  }
}

export default new AuthService();


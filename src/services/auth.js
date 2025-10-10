import { 
  signInWithEmailAndPassword, 
  signOut, 
  sendPasswordResetEmail,
  signInWithPopup,
  onAuthStateChanged,
  createUserWithEmailAndPassword
} from 'firebase/auth';
import { auth, googleProvider } from './firebase';
import databaseService from './database';

class AuthService {
  constructor() {
    this.currentUser = null;
    this.currentAdmin = null;
  }

  // Initialize authentication listener
  initAuthListener(callback) {
    return onAuthStateChanged(auth, async (user) => {
      if (user) {
        this.currentUser = user;
        // Get admin data from SQLite
        this.currentAdmin = await this.getAdminData(user.uid);
        callback(this.currentAdmin);
      } else {
        this.currentUser = null;
        this.currentAdmin = null;
        callback(null);
      }
    });
  }

  // Login with email/password
  async loginWithEmail(email, password) {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      
      // Verify user is admin
      const adminData = await this.getAdminData(user.uid);
      
      if (!adminData) {
        await this.logout();
        throw new Error('Compte administrateur introuvable');
      }

      if (adminData.statut !== 'actif') {
        await this.logout();
        throw new Error('Compte désactivé. Contactez le super administrateur.');
      }

      // Log connection
      await this.logConnection(adminData.id);

      return adminData;
    } catch (error) {
      console.error('Login error:', error);
      throw this.handleAuthError(error);
    }
  }

  // Login with Google OAuth
  async loginWithGoogle() {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;

      // Verify user is admin
      const adminData = await this.getAdminData(user.uid);
      
      if (!adminData) {
        await this.logout();
        throw new Error('Compte administrateur introuvable');
      }

      if (adminData.statut !== 'actif') {
        await this.logout();
        throw new Error('Compte désactivé');
      }

      await this.logConnection(adminData.id);

      return adminData;
    } catch (error) {
      console.error('Google login error:', error);
      throw this.handleAuthError(error);
    }
  }

  // Logout
  async logout() {
    try {
      await signOut(auth);
      this.currentUser = null;
      this.currentAdmin = null;
    } catch (error) {
      console.error('Logout error:', error);
      throw error;
    }
  }

  // Reset password
  async resetPassword(email) {
    try {
      await sendPasswordResetEmail(auth, email);
    } catch (error) {
      console.error('Password reset error:', error);
      throw this.handleAuthError(error);
    }
  }

  // Create admin user (for initialization)
  async createAdmin(email, password, nomComplet, role = 'super_admin') {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const firebaseUid = userCredential.user.uid;

      // Insert into SQLite
      databaseService.run(
        `INSERT INTO administrateurs (firebase_uid, email, nom_complet, role, statut)
         VALUES (?, ?, ?, ?, ?)`,
        [firebaseUid, email, nomComplet, role, 'actif']
      );

      const adminId = databaseService.getLastInsertId();

      return {
        id: adminId,
        firebase_uid: firebaseUid,
        email,
        nom_complet: nomComplet,
        role,
        statut: 'actif'
      };
    } catch (error) {
      console.error('Create admin error:', error);
      throw this.handleAuthError(error);
    }
  }

  // Get admin data from SQLite
  async getAdminData(firebaseUid) {
    const result = databaseService.queryOne(
      'SELECT * FROM administrateurs WHERE firebase_uid = ? AND statut = ?',
      [firebaseUid, 'actif']
    );

    if (result && result.privileges) {
      try {
        result.privileges = JSON.parse(result.privileges);
      } catch (e) {
        result.privileges = null;
      }
    }

    return result;
  }

  // Log connection
  async logConnection(adminId) {
    try {
      databaseService.run(
        'UPDATE administrateurs SET date_derniere_connexion = ? WHERE id = ?',
        [new Date().toISOString(), adminId]
      );

      databaseService.run(
        `INSERT INTO logs_activite (utilisateur_id, action, module, details) 
         VALUES (?, ?, ?, ?)`,
        [adminId, 'connexion', 'administration', JSON.stringify({ 
          timestamp: new Date().toISOString() 
        })]
      );
    } catch (error) {
      console.error('Error logging connection:', error);
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

  // Handle Firebase auth errors
  handleAuthError(error) {
    const errorMessages = {
      'auth/invalid-email': 'Adresse email invalide',
      'auth/user-disabled': 'Ce compte a été désactivé',
      'auth/user-not-found': 'Aucun compte associé à cet email',
      'auth/wrong-password': 'Mot de passe incorrect',
      'auth/email-already-in-use': 'Cet email est déjà utilisé',
      'auth/weak-password': 'Le mot de passe doit contenir au moins 6 caractères',
      'auth/network-request-failed': 'Erreur de connexion réseau',
      'auth/too-many-requests': 'Trop de tentatives. Réessayez plus tard.',
      'auth/popup-closed-by-user': 'La fenêtre de connexion a été fermée',
      'auth/cancelled-popup-request': 'Opération annulée'
    };

    const message = errorMessages[error.code] || error.message;
    return new Error(message);
  }
}

export default new AuthService();


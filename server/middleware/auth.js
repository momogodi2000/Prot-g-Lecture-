import jwt from 'jsonwebtoken';
import { getDatabase } from '../config/database.js';

export const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

  if (!token) {
    return res.status(401).json({ 
      error: 'Token d\'accès requis',
      code: 'TOKEN_REQUIRED'
    });
  }

  jwt.verify(token, process.env.JWT_SECRET || 'fallback-secret-key', (err, decoded) => {
    if (err) {
      console.error('Token verification failed:', err);
      return res.status(403).json({
        error: 'Token invalide ou expiré',
        code: 'TOKEN_INVALID'
      });
    }

    // Verify user still exists and is active
    try {
      const db = getDatabase();
      const user = db.prepare(
        'SELECT id, email, nom_complet, role, privileges, statut FROM administrateurs WHERE id = ? AND statut = ?'
      ).get(decoded.userId, 'actif');

      if (!user) {
        return res.status(403).json({
          error: 'Utilisateur non trouvé ou inactif',
          code: 'USER_NOT_FOUND'
        });
      }

      // Parse privileges if they exist
      if (user.privileges) {
        try {
          user.privileges = JSON.parse(user.privileges);
        } catch (e) {
          user.privileges = null;
        }
      }

      req.user = user;
      next();
    } catch (error) {
      console.error('Database error during authentication:', error);
      return res.status(500).json({
        error: 'Erreur de vérification utilisateur',
        code: 'AUTH_ERROR'
      });
    }
  });
};

export const requireRole = (roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        error: 'Authentification requise',
        code: 'AUTH_REQUIRED'
      });
    }

    const userRole = req.user.role;
    const allowedRoles = Array.isArray(roles) ? roles : [roles];

    if (!allowedRoles.includes(userRole)) {
      return res.status(403).json({
        error: 'Privilèges insuffisants',
        code: 'INSUFFICIENT_PRIVILEGES'
      });
    }

    next();
  };
};

export const requirePrivilege = (module, action) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        error: 'Authentification requise',
        code: 'AUTH_REQUIRED'
      });
    }

    // Super admin has all privileges
    if (req.user.role === 'super_admin') {
      return next();
    }

    const privileges = req.user.privileges || {};
    if (!privileges[module] || !privileges[module][action]) {
      return res.status(403).json({
        error: `Privilège insuffisant: ${module}.${action}`,
        code: 'INSUFFICIENT_PRIVILEGE'
      });
    }

    next();
  };
};

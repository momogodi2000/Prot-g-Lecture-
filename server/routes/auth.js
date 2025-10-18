import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { body, validationResult } from 'express-validator';
import { getDatabase } from '../config/database.js';
import { authenticateToken } from '../middleware/auth.js';
import { asyncHandler } from '../middleware/errorHandler.js';

const router = express.Router();

// JWT token generation
const generateToken = (userId) => {
  return jwt.sign(
    { userId },
    process.env.JWT_SECRET || 'fallback-secret-key',
    { expiresIn: process.env.JWT_EXPIRES_IN || '24h' }
  );
};

// Login validation rules
const loginValidation = [
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Email valide requis'),
  body('password')
    .isLength({ min: 6 })
    .withMessage('Le mot de passe doit contenir au moins 6 caractères')
];

// Register validation rules
const registerValidation = [
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Email valide requis'),
  body('password')
    .isLength({ min: 6 })
    .withMessage('Le mot de passe doit contenir au moins 6 caractères'),
  body('nomComplet')
    .isLength({ min: 2 })
    .withMessage('Le nom complet doit contenir au moins 2 caractères'),
  body('role')
    .optional()
    .isIn(['admin', 'super_admin'])
    .withMessage('Rôle invalide')
];

// POST /api/auth/login
router.post('/login', loginValidation, asyncHandler(async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      error: 'Données de validation invalides',
      details: errors.array(),
      code: 'VALIDATION_ERROR'
    });
  }

  const { email, password } = req.body;
  const db = getDatabase();

  try {
    // Find user by email
    const user = db.prepare(
      'SELECT id, email, password_hash, nom_complet, role, privileges, statut, date_derniere_connexion FROM administrateurs WHERE email = ?'
    ).get(email);

    if (!user) {
      return res.status(401).json({
        error: 'Email ou mot de passe incorrect',
        code: 'INVALID_CREDENTIALS'
      });
    }

    if (user.statut !== 'actif') {
      return res.status(401).json({
        error: 'Compte désactivé. Contactez le super administrateur.',
        code: 'ACCOUNT_DISABLED'
      });
    }

    // Check password
    const isPasswordValid = await bcrypt.compare(password, user.password_hash);
    if (!isPasswordValid) {
      return res.status(401).json({
        error: 'Email ou mot de passe incorrect',
        code: 'INVALID_CREDENTIALS'
      });
    }

    // Update last login
    db.prepare(
      'UPDATE administrateurs SET date_derniere_connexion = ? WHERE id = ?'
    ).run(new Date().toISOString(), user.id);

    // Log activity
    db.prepare(
      'INSERT INTO logs_activite (utilisateur_id, action, module, details, ip_address) VALUES (?, ?, ?, ?, ?)'
    ).run(
      user.id,
      'connexion',
      'administration',
      JSON.stringify({ timestamp: new Date().toISOString() }),
      req.ip || req.connection.remoteAddress
    );

    // Parse privileges
    let privileges = null;
    if (user.privileges) {
      try {
        privileges = JSON.parse(user.privileges);
      } catch (e) {
        privileges = null;
      }
    }

    // Generate token
    const token = generateToken(user.id);

    // Prepare user data (without password)
    const userData = {
      id: user.id,
      email: user.email,
      nomComplet: user.nom_complet,
      role: user.role,
      privileges,
      statut: user.statut,
      dateDerniereConnexion: user.date_derniere_connexion
    };

    res.json({
      message: 'Connexion réussie',
      token,
      user: userData
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      error: 'Erreur lors de la connexion',
      code: 'LOGIN_ERROR'
    });
  }
}));

// POST /api/auth/register (super admin only)
router.post('/register', authenticateToken, registerValidation, asyncHandler(async (req, res) => {
  // Check if user is super admin
  if (req.user.role !== 'super_admin') {
    return res.status(403).json({
      error: 'Seul un super administrateur peut créer de nouveaux comptes',
      code: 'INSUFFICIENT_PRIVILEGES'
    });
  }

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      error: 'Données de validation invalides',
      details: errors.array(),
      code: 'VALIDATION_ERROR'
    });
  }

  const { email, password, nomComplet, role = 'admin' } = req.body;
  const db = getDatabase();

  try {
    // Check if user already exists
    const existingUser = db.prepare('SELECT id FROM administrateurs WHERE email = ?').get(email);
    if (existingUser) {
      return res.status(409).json({
        error: 'Un compte avec cet email existe déjà',
        code: 'USER_EXISTS'
      });
    }

    // Hash password
    const saltRounds = 12;
    const passwordHash = await bcrypt.hash(password, saltRounds);

    // Create user
    const result = db.prepare(`
      INSERT INTO administrateurs (email, password_hash, nom_complet, role, statut, cree_par)
      VALUES (?, ?, ?, ?, ?, ?)
    `).run(email, passwordHash, nomComplet, role, 'actif', req.user.id);

    const newUserId = result.lastInsertRowid;

    // Log activity
    db.prepare(
      'INSERT INTO logs_activite (utilisateur_id, action, module, details, ip_address) VALUES (?, ?, ?, ?, ?)'
    ).run(
      req.user.id,
      'creation_utilisateur',
      'administration',
      JSON.stringify({ 
        newUserId, 
        newUserEmail: email, 
        timestamp: new Date().toISOString() 
      }),
      req.ip || req.connection.remoteAddress
    );

    res.status(201).json({
      message: 'Compte créé avec succès',
      userId: newUserId
    });
  } catch (error) {
    console.error('Register error:', error);
    res.status(500).json({
      error: 'Erreur lors de la création du compte',
      code: 'REGISTER_ERROR'
    });
  }
}));

// GET /api/auth/me - Get current user info
router.get('/me', authenticateToken, asyncHandler(async (req, res) => {
  const db = getDatabase();
  
  const user = db.prepare(
    'SELECT id, email, nom_complet, role, privileges, statut, date_creation, date_derniere_connexion FROM administrateurs WHERE id = ?'
  ).get(req.user.id);

  if (!user) {
    return res.status(404).json({
      error: 'Utilisateur non trouvé',
      code: 'USER_NOT_FOUND'
    });
  }

  // Parse privileges
  let privileges = null;
  if (user.privileges) {
    try {
      privileges = JSON.parse(user.privileges);
    } catch (e) {
      privileges = null;
    }
  }

  const userData = {
    id: user.id,
    email: user.email,
    nomComplet: user.nom_complet,
    role: user.role,
    privileges,
    statut: user.statut,
    dateCreation: user.date_creation,
    dateDerniereConnexion: user.date_derniere_connexion
  };

  res.json({ user: userData });
}));

// POST /api/auth/logout - Logout (mainly for logging purposes)
router.post('/logout', authenticateToken, asyncHandler(async (req, res) => {
  const db = getDatabase();

  // Log activity
  db.prepare(
    'INSERT INTO logs_activite (utilisateur_id, action, module, details, ip_address) VALUES (?, ?, ?, ?, ?)'
  ).run(
    req.user.id,
    'deconnexion',
    'administration',
    JSON.stringify({ timestamp: new Date().toISOString() }),
    req.ip || req.connection.remoteAddress
  );

  res.json({ message: 'Déconnexion réussie' });
}));

// POST /api/auth/change-password
router.post('/change-password', authenticateToken, [
  body('currentPassword')
    .isLength({ min: 6 })
    .withMessage('Mot de passe actuel requis'),
  body('newPassword')
    .isLength({ min: 6 })
    .withMessage('Le nouveau mot de passe doit contenir au moins 6 caractères')
], asyncHandler(async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      error: 'Données de validation invalides',
      details: errors.array(),
      code: 'VALIDATION_ERROR'
    });
  }

  const { currentPassword, newPassword } = req.body;
  const db = getDatabase();

  try {
    // Get current user with password
    const user = db.prepare('SELECT password_hash FROM administrateurs WHERE id = ?').get(req.user.id);

    // Verify current password
    const isCurrentPasswordValid = await bcrypt.compare(currentPassword, user.password_hash);
    if (!isCurrentPasswordValid) {
      return res.status(401).json({
        error: 'Mot de passe actuel incorrect',
        code: 'INVALID_CURRENT_PASSWORD'
      });
    }

    // Hash new password
    const saltRounds = 12;
    const newPasswordHash = await bcrypt.hash(newPassword, saltRounds);

    // Update password
    db.prepare('UPDATE administrateurs SET password_hash = ? WHERE id = ?').run(newPasswordHash, req.user.id);

    // Log activity
    db.prepare(
      'INSERT INTO logs_activite (utilisateur_id, action, module, details, ip_address) VALUES (?, ?, ?, ?, ?)'
    ).run(
      req.user.id,
      'changement_mot_de_passe',
      'administration',
      JSON.stringify({ timestamp: new Date().toISOString() }),
      req.ip || req.connection.remoteAddress
    );

    res.json({ message: 'Mot de passe modifié avec succès' });
  } catch (error) {
    console.error('Change password error:', error);
    res.status(500).json({
      error: 'Erreur lors du changement de mot de passe',
      code: 'PASSWORD_CHANGE_ERROR'
    });
  }
}));

export default router;

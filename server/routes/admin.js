import express from 'express';
import { body, query, validationResult } from 'express-validator';
import { getDatabase } from '../config/database.js';
import { authenticateToken, requireRole, requirePrivilege } from '../middleware/auth.js';
import { asyncHandler } from '../middleware/errorHandler.js';

const router = express.Router();

// GET /api/admin/stats - Get dashboard statistics (super admin only)
router.get('/stats', authenticateToken, requireRole(['super_admin', 'admin']), asyncHandler(async (req, res) => {
  const db = getDatabase();

  try {
    // Get basic counts
    const booksCount = db.prepare('SELECT COUNT(*) as count FROM livres').get();
    const activeReservationsCount = db.prepare(
      'SELECT COUNT(*) as count FROM reservations WHERE statut IN (?, ?)'
    ).get('en_attente', 'validee');
    const pendingReservationsCount = db.prepare(
      'SELECT COUNT(*) as count FROM reservations WHERE statut = ?'
    ).get('en_attente');
    const activeGroupsCount = db.prepare('SELECT COUNT(*) as count FROM groupes_lecture WHERE statut = ?').get('actif');
    const publishedEventsCount = db.prepare('SELECT COUNT(*) as count FROM evenements WHERE statut = ?').get('publie');
    const unreadMessagesCount = db.prepare('SELECT COUNT(*) as count FROM messages_contact WHERE statut = ?').get('non_lu');
    const newsletterSubscribersCount = db.prepare('SELECT COUNT(*) as count FROM newsletter_abonnes WHERE statut = ?').get('actif');

    // Get recent reservations (last 7 days)
    const recentReservations = db.prepare(`
      SELECT COUNT(*) as count 
      FROM reservations 
      WHERE date_creation >= date('now', '-7 days')
    `).get();

    // Get monthly stats for the current month
    const monthlyStats = db.prepare(`
      SELECT 
        SUM(reservations_soumises) as reservations_soumises,
        SUM(reservations_validees) as reservations_validees,
        SUM(messages_recus) as messages_recus
      FROM statistiques_journalieres 
      WHERE date >= date('now', 'start of month')
    `).get();

    const stats = {
      overview: {
        total_books: booksCount.count,
        active_reservations: activeReservationsCount.count,
        pending_reservations: pendingReservationsCount.count,
        active_groups: activeGroupsCount.count,
        published_events: publishedEventsCount.count,
        unread_messages: unreadMessagesCount.count,
        newsletter_subscribers: newsletterSubscribersCount.count
      },
      recent_activity: {
        reservations_last_7_days: recentReservations.count
      },
      monthly: {
        reservations_submitted: monthlyStats.reservations_soumises || 0,
        reservations_validated: monthlyStats.reservations_validees || 0,
        messages_received: monthlyStats.messages_recus || 0
      }
    };

    res.json({ stats });
  } catch (error) {
    console.error('Error fetching admin stats:', error);
    res.status(500).json({
      error: 'Erreur lors de la récupération des statistiques',
      code: 'FETCH_STATS_ERROR'
    });
  }
}));

// GET /api/admin/activity-log - Get activity log (admin only)
router.get('/activity-log', authenticateToken, requirePrivilege('administration', 'read'), [
  query('limit').optional().isInt({ min: 1, max: 100 }),
  query('offset').optional().isInt({ min: 0 }),
  query('module').optional().isLength({ min: 1 }),
  query('action').optional().isLength({ min: 1 })
], asyncHandler(async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      error: 'Paramètres de requête invalides',
      details: errors.array(),
      code: 'INVALID_QUERY_PARAMS'
    });
  }

  const { limit = 50, offset = 0, module, action } = req.query;
  const db = getDatabase();

  try {
    let query = `
      SELECT 
        l.id, l.action, l.module, l.details, l.ip_address, l.date_action,
        u.nom_complet as utilisateur_nom
      FROM logs_activite l
      LEFT JOIN administrateurs u ON l.utilisateur_id = u.id
      WHERE 1=1
    `;
    
    const params = [];

    if (module) {
      query += ` AND l.module = ?`;
      params.push(module);
    }

    if (action) {
      query += ` AND l.action = ?`;
      params.push(action);
    }

    query += ` ORDER BY l.date_action DESC LIMIT ? OFFSET ?`;
    params.push(parseInt(limit), parseInt(offset));

    const logs = db.prepare(query).all(...params);

    // Get total count
    let countQuery = `SELECT COUNT(*) as total FROM logs_activite l WHERE 1=1`;
    const countParams = [];

    if (module) {
      countQuery += ` AND l.module = ?`;
      countParams.push(module);
    }

    if (action) {
      countQuery += ` AND l.action = ?`;
      countParams.push(action);
    }

    const totalResult = db.prepare(countQuery).get(...countParams);
    const total = totalResult.total;

    res.json({
      logs,
      pagination: {
        total,
        limit: parseInt(limit),
        offset: parseInt(offset),
        hasMore: offset + logs.length < total
      }
    });
  } catch (error) {
    console.error('Error fetching activity log:', error);
    res.status(500).json({
      error: 'Erreur lors de la récupération du journal d\'activité',
      code: 'FETCH_ACTIVITY_LOG_ERROR'
    });
  }
}));

// GET /api/admin/users - Get admin users (super admin only)
router.get('/users', authenticateToken, requireRole('super_admin'), [
  query('limit').optional().isInt({ min: 1, max: 100 }),
  query('offset').optional().isInt({ min: 0 }),
  query('search').optional().isLength({ min: 1 })
], asyncHandler(async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      error: 'Paramètres de requête invalides',
      details: errors.array(),
      code: 'INVALID_QUERY_PARAMS'
    });
  }

  const { limit = 20, offset = 0, search } = req.query;
  const db = getDatabase();

  try {
    let query = `
      SELECT 
        a.id, a.email, a.nom_complet, a.role, a.statut, 
        a.date_creation, a.date_derniere_connexion,
        c.nom_complet as cree_par_nom
      FROM administrateurs a
      LEFT JOIN administrateurs c ON a.cree_par = c.id
      WHERE 1=1
    `;
    
    const params = [];

    if (search) {
      query += ` AND (a.email LIKE ? OR a.nom_complet LIKE ?)`;
      const searchTerm = `%${search}%`;
      params.push(searchTerm, searchTerm);
    }

    query += ` ORDER BY a.date_creation DESC LIMIT ? OFFSET ?`;
    params.push(parseInt(limit), parseInt(offset));

    const users = db.prepare(query).all(...params);

    // Remove sensitive data
    const sanitizedUsers = users.map(user => ({
      id: user.id,
      email: user.email,
      nomComplet: user.nom_complet,
      role: user.role,
      statut: user.statut,
      dateCreation: user.date_creation,
      dateDerniereConnexion: user.date_derniere_connexion,
      creeParNom: user.cree_par_nom
    }));

    res.json({ users: sanitizedUsers });
  } catch (error) {
    console.error('Error fetching admin users:', error);
    res.status(500).json({
      error: 'Erreur lors de la récupération des utilisateurs',
      code: 'FETCH_USERS_ERROR'
    });
  }
}));

// PUT /api/admin/users/:id/status - Update user status (super admin only)
router.put('/users/:id/status', authenticateToken, requireRole('super_admin'), [
  body('statut').isIn(['actif', 'inactif']).withMessage('Statut invalide')
], asyncHandler(async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      error: 'Données de validation invalides',
      details: errors.array(),
      code: 'VALIDATION_ERROR'
    });
  }

  const { id } = req.params;
  const { statut } = req.body;
  const db = getDatabase();

  try {
    // Prevent deactivating self
    if (parseInt(id) === req.user.id) {
      return res.status(400).json({
        error: 'Vous ne pouvez pas désactiver votre propre compte',
        code: 'CANNOT_DEACTIVATE_SELF'
      });
    }

    // Check if user exists
    const user = db.prepare('SELECT id, email, nom_complet FROM administrateurs WHERE id = ?').get(id);
    if (!user) {
      return res.status(404).json({
        error: 'Utilisateur non trouvé',
        code: 'USER_NOT_FOUND'
      });
    }

    // Update user status
    db.prepare('UPDATE administrateurs SET statut = ? WHERE id = ?').run(statut, id);

    // Log activity
    db.prepare(
      'INSERT INTO logs_activite (utilisateur_id, action, module, details, ip_address) VALUES (?, ?, ?, ?, ?)'
    ).run(
      req.user.id,
      'modification_statut_utilisateur',
      'administration',
      JSON.stringify({ 
        userId: id, 
        userEmail: user.email,
        newStatut: statut, 
        timestamp: new Date().toISOString() 
      }),
      req.ip || req.connection.remoteAddress
    );

    res.json({
      message: 'Statut utilisateur mis à jour avec succès'
    });
  } catch (error) {
    console.error('Error updating user status:', error);
    res.status(500).json({
      error: 'Erreur lors de la mise à jour du statut utilisateur',
      code: 'UPDATE_USER_STATUS_ERROR'
    });
  }
}));

// GET /api/admin/settings - Get system settings (admin only)
router.get('/settings', authenticateToken, requirePrivilege('administration', 'read'), asyncHandler(async (req, res) => {
  const db = getDatabase();

  try {
    const settings = db.prepare(`
      SELECT cle, valeur, type, description, date_modification
      FROM parametres_systeme 
      ORDER BY cle
    `).all();

    // Convert settings to object format
    const settingsObject = {};
    settings.forEach(setting => {
      let value = setting.valeur;
      
      // Convert value based on type
      switch (setting.type) {
        case 'number':
          value = parseInt(value) || 0;
          break;
        case 'boolean':
          value = value === 'true';
          break;
        case 'json':
          try {
            value = JSON.parse(value);
          } catch (e) {
            value = value;
          }
          break;
        default:
          value = value;
      }
      
      settingsObject[setting.cle] = {
        value,
        type: setting.type,
        description: setting.description,
        lastModified: setting.date_modification
      };
    });

    res.json({ settings: settingsObject });
  } catch (error) {
    console.error('Error fetching system settings:', error);
    res.status(500).json({
      error: 'Erreur lors de la récupération des paramètres',
      code: 'FETCH_SETTINGS_ERROR'
    });
  }
}));

// PUT /api/admin/settings - Update system settings (super admin only)
router.put('/settings', authenticateToken, requireRole('super_admin'), [
  body('settings').isObject().withMessage('Paramètres invalides')
], asyncHandler(async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      error: 'Données de validation invalides',
      details: errors.array(),
      code: 'VALIDATION_ERROR'
    });
  }

  const { settings } = req.body;
  const db = getDatabase();

  try {
    const allowedSettings = [
      'nom_centre', 'adresse', 'telephone', 'email_contact',
      'max_reservations_jour', 'max_reservations_creneau',
      'delai_min_reservation', 'delai_max_reservation',
      'duree_session_minutes', 'mode_maintenance',
      'notifications_email_actives', 'langue_defaut', 'theme_defaut'
    ];

    const transaction = db.transaction(() => {
      Object.keys(settings).forEach(key => {
        if (allowedSettings.includes(key)) {
          const value = String(settings[key]);
          
          db.prepare(`
            UPDATE parametres_systeme 
            SET valeur = ?, date_modification = ?, modifie_par = ?
            WHERE cle = ?
          `).run(value, new Date().toISOString(), req.user.id, key);
        }
      });
    });

    transaction();

    // Log activity
    db.prepare(
      'INSERT INTO logs_activite (utilisateur_id, action, module, details, ip_address) VALUES (?, ?, ?, ?, ?)'
    ).run(
      req.user.id,
      'modification_parametres',
      'administration',
      JSON.stringify({ 
        settings: settings, 
        timestamp: new Date().toISOString() 
      }),
      req.ip || req.connection.remoteAddress
    );

    res.json({
      message: 'Paramètres mis à jour avec succès'
    });
  } catch (error) {
    console.error('Error updating system settings:', error);
    res.status(500).json({
      error: 'Erreur lors de la mise à jour des paramètres',
      code: 'UPDATE_SETTINGS_ERROR'
    });
  }
}));

export default router;

import express from 'express';
import { body, query, validationResult } from 'express-validator';
import { getDatabase } from '../config/database.js';
import { authenticateToken, requirePrivilege } from '../middleware/auth.js';
import { asyncHandler } from '../middleware/errorHandler.js';
import { generateUnsubscribeToken } from '../utils/helpers.js';

const router = express.Router();

// GET /api/contacts - Get all contact messages (admin only)
router.get('/', authenticateToken, requirePrivilege('contact', 'read'), [
  query('statut').optional().isIn(['non_lu', 'lu', 'repondu', 'archive']),
  query('search').optional().isLength({ min: 1 }),
  query('limit').optional().isInt({ min: 1, max: 100 }),
  query('offset').optional().isInt({ min: 0 })
], asyncHandler(async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      error: 'Paramètres de requête invalides',
      details: errors.array(),
      code: 'INVALID_QUERY_PARAMS'
    });
  }

  const { statut, search, limit = 20, offset = 0 } = req.query;
  const db = getDatabase();

  try {
    let query = `
      SELECT 
        m.id, m.nom_complet, m.email, m.telephone, m.sujet, m.message,
        m.date_envoi, m.statut, m.date_lecture, m.reponse, m.date_reponse,
        lu.nom_complet as lu_par_nom, rep.nom_complet as repondu_par_nom
      FROM messages_contact m
      LEFT JOIN administrateurs lu ON m.lu_par = lu.id
      LEFT JOIN administrateurs rep ON m.repondu_par = rep.id
      WHERE 1=1
    `;
    
    const params = [];

    // Apply filters
    if (statut) {
      query += ` AND m.statut = ?`;
      params.push(statut);
    }

    if (search) {
      query += ` AND (m.nom_complet LIKE ? OR m.email LIKE ? OR m.sujet LIKE ?)`;
      const searchTerm = `%${search}%`;
      params.push(searchTerm, searchTerm, searchTerm);
    }

    query += ` ORDER BY m.date_envoi DESC LIMIT ? OFFSET ?`;
    params.push(parseInt(limit), parseInt(offset));

    const messages = db.prepare(query).all(...params);

    // Get total count for pagination
    let countQuery = `
      SELECT COUNT(*) as total
      FROM messages_contact m
      WHERE 1=1
    `;
    const countParams = [];

    if (statut) {
      countQuery += ` AND m.statut = ?`;
      countParams.push(statut);
    }

    if (search) {
      countQuery += ` AND (m.nom_complet LIKE ? OR m.email LIKE ? OR m.sujet LIKE ?)`;
      const searchTerm = `%${search}%`;
      countParams.push(searchTerm, searchTerm, searchTerm);
    }

    const totalResult = db.prepare(countQuery).get(...countParams);
    const total = totalResult.total;

    // Get stats
    const stats = db.prepare(`
      SELECT 
        COUNT(*) as total,
        SUM(CASE WHEN statut = 'non_lu' THEN 1 ELSE 0 END) as non_lus,
        SUM(CASE WHEN statut = 'repondu' THEN 1 ELSE 0 END) as repondus
      FROM messages_contact
    `).get();

    res.json({
      messages,
      stats,
      pagination: {
        total,
        limit: parseInt(limit),
        offset: parseInt(offset),
        hasMore: offset + messages.length < total
      }
    });
  } catch (error) {
    console.error('Error fetching contact messages:', error);
    res.status(500).json({
      error: 'Erreur lors de la récupération des messages',
      code: 'FETCH_MESSAGES_ERROR'
    });
  }
}));

// POST /api/contacts - Send a contact message (public endpoint)
router.post('/', [
  body('nom_complet').isLength({ min: 2 }).withMessage('Le nom complet est requis'),
  body('email').isEmail().normalizeEmail().withMessage('Email valide requis'),
  body('sujet').isLength({ min: 1, max: 200 }).withMessage('Le sujet est requis (max 200 caractères)'),
  body('message').isLength({ min: 10, max: 2000 }).withMessage('Le message doit contenir entre 10 et 2000 caractères'),
  body('telephone').optional().isLength({ min: 8, max: 20 }).withMessage('Numéro de téléphone invalide')
], asyncHandler(async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      error: 'Données de validation invalides',
      details: errors.array(),
      code: 'VALIDATION_ERROR'
    });
  }

  const { nom_complet, email, telephone, sujet, message } = req.body;
  const db = getDatabase();

  try {
    // Check for spam/multiple messages from same email in last hour
    const recentMessage = db.prepare(
      'SELECT id FROM messages_contact WHERE email = ? AND date_envoi > datetime("now", "-1 hour")'
    ).get(email);

    if (recentMessage) {
      return res.status(429).json({
        error: 'Trop de messages récents. Veuillez attendre avant d\'envoyer un nouveau message.',
        code: 'RATE_LIMIT_EXCEEDED'
      });
    }

    // Insert message
    const result = db.prepare(`
      INSERT INTO messages_contact (nom_complet, email, telephone, sujet, message, statut)
      VALUES (?, ?, ?, ?, ?, ?)
    `).run(nom_complet, email, telephone || null, sujet, message, 'non_lu');

    const messageId = result.lastInsertRowid;

    // Update daily statistics
    const today = new Date().toISOString().split('T')[0];
    try {
      db.prepare(`
        INSERT INTO statistiques_journalieres (date, messages_recus)
        VALUES (?, 1)
        ON CONFLICT(date) DO UPDATE SET
          messages_recus = messages_recus + 1,
          date_calcul = CURRENT_TIMESTAMP
      `).run(today);
    } catch (statsError) {
      console.warn('Error updating daily statistics:', statsError.message);
    }

    res.status(201).json({
      message: 'Message envoyé avec succès',
      messageId
    });
  } catch (error) {
    console.error('Error sending contact message:', error);
    res.status(500).json({
      error: 'Erreur lors de l\'envoi du message',
      code: 'SEND_MESSAGE_ERROR'
    });
  }
}));

// GET /api/contacts/:id - Get a single contact message (admin only)
router.get('/:id', authenticateToken, requirePrivilege('contact', 'read'), asyncHandler(async (req, res) => {
  const { id } = req.params;
  const db = getDatabase();

  try {
    const message = db.prepare(`
      SELECT 
        m.id, m.nom_complet, m.email, m.telephone, m.sujet, m.message,
        m.date_envoi, m.statut, m.date_lecture, m.reponse, m.date_reponse,
        lu.nom_complet as lu_par_nom, rep.nom_complet as repondu_par_nom
      FROM messages_contact m
      LEFT JOIN administrateurs lu ON m.lu_par = lu.id
      LEFT JOIN administrateurs rep ON m.repondu_par = rep.id
      WHERE m.id = ?
    `).get(id);

    if (!message) {
      return res.status(404).json({
        error: 'Message non trouvé',
        code: 'MESSAGE_NOT_FOUND'
      });
    }

    // Mark as read if not already read
    if (message.statut === 'non_lu') {
      db.prepare(`
        UPDATE messages_contact 
        SET statut = 'lu', date_lecture = ?, lu_par = ?
        WHERE id = ?
      `).run(new Date().toISOString(), req.user.id, id);
      
      message.statut = 'lu';
      message.date_lecture = new Date().toISOString();
      message.lu_par_nom = req.user.nomComplet;
    }

    res.json({ message });
  } catch (error) {
    console.error('Error fetching contact message:', error);
    res.status(500).json({
      error: 'Erreur lors de la récupération du message',
      code: 'FETCH_MESSAGE_ERROR'
    });
  }
}));

// PUT /api/contacts/:id/status - Update message status (admin only)
router.put('/:id/status', authenticateToken, requirePrivilege('contact', 'update'), [
  body('statut').isIn(['lu', 'repondu', 'archive']).withMessage('Statut invalide'),
  body('reponse').optional().isLength({ max: 2000 }).withMessage('Réponse trop longue')
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
  const { statut, reponse } = req.body;
  const db = getDatabase();

  try {
    // Check if message exists
    const existingMessage = db.prepare('SELECT id FROM messages_contact WHERE id = ?').get(id);
    if (!existingMessage) {
      return res.status(404).json({
        error: 'Message non trouvé',
        code: 'MESSAGE_NOT_FOUND'
      });
    }

    // Update message status
    const updateFields = ['statut = ?'];
    const updateValues = [statut];

    if (statut === 'repondu' && reponse) {
      updateFields.push('reponse = ?', 'date_reponse = ?', 'repondu_par = ?');
      updateValues.push(reponse, new Date().toISOString(), req.user.id);
    } else if (statut === 'lu') {
      updateFields.push('date_lecture = ?', 'lu_par = ?');
      updateValues.push(new Date().toISOString(), req.user.id);
    }

    updateValues.push(id);

    const updateQuery = `UPDATE messages_contact SET ${updateFields.join(', ')} WHERE id = ?`;
    db.prepare(updateQuery).run(...updateValues);

    // Log activity
    db.prepare(
      'INSERT INTO logs_activite (utilisateur_id, action, module, details, ip_address) VALUES (?, ?, ?, ?, ?)'
    ).run(
      req.user.id,
      'modification_message',
      'contact',
      JSON.stringify({ 
        messageId: id, 
        newStatut: statut, 
        timestamp: new Date().toISOString() 
      }),
      req.ip || req.connection.remoteAddress
    );

    res.json({
      message: 'Statut du message mis à jour avec succès'
    });
  } catch (error) {
    console.error('Error updating message status:', error);
    res.status(500).json({
      error: 'Erreur lors de la mise à jour du statut',
      code: 'UPDATE_MESSAGE_ERROR'
    });
  }
}));

// POST /api/contacts/newsletter - Subscribe to newsletter (public endpoint)
router.post('/newsletter', [
  body('email').isEmail().withMessage('Email valide requis'),
  body('nom_complet').optional().isLength({ min: 2, max: 100 }).withMessage('Nom invalide')
], asyncHandler(async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    console.error('Newsletter validation errors:', errors.array());
    return res.status(400).json({
      error: 'Données de validation invalides',
      details: errors.array(),
      code: 'VALIDATION_ERROR'
    });
  }

  const { email, nom_complet } = req.body;
  const db = getDatabase();

  console.log('Newsletter subscription request:', { email, nom_complet });

  try {
    // Check if already subscribed
    const existingSubscriber = db.prepare('SELECT id, statut FROM newsletter_abonnes WHERE email = ?').get(email);
    
    if (existingSubscriber) {
      if (existingSubscriber.statut === 'actif') {
        return res.status(409).json({
          error: 'Cette adresse email est déjà abonnée à la newsletter',
          code: 'ALREADY_SUBSCRIBED'
        });
      } else {
        // Reactivate subscription
        db.prepare('UPDATE newsletter_abonnes SET statut = ?, nom_complet = ? WHERE email = ?').run(
          'actif', nom_complet || null, email
        );
        
        return res.json({
          message: 'Abonnement réactivé avec succès'
        });
      }
    }

    // Generate unsubscribe token
    const token = generateUnsubscribeToken();

    // Add new subscriber
    db.prepare(`
      INSERT INTO newsletter_abonnes (email, nom_complet, statut, token_desinscription, source)
      VALUES (?, ?, ?, ?, ?)
    `).run(email, nom_complet || null, 'actif', token, 'site_web');

    // Update daily statistics
    const today = new Date().toISOString().split('T')[0];
    try {
      db.prepare(`
        INSERT INTO statistiques_journalieres (date, nouvelles_inscriptions_newsletter)
        VALUES (?, 1)
        ON CONFLICT(date) DO UPDATE SET
          nouvelles_inscriptions_newsletter = nouvelles_inscriptions_newsletter + 1,
          date_calcul = CURRENT_TIMESTAMP
      `).run(today);
    } catch (statsError) {
      console.warn('Error updating daily statistics:', statsError.message);
    }

    res.status(201).json({
      message: 'Inscription à la newsletter réussie'
    });
  } catch (error) {
    console.error('Error subscribing to newsletter:', error);
    res.status(500).json({
      error: 'Erreur lors de l\'inscription à la newsletter',
      code: 'NEWSLETTER_SUBSCRIBE_ERROR'
    });
  }
}));

export default router;

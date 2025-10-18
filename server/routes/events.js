import express from 'express';
import { body, query, validationResult } from 'express-validator';
import { getDatabase } from '../config/database.js';
import { authenticateToken, requirePrivilege } from '../middleware/auth.js';
import { asyncHandler } from '../middleware/errorHandler.js';

const router = express.Router();

// GET /api/events - Get all events with optional filters
router.get('/', [
  query('statut').optional().isIn(['brouillon', 'publie', 'archive']),
  query('type').optional().isIn(['atelier', 'conference', 'club_lecture', 'exposition', 'formation', 'autre']),
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

  const { statut, type, search, limit = 20, offset = 0 } = req.query;
  const db = getDatabase();

  try {
    let query = `
      SELECT 
        e.id, e.titre, e.description, e.type, e.date_debut, e.date_fin,
        e.lieu, e.image_principale, e.lien_externe, e.statut, e.publie_le,
        e.date_creation, e.nombre_vues,
        g.nom as groupe_nom,
        l.titre as livre_titre,
        a.nom_complet as createur_nom
      FROM evenements e
      LEFT JOIN groupes_lecture g ON e.groupe_lie = g.id
      LEFT JOIN livres l ON e.livre_lie = l.id
      LEFT JOIN administrateurs a ON e.cree_par = a.id
      WHERE 1=1
    `;
    
    const params = [];

    // For non-authenticated users, only show published events
    if (!req.user) {
      query += ` AND e.statut = ?`;
      params.push('publie');
    } else if (statut) {
      query += ` AND e.statut = ?`;
      params.push(statut);
    }

    // Apply other filters
    if (type) {
      query += ` AND e.type = ?`;
      params.push(type);
    }

    if (search) {
      query += ` AND (e.titre LIKE ? OR e.description LIKE ?)`;
      const searchTerm = `%${search}%`;
      params.push(searchTerm, searchTerm);
    }

    query += ` ORDER BY e.date_debut DESC LIMIT ? OFFSET ?`;
    params.push(parseInt(limit), parseInt(offset));

    const events = db.prepare(query).all(...params);

    // Get total count for pagination
    let countQuery = `
      SELECT COUNT(*) as total
      FROM evenements e
      WHERE 1=1
    `;
    const countParams = [];

    if (!req.user) {
      countQuery += ` AND e.statut = ?`;
      countParams.push('publie');
    } else if (statut) {
      countQuery += ` AND e.statut = ?`;
      countParams.push(statut);
    }

    if (type) {
      countQuery += ` AND e.type = ?`;
      countParams.push(type);
    }

    if (search) {
      countQuery += ` AND (e.titre LIKE ? OR e.description LIKE ?)`;
      const searchTerm = `%${search}%`;
      countParams.push(searchTerm, searchTerm);
    }

    const totalResult = db.prepare(countQuery).get(...countParams);
    const total = totalResult.total;

    res.json({
      events,
      pagination: {
        total,
        limit: parseInt(limit),
        offset: parseInt(offset),
        hasMore: offset + events.length < total
      }
    });
  } catch (error) {
    console.error('Error fetching events:', error);
    res.status(500).json({
      error: 'Erreur lors de la récupération des événements',
      code: 'FETCH_EVENTS_ERROR'
    });
  }
}));

// GET /api/events/:id - Get a single event
router.get('/:id', asyncHandler(async (req, res) => {
  const { id } = req.params;
  const db = getDatabase();

  try {
    let query = `
      SELECT 
        e.id, e.titre, e.description, e.type, e.date_debut, e.date_fin,
        e.lieu, e.image_principale, e.lien_externe, e.statut, e.publie_le,
        e.date_creation, e.nombre_vues,
        g.nom as groupe_nom,
        l.titre as livre_titre,
        a.nom_complet as createur_nom
      FROM evenements e
      LEFT JOIN groupes_lecture g ON e.groupe_lie = g.id
      LEFT JOIN livres l ON e.livre_lie = l.id
      LEFT JOIN administrateurs a ON e.cree_par = a.id
      WHERE e.id = ?
    `;

    const params = [id];

    // For non-authenticated users, only allow access to published events
    if (!req.user) {
      query += ` AND e.statut = ?`;
      params.push('publie');
    }

    const event = db.prepare(query).get(...params);

    if (!event) {
      return res.status(404).json({
        error: 'Événement non trouvé',
        code: 'EVENT_NOT_FOUND'
      });
    }

    // Increment view count for published events
    if (event.statut === 'publie') {
      db.prepare('UPDATE evenements SET nombre_vues = nombre_vues + 1 WHERE id = ?').run(id);
    }

    res.json({ event });
  } catch (error) {
    console.error('Error fetching event:', error);
    res.status(500).json({
      error: 'Erreur lors de la récupération de l\'événement',
      code: 'FETCH_EVENT_ERROR'
    });
  }
}));

// POST /api/events - Create a new event (admin only)
router.post('/', authenticateToken, requirePrivilege('evenements', 'create'), [
  body('titre').isLength({ min: 1 }).withMessage('Le titre est requis'),
  body('description').isLength({ min: 10 }).withMessage('La description doit contenir au moins 10 caractères'),
  body('type').isIn(['atelier', 'conference', 'club_lecture', 'exposition', 'formation', 'autre']).withMessage('Type d\'événement invalide'),
  body('date_debut').isISO8601().withMessage('Date de début requise'),
  body('date_fin').optional().isISO8601().withMessage('Date de fin invalide'),
  body('lieu').optional().isLength({ max: 200 }).withMessage('Lieu trop long'),
  body('groupe_lie').optional().isInt({ min: 1 }),
  body('livre_lie').optional().isInt({ min: 1 }),
  body('lien_externe').optional().isURL().withMessage('Lien externe invalide')
], asyncHandler(async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      error: 'Données de validation invalides',
      details: errors.array(),
      code: 'VALIDATION_ERROR'
    });
  }

  const {
    titre, description, type, date_debut, date_fin, lieu,
    image_principale, lien_externe, groupe_lie, livre_lie, statut = 'brouillon'
  } = req.body;

  const db = getDatabase();

  try {
    // Validate date range
    if (date_fin && new Date(date_fin) <= new Date(date_debut)) {
      return res.status(400).json({
        error: 'La date de fin doit être postérieure à la date de début',
        code: 'INVALID_DATE_RANGE'
      });
    }

    // Verify related entities exist if provided
    if (groupe_lie) {
      const group = db.prepare('SELECT id FROM groupes_lecture WHERE id = ?').get(groupe_lie);
      if (!group) {
        return res.status(400).json({
          error: 'Groupe de lecture non trouvé',
          code: 'GROUP_NOT_FOUND'
        });
      }
    }

    if (livre_lie) {
      const book = db.prepare('SELECT id FROM livres WHERE id = ?').get(livre_lie);
      if (!book) {
        return res.status(400).json({
          error: 'Livre non trouvé',
          code: 'BOOK_NOT_FOUND'
        });
      }
    }

    // Insert event
    const result = db.prepare(`
      INSERT INTO evenements (
        titre, description, type, date_debut, date_fin, lieu,
        image_principale, lien_externe, groupe_lie, livre_lie,
        statut, cree_par, publie_le
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).run(
      titre, description, type, date_debut, date_fin || null, lieu || null,
      image_principale || null, lien_externe || null, groupe_lie || null, livre_lie || null,
      statut, req.user.id, statut === 'publie' ? new Date().toISOString() : null
    );

    const eventId = result.lastInsertRowid;

    // Log activity
    db.prepare(
      'INSERT INTO logs_activite (utilisateur_id, action, module, details, ip_address) VALUES (?, ?, ?, ?, ?)'
    ).run(
      req.user.id,
      'creation_evenement',
      'evenements',
      JSON.stringify({ eventId, titre, timestamp: new Date().toISOString() }),
      req.ip || req.connection.remoteAddress
    );

    res.status(201).json({
      message: 'Événement créé avec succès',
      eventId
    });
  } catch (error) {
    console.error('Error creating event:', error);
    res.status(500).json({
      error: 'Erreur lors de la création de l\'événement',
      code: 'CREATE_EVENT_ERROR'
    });
  }
}));

// PUT /api/events/:id - Update an event (admin only)
router.put('/:id', authenticateToken, requirePrivilege('evenements', 'update'), [
  body('titre').optional().isLength({ min: 1 }).withMessage('Le titre ne peut pas être vide'),
  body('description').optional().isLength({ min: 10 }).withMessage('La description doit contenir au moins 10 caractères'),
  body('type').optional().isIn(['atelier', 'conference', 'club_lecture', 'exposition', 'formation', 'autre']),
  body('date_debut').optional().isISO8601(),
  body('date_fin').optional().isISO8601(),
  body('lieu').optional().isLength({ max: 200 }),
  body('lien_externe').optional().isURL()
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
  const updateData = req.body;
  const db = getDatabase();

  try {
    // Check if event exists
    const existingEvent = db.prepare('SELECT id, titre FROM evenements WHERE id = ?').get(id);
    if (!existingEvent) {
      return res.status(404).json({
        error: 'Événement non trouvé',
        code: 'EVENT_NOT_FOUND'
      });
    }

    // Validate date range if both dates are being updated
    if (updateData.date_debut && updateData.date_fin) {
      if (new Date(updateData.date_fin) <= new Date(updateData.date_debut)) {
        return res.status(400).json({
          error: 'La date de fin doit être postérieure à la date de début',
          code: 'INVALID_DATE_RANGE'
        });
      }
    }

    // Build update query dynamically
    const allowedFields = [
      'titre', 'description', 'type', 'date_debut', 'date_fin', 'lieu',
      'image_principale', 'lien_externe', 'groupe_lie', 'livre_lie', 'statut'
    ];

    const updateFields = [];
    const updateValues = [];

    Object.keys(updateData).forEach(key => {
      if (allowedFields.includes(key) && updateData[key] !== undefined) {
        updateFields.push(`${key} = ?`);
        updateValues.push(updateData[key]);
      }
    });

    if (updateFields.length === 0) {
      return res.status(400).json({
        error: 'Aucun champ valide à mettre à jour',
        code: 'NO_VALID_FIELDS'
      });
    }

    // Set publie_le if status is being changed to 'publie'
    if (updateData.statut === 'publie') {
      const currentEvent = db.prepare('SELECT statut FROM evenements WHERE id = ?').get(id);
      if (currentEvent.statut !== 'publie') {
        updateFields.push('publie_le = ?');
        updateValues.push(new Date().toISOString());
      }
    }

    updateValues.push(id);

    const updateQuery = `UPDATE evenements SET ${updateFields.join(', ')} WHERE id = ?`;
    db.prepare(updateQuery).run(...updateValues);

    // Log activity
    db.prepare(
      'INSERT INTO logs_activite (utilisateur_id, action, module, details, ip_address) VALUES (?, ?, ?, ?, ?)'
    ).run(
      req.user.id,
      'modification_evenement',
      'evenements',
      JSON.stringify({ eventId: id, changes: updateData, timestamp: new Date().toISOString() }),
      req.ip || req.connection.remoteAddress
    );

    res.json({
      message: 'Événement mis à jour avec succès'
    });
  } catch (error) {
    console.error('Error updating event:', error);
    res.status(500).json({
      error: 'Erreur lors de la mise à jour de l\'événement',
      code: 'UPDATE_EVENT_ERROR'
    });
  }
}));

// DELETE /api/events/:id - Delete an event (admin only)
router.delete('/:id', authenticateToken, requirePrivilege('evenements', 'delete'), asyncHandler(async (req, res) => {
  const { id } = req.params;
  const db = getDatabase();

  try {
    // Check if event exists
    const event = db.prepare('SELECT id, titre FROM evenements WHERE id = ?').get(id);
    if (!event) {
      return res.status(404).json({
        error: 'Événement non trouvé',
        code: 'EVENT_NOT_FOUND'
      });
    }

    // Delete the event
    db.prepare('DELETE FROM evenements WHERE id = ?').run(id);

    // Log activity
    db.prepare(
      'INSERT INTO logs_activite (utilisateur_id, action, module, details, ip_address) VALUES (?, ?, ?, ?, ?)'
    ).run(
      req.user.id,
      'suppression_evenement',
      'evenements',
      JSON.stringify({ eventId: id, titre: event.titre, timestamp: new Date().toISOString() }),
      req.ip || req.connection.remoteAddress
    );

    res.json({
      message: 'Événement supprimé avec succès'
    });
  } catch (error) {
    console.error('Error deleting event:', error);
    res.status(500).json({
      error: 'Erreur lors de la suppression de l\'événement',
      code: 'DELETE_EVENT_ERROR'
    });
  }
}));

export default router;

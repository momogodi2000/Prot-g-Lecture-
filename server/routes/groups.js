import express from 'express';
import { body, query, validationResult } from 'express-validator';
import { getDatabase } from '../config/database.js';
import { authenticateToken, requirePrivilege } from '../middleware/auth.js';
import { asyncHandler } from '../middleware/errorHandler.js';

const router = express.Router();

// GET /api/groups - Get all reading groups with optional filters
router.get('/', [
  query('statut').optional().isIn(['actif', 'inactif', 'archive']),
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
        g.id, g.nom, g.description, g.theme, g.image_couverture, g.statut,
        g.date_creation, g.nombre_membres, g.prochaine_rencontre, g.lieu_rencontre,
        l.titre as livre_du_mois_titre,
        a.nom_complet as createur_nom
      FROM groupes_lecture g
      LEFT JOIN livres l ON g.livre_du_mois = l.id
      LEFT JOIN administrateurs a ON g.cree_par = a.id
      WHERE 1=1
    `;
    
    const params = [];

    // For non-authenticated users, only show active groups
    if (!req.user) {
      query += ` AND g.statut = ?`;
      params.push('actif');
    } else if (statut) {
      query += ` AND g.statut = ?`;
      params.push(statut);
    }

    // Apply search filter
    if (search) {
      query += ` AND (g.nom LIKE ? OR g.description LIKE ? OR g.theme LIKE ?)`;
      const searchTerm = `%${search}%`;
      params.push(searchTerm, searchTerm, searchTerm);
    }

    query += ` ORDER BY g.date_creation DESC LIMIT ? OFFSET ?`;
    params.push(parseInt(limit), parseInt(offset));

    const groups = db.prepare(query).all(...params);

    // Get total count for pagination
    let countQuery = `
      SELECT COUNT(*) as total
      FROM groupes_lecture g
      WHERE 1=1
    `;
    const countParams = [];

    if (!req.user) {
      countQuery += ` AND g.statut = ?`;
      countParams.push('actif');
    } else if (statut) {
      countQuery += ` AND g.statut = ?`;
      countParams.push(statut);
    }

    if (search) {
      countQuery += ` AND (g.nom LIKE ? OR g.description LIKE ? OR g.theme LIKE ?)`;
      const searchTerm = `%${search}%`;
      countParams.push(searchTerm, searchTerm, searchTerm);
    }

    const totalResult = db.prepare(countQuery).get(...countParams);
    const total = totalResult.total;

    res.json({
      groups,
      pagination: {
        total,
        limit: parseInt(limit),
        offset: parseInt(offset),
        hasMore: offset + groups.length < total
      }
    });
  } catch (error) {
    console.error('Error fetching groups:', error);
    res.status(500).json({
      error: 'Erreur lors de la récupération des groupes',
      code: 'FETCH_GROUPS_ERROR'
    });
  }
}));

// GET /api/groups/:id - Get a single group with members and activities
router.get('/:id', asyncHandler(async (req, res) => {
  const { id } = req.params;
  const db = getDatabase();

  try {
    let groupQuery = `
      SELECT 
        g.id, g.nom, g.description, g.theme, g.image_couverture, g.statut,
        g.date_creation, g.nombre_membres, g.prochaine_rencontre, g.lieu_rencontre,
        l.titre as livre_du_mois_titre, l.id as livre_du_mois_id,
        a.nom_complet as createur_nom
      FROM groupes_lecture g
      LEFT JOIN livres l ON g.livre_du_mois = l.id
      LEFT JOIN administrateurs a ON g.cree_par = a.id
      WHERE g.id = ?
    `;

    const params = [id];

    // For non-authenticated users, only allow access to active groups
    if (!req.user) {
      groupQuery += ` AND g.statut = ?`;
      params.push('actif');
    }

    const group = db.prepare(groupQuery).get(...params);

    if (!group) {
      return res.status(404).json({
        error: 'Groupe non trouvé',
        code: 'GROUP_NOT_FOUND'
      });
    }

    // Get group members
    const members = db.prepare(`
      SELECT id, nom_complet, email, telephone, date_inscription, statut
      FROM membres_groupes 
      WHERE groupe_id = ? AND statut = 'actif'
      ORDER BY date_inscription DESC
    `).all(id);

    // Get group activities
    const activities = db.prepare(`
      SELECT 
        ag.id, ag.titre, ag.description, ag.type, ag.date_activite, ag.lieu,
        l.titre as livre_associe_titre,
        a.nom_complet as createur_nom
      FROM activites_groupes ag
      LEFT JOIN livres l ON ag.livre_associe = l.id
      LEFT JOIN administrateurs a ON ag.cree_par = a.id
      WHERE ag.groupe_id = ?
      ORDER BY ag.date_activite DESC
      LIMIT 10
    `).all(id);

    res.json({
      group: {
        ...group,
        membres: members,
        activites: activities
      }
    });
  } catch (error) {
    console.error('Error fetching group:', error);
    res.status(500).json({
      error: 'Erreur lors de la récupération du groupe',
      code: 'FETCH_GROUP_ERROR'
    });
  }
}));

// POST /api/groups - Create a new reading group (admin only)
router.post('/', authenticateToken, requirePrivilege('groupes', 'create'), [
  body('nom').isLength({ min: 1 }).withMessage('Le nom est requis'),
  body('description').isLength({ min: 10 }).withMessage('La description doit contenir au moins 10 caractères'),
  body('theme').isLength({ min: 1 }).withMessage('Le thème est requis'),
  body('statut').optional().isIn(['actif', 'inactif'])
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
    nom, description, theme, image_couverture, statut = 'actif',
    prochaine_rencontre, lieu_rencontre, livre_du_mois
  } = req.body;

  const db = getDatabase();

  try {
    // Verify related book exists if provided
    if (livre_du_mois) {
      const book = db.prepare('SELECT id FROM livres WHERE id = ?').get(livre_du_mois);
      if (!book) {
        return res.status(400).json({
          error: 'Livre non trouvé',
          code: 'BOOK_NOT_FOUND'
        });
      }
    }

    // Insert group
    const result = db.prepare(`
      INSERT INTO groupes_lecture (
        nom, description, theme, image_couverture, statut,
        prochaine_rencontre, lieu_rencontre, livre_du_mois, cree_par
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).run(
      nom, description, theme, image_couverture || null, statut,
      prochaine_rencontre || null, lieu_rencontre || null, livre_du_mois || null, req.user.id
    );

    const groupId = result.lastInsertRowid;

    // Log activity
    db.prepare(
      'INSERT INTO logs_activite (utilisateur_id, action, module, details, ip_address) VALUES (?, ?, ?, ?, ?)'
    ).run(
      req.user.id,
      'creation_groupe',
      'groupes',
      JSON.stringify({ groupId, nom, timestamp: new Date().toISOString() }),
      req.ip || req.connection.remoteAddress
    );

    res.status(201).json({
      message: 'Groupe créé avec succès',
      groupId
    });
  } catch (error) {
    console.error('Error creating group:', error);
    res.status(500).json({
      error: 'Erreur lors de la création du groupe',
      code: 'CREATE_GROUP_ERROR'
    });
  }
}));

// POST /api/groups/:id/members - Join a group (public endpoint)
router.post('/:id/members', [
  body('nom_complet').isLength({ min: 2 }).withMessage('Le nom complet est requis'),
  body('email').isEmail().normalizeEmail().withMessage('Email valide requis'),
  body('telephone').optional().isLength({ min: 8 }).withMessage('Numéro de téléphone invalide')
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
  const { nom_complet, email, telephone } = req.body;
  const db = getDatabase();

  try {
    // Check if group exists and is active
    const group = db.prepare('SELECT id, nom, statut FROM groupes_lecture WHERE id = ? AND statut = ?').get(id, 'actif');
    if (!group) {
      return res.status(404).json({
        error: 'Groupe non trouvé ou inactif',
        code: 'GROUP_NOT_FOUND'
      });
    }

    // Check if user is already a member
    const existingMember = db.prepare('SELECT id FROM membres_groupes WHERE groupe_id = ? AND email = ?').get(id, email);
    if (existingMember) {
      return res.status(409).json({
        error: 'Vous êtes déjà membre de ce groupe',
        code: 'ALREADY_MEMBER'
      });
    }

    // Add member to group
    db.prepare(`
      INSERT INTO membres_groupes (groupe_id, nom_complet, email, telephone, statut)
      VALUES (?, ?, ?, ?, ?)
    `).run(id, nom_complet, email, telephone || null, 'actif');

    // Update member count
    db.prepare('UPDATE groupes_lecture SET nombre_membres = nombre_membres + 1 WHERE id = ?').run(id);

    res.status(201).json({
      message: 'Inscription au groupe réussie'
    });
  } catch (error) {
    console.error('Error joining group:', error);
    res.status(500).json({
      error: 'Erreur lors de l\'inscription au groupe',
      code: 'JOIN_GROUP_ERROR'
    });
  }
}));

// PUT /api/groups/:id - Update a group (admin only)
router.put('/:id', authenticateToken, requirePrivilege('groupes', 'update'), [
  body('nom').optional().isLength({ min: 1 }).withMessage('Le nom ne peut pas être vide'),
  body('description').optional().isLength({ min: 10 }).withMessage('La description doit contenir au moins 10 caractères'),
  body('statut').optional().isIn(['actif', 'inactif', 'archive'])
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
    // Check if group exists
    const existingGroup = db.prepare('SELECT id, nom FROM groupes_lecture WHERE id = ?').get(id);
    if (!existingGroup) {
      return res.status(404).json({
        error: 'Groupe non trouvé',
        code: 'GROUP_NOT_FOUND'
      });
    }

    // Build update query dynamically
    const allowedFields = [
      'nom', 'description', 'theme', 'image_couverture', 'statut',
      'prochaine_rencontre', 'lieu_rencontre', 'livre_du_mois'
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

    updateValues.push(id);

    const updateQuery = `UPDATE groupes_lecture SET ${updateFields.join(', ')} WHERE id = ?`;
    db.prepare(updateQuery).run(...updateValues);

    // Log activity
    db.prepare(
      'INSERT INTO logs_activite (utilisateur_id, action, module, details, ip_address) VALUES (?, ?, ?, ?, ?)'
    ).run(
      req.user.id,
      'modification_groupe',
      'groupes',
      JSON.stringify({ groupId: id, changes: updateData, timestamp: new Date().toISOString() }),
      req.ip || req.connection.remoteAddress
    );

    res.json({
      message: 'Groupe mis à jour avec succès'
    });
  } catch (error) {
    console.error('Error updating group:', error);
    res.status(500).json({
      error: 'Erreur lors de la mise à jour du groupe',
      code: 'UPDATE_GROUP_ERROR'
    });
  }
}));

// DELETE /api/groups/:id - Delete a group (admin only)
router.delete('/:id', authenticateToken, requirePrivilege('groupes', 'delete'), asyncHandler(async (req, res) => {
  const { id } = req.params;
  const db = getDatabase();

  try {
    // Check if group exists
    const group = db.prepare('SELECT id, nom FROM groupes_lecture WHERE id = ?').get(id);
    if (!group) {
      return res.status(404).json({
        error: 'Groupe non trouvé',
        code: 'GROUP_NOT_FOUND'
      });
    }

    // Delete the group (members and activities will be deleted by cascade)
    db.prepare('DELETE FROM groupes_lecture WHERE id = ?').run(id);

    // Log activity
    db.prepare(
      'INSERT INTO logs_activite (utilisateur_id, action, module, details, ip_address) VALUES (?, ?, ?, ?, ?)'
    ).run(
      req.user.id,
      'suppression_groupe',
      'groupes',
      JSON.stringify({ groupId: id, nom: group.nom, timestamp: new Date().toISOString() }),
      req.ip || req.connection.remoteAddress
    );

    res.json({
      message: 'Groupe supprimé avec succès'
    });
  } catch (error) {
    console.error('Error deleting group:', error);
    res.status(500).json({
      error: 'Erreur lors de la suppression du groupe',
      code: 'DELETE_GROUP_ERROR'
    });
  }
}));

export default router;

import express from 'express';
import { body, query, validationResult } from 'express-validator';
import { getDatabase } from '../config/database.js';
import { authenticateToken, requirePrivilege } from '../middleware/auth.js';
import { asyncHandler } from '../middleware/errorHandler.js';
import { generateReservationNumber } from '../utils/helpers.js';
import emailService from '../services/email.js';

const router = express.Router();

// GET /api/reservations - Get all reservations with filters (admin only for management, public for user's own)
router.get('/', authenticateToken, [
  query('statut').optional().isIn(['en_attente', 'validee', 'refusee', 'terminee', 'annulee']),
  query('date_souhaitee').optional().isISO8601().withMessage('Date invalide'),
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

  const { statut, date_souhaitee, search, limit = 20, offset = 0 } = req.query;
  const db = getDatabase();

  try {
    let query = `
      SELECT 
        r.id, r.numero_reservation, r.nom_visiteur, r.email_visiteur, 
        r.telephone_visiteur, r.date_souhaitee, r.creneau, r.commentaire,
        r.statut, r.date_creation, r.date_validation, r.date_visite,
        r.remarque_admin, r.notification_envoyee,
        l.id as livre_id, l.titre as livre_titre,
        a.nom_complet as auteur_nom,
        adm.nom_complet as validateur_nom
      FROM reservations r
      LEFT JOIN livres l ON r.livre_id = l.id
      LEFT JOIN auteurs a ON l.auteur_id = a.id
      LEFT JOIN administrateurs adm ON r.valide_par = adm.id
      WHERE 1=1
    `;
    
    const params = [];

    // For non-admin users, only show their own reservations
    if (req.user.role !== 'super_admin' && req.user.role !== 'admin') {
      query += ` AND r.email_visiteur = ?`;
      params.push(req.user.email);
    }

    // Apply filters
    if (statut) {
      query += ` AND r.statut = ?`;
      params.push(statut);
    }

    if (date_souhaitee) {
      query += ` AND r.date_souhaitee = ?`;
      params.push(date_souhaitee);
    }

    if (search) {
      query += ` AND (r.nom_visiteur LIKE ? OR r.email_visiteur LIKE ? OR r.numero_reservation LIKE ? OR l.titre LIKE ?)`;
      const searchTerm = `%${search}%`;
      params.push(searchTerm, searchTerm, searchTerm, searchTerm);
    }

    query += ` ORDER BY r.date_creation DESC LIMIT ? OFFSET ?`;
    params.push(parseInt(limit), parseInt(offset));

    const reservations = db.prepare(query).all(...params);

    // Get total count for pagination
    let countQuery = `
      SELECT COUNT(*) as total
      FROM reservations r
      LEFT JOIN livres l ON r.livre_id = l.id
      WHERE 1=1
    `;
    const countParams = [];

    if (req.user.role !== 'super_admin' && req.user.role !== 'admin') {
      countQuery += ` AND r.email_visiteur = ?`;
      countParams.push(req.user.email);
    }

    if (statut) {
      countQuery += ` AND r.statut = ?`;
      countParams.push(statut);
    }

    if (date_souhaitee) {
      countQuery += ` AND r.date_souhaitee = ?`;
      countParams.push(date_souhaitee);
    }

    if (search) {
      countQuery += ` AND (r.nom_visiteur LIKE ? OR r.email_visiteur LIKE ? OR r.numero_reservation LIKE ? OR l.titre LIKE ?)`;
      const searchTerm = `%${search}%`;
      countParams.push(searchTerm, searchTerm, searchTerm, searchTerm);
    }

    const totalResult = db.prepare(countQuery).get(...countParams);
    const total = totalResult.total;

    res.json({
      reservations,
      pagination: {
        total,
        limit: parseInt(limit),
        offset: parseInt(offset),
        hasMore: offset + reservations.length < total
      }
    });
  } catch (error) {
    console.error('Error fetching reservations:', error);
    res.status(500).json({
      error: 'Erreur lors de la récupération des réservations',
      code: 'FETCH_RESERVATIONS_ERROR'
    });
  }
}));

// POST /api/reservations - Create a new reservation (public endpoint)
router.post('/', [
  body('livre_id').custom((value) => {
    const num = parseInt(value);
    if (isNaN(num) || num < 1) {
      throw new Error('L\'ID du livre doit être un nombre entier valide');
    }
    return true;
  }),
  body('nom_visiteur').isLength({ min: 2 }).withMessage('Le nom du visiteur est requis'),
  body('email_visiteur').isEmail().withMessage('Email valide requis'),
  body('telephone_visiteur').isLength({ min: 8 }).withMessage('Numéro de téléphone requis'),
  body('date_souhaitee').isISO8601().withMessage('Date souhaitée requise'),
  body('creneau').isIn(['matin', 'apres_midi']).withMessage('Créneau invalide'),
  body('commentaire').optional().isLength({ max: 500 }).withMessage('Commentaire trop long')
], asyncHandler(async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    console.error('Reservation validation errors:', errors.array());
    return res.status(400).json({
      error: 'Données de validation invalides',
      details: errors.array(),
      code: 'VALIDATION_ERROR'
    });
  }

  const {
    livre_id, nom_visiteur, email_visiteur, telephone_visiteur,
    date_souhaitee, creneau, commentaire
  } = req.body;

  // Ensure livre_id is properly converted to integer
  const bookId = parseInt(livre_id);

  console.log('Reservation request:', req.body);

  const db = getDatabase();

  try {
    // Check if book exists and is available, include author info for email
    const book = db.prepare(`
      SELECT l.id, l.titre, l.exemplaires_disponibles, l.statut, a.nom_complet as auteur_nom
      FROM livres l
      LEFT JOIN auteurs a ON l.auteur_id = a.id
      WHERE l.id = ? AND l.statut = 'disponible' AND l.exemplaires_disponibles > 0
    `).get(bookId);

    if (!book) {
      return res.status(400).json({
        error: 'Livre non disponible pour la réservation',
        code: 'BOOK_NOT_AVAILABLE'
      });
    }

    // Check for booking conflicts - if the same book is already booked for the same date and time slot
    const existingBooking = db.prepare(`
      SELECT COUNT(*) as count 
      FROM reservations r
      WHERE r.livre_id = ? AND r.date_souhaitee = ? AND r.creneau = ? 
      AND r.statut IN ('en_attente', 'validee')
    `).get(bookId, date_souhaitee, creneau);

    if (existingBooking.count > 0) {
      return res.status(400).json({
        error: 'Ce livre est déjà réservé pour cette date et ce créneau horaire',
        code: 'BOOKING_CONFLICT'
      });
    }

    // Check NGO opening hours
    const requestedDate = new Date(date_souhaitee);
    const dayOfWeek = requestedDate.getDay(); // 0 = Sunday, 1 = Monday, etc.
    
    // Get opening hours configuration from database
    const dayNames = ['dimanche', 'lundi', 'mardi', 'mercredi', 'jeudi', 'vendredi', 'samedi'];
    const dayParamKey = `ouverture_${dayNames[dayOfWeek]}`;
    
    const isOpenOnDay = db.prepare(
      'SELECT valeur FROM parametres_systeme WHERE cle = ?'
    ).get(dayParamKey);
    
    if (!isOpenOnDay || isOpenOnDay.valeur === 'false') {
      const dayName = dayNames[dayOfWeek];
      return res.status(400).json({
        error: `Le centre est fermé le ${dayName}`,
        code: 'CLOSED_DAY'
      });
    }

    // Check if date is not in the past
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    if (requestedDate < today) {
      return res.status(400).json({
        error: 'La date de réservation ne peut pas être dans le passé',
        code: 'INVALID_DATE'
      });
    }

    // Check system parameters for reservation limits
    const maxReservationsPerDay = db.prepare(
      'SELECT valeur FROM parametres_systeme WHERE cle = ?'
    ).get('max_reservations_jour');
    
    const maxPerSlot = db.prepare(
      'SELECT valeur FROM parametres_systeme WHERE cle = ?'
    ).get('max_reservations_creneau');

    if (maxReservationsPerDay) {
      const dailyCount = db.prepare(
        'SELECT COUNT(*) as count FROM reservations WHERE date_souhaitee = ? AND statut != ?'
      ).get(date_souhaitee, 'annulee');
      
      if (dailyCount.count >= parseInt(maxReservationsPerDay.valeur)) {
        return res.status(400).json({
          error: 'Limite de réservations quotidienne atteinte pour cette date',
          code: 'DAILY_LIMIT_REACHED'
        });
      }
    }

    if (maxPerSlot) {
      const slotCount = db.prepare(
        'SELECT COUNT(*) as count FROM reservations WHERE date_souhaitee = ? AND creneau = ? AND statut != ?'
      ).get(date_souhaitee, creneau, 'annulee');
      
      if (slotCount.count >= parseInt(maxPerSlot.valeur)) {
        return res.status(400).json({
          error: 'Limite de réservations atteinte pour ce créneau',
          code: 'SLOT_LIMIT_REACHED'
        });
      }
    }

    // Generate unique reservation number
    const numero_reservation = generateReservationNumber();

    // Create reservation
    const result = db.prepare(`
      INSERT INTO reservations (
        numero_reservation, livre_id, nom_visiteur, email_visiteur,
        telephone_visiteur, date_souhaitee, creneau, commentaire, statut
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).run(
      numero_reservation, bookId, nom_visiteur, email_visiteur,
      telephone_visiteur, date_souhaitee, creneau, commentaire || null, 'en_attente'
    );

    const reservationId = result.lastInsertRowid;

    // Prepare reservation data for emails
    const reservationData = {
      id: reservationId,
      numero_reservation,
      livre_id: bookId,
      nom_visiteur,
      email_visiteur,
      telephone_visiteur,
      date_souhaitee,
      creneau,
      commentaire,
      statut: 'en_attente'
    };

    // Send emails asynchronously (don't wait for them to complete)
    setImmediate(async () => {
      try {
        // Send confirmation to user
        await emailService.sendReservationConfirmation(reservationData, book);
        
        // Send notification to admin
        await emailService.sendReservationNotification(reservationData, book);
        
        console.log(`📧 Emails sent for reservation ${numero_reservation}`);
      } catch (emailError) {
        console.error('Error sending emails for reservation:', emailError);
        // Don't fail the reservation if email fails
      }
    });

    res.status(201).json({
      message: 'Réservation créée avec succès',
      reservationId,
      numero_reservation
    });
  } catch (error) {
    console.error('Error creating reservation:', error);
    res.status(500).json({
      error: 'Erreur lors de la création de la réservation',
      code: 'CREATE_RESERVATION_ERROR'
    });
  }
}));

// GET /api/reservations/:id - Get a single reservation
router.get('/:id', authenticateToken, asyncHandler(async (req, res) => {
  const { id } = req.params;
  const db = getDatabase();

  try {
    let query = `
      SELECT 
        r.id, r.numero_reservation, r.nom_visiteur, r.email_visiteur, 
        r.telephone_visiteur, r.date_souhaitee, r.creneau, r.commentaire,
        r.statut, r.date_creation, r.date_validation, r.date_visite,
        r.remarque_admin, r.notification_envoyee,
        l.id as livre_id, l.titre as livre_titre,
        a.nom_complet as auteur_nom,
        adm.nom_complet as validateur_nom
      FROM reservations r
      LEFT JOIN livres l ON r.livre_id = l.id
      LEFT JOIN auteurs a ON l.auteur_id = a.id
      LEFT JOIN administrateurs adm ON r.valide_par = adm.id
      WHERE r.id = ?
    `;

    const params = [id];

    // For non-admin users, only allow access to their own reservations
    if (req.user.role !== 'super_admin' && req.user.role !== 'admin') {
      query += ` AND r.email_visiteur = ?`;
      params.push(req.user.email);
    }

    const reservation = db.prepare(query).get(...params);

    if (!reservation) {
      return res.status(404).json({
        error: 'Réservation non trouvée',
        code: 'RESERVATION_NOT_FOUND'
      });
    }

    res.json({ reservation });
  } catch (error) {
    console.error('Error fetching reservation:', error);
    res.status(500).json({
      error: 'Erreur lors de la récupération de la réservation',
      code: 'FETCH_RESERVATION_ERROR'
    });
  }
}));

// PUT /api/reservations/:id/status - Update reservation status (admin only)
router.put('/:id/status', authenticateToken, requirePrivilege('reservations', 'update'), [
  body('statut').isIn(['validee', 'refusee', 'terminee', 'annulee']).withMessage('Statut invalide'),
  body('remarque_admin').optional().isLength({ max: 500 }).withMessage('Remarque trop longue')
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
  const { statut, remarque_admin } = req.body;
  const db = getDatabase();

  try {
    // Get reservation with book and author details for email
    const reservationWithDetails = db.prepare(`
      SELECT r.*, l.titre as livre_titre, a.nom_complet as auteur_nom
      FROM reservations r
      LEFT JOIN livres l ON r.livre_id = l.id
      LEFT JOIN auteurs a ON l.auteur_id = a.id
      WHERE r.id = ?
    `).get(id);

    if (!reservationWithDetails) {
      return res.status(404).json({
        error: 'Réservation non trouvée',
        code: 'RESERVATION_NOT_FOUND'
      });
    }

    const oldStatus = reservationWithDetails.statut;

    // Update reservation status
    db.prepare(`
      UPDATE reservations 
      SET statut = ?, remarque_admin = ?, date_validation = ?, valide_par = ?
      WHERE id = ?
    `).run(statut, remarque_admin || null, new Date().toISOString(), req.user.id, id);

    // If reservation is validated, decrease available copies
    if (statut === 'validee' && oldStatus === 'en_attente') {
      db.prepare(
        'UPDATE livres SET exemplaires_disponibles = exemplaires_disponibles - 1 WHERE id = (SELECT livre_id FROM reservations WHERE id = ?)'
      ).run(id);
    }

    // If reservation is cancelled or rejected, increase available copies back
    if ((statut === 'annulee' || statut === 'refusee') && oldStatus === 'validee') {
      db.prepare(
        'UPDATE livres SET exemplaires_disponibles = exemplaires_disponibles + 1 WHERE id = (SELECT livre_id FROM reservations WHERE id = ?)'
      ).run(id);
    }

    // Prepare book data for email
    const bookData = {
      id: reservationWithDetails.livre_id,
      titre: reservationWithDetails.livre_titre,
      auteur_nom: reservationWithDetails.auteur_nom
    };

    // Send email notification to user about status change (async)
    if (statut === 'validee' || statut === 'refusee') {
      setImmediate(async () => {
        try {
          await emailService.sendReservationUpdate(
            reservationWithDetails, 
            bookData, 
            statut, 
            remarque_admin
          );
          console.log(`📧 Status update email sent for reservation ${reservationWithDetails.numero_reservation}`);
        } catch (emailError) {
          console.error('Error sending status update email:', emailError);
        }
      });
    }

    // Log activity
    db.prepare(
      'INSERT INTO logs_activite (utilisateur_id, action, module, details, ip_address) VALUES (?, ?, ?, ?, ?)'
    ).run(
      req.user.id,
      'modification_reservation',
      'reservations',
      JSON.stringify({ 
        reservationId: id, 
        newStatut: statut, 
        timestamp: new Date().toISOString() 
      }),
      req.ip || req.connection.remoteAddress
    );

    res.json({
      message: 'Statut de réservation mis à jour avec succès'
    });
  } catch (error) {
    console.error('Error updating reservation status:', error);
    res.status(500).json({
      error: 'Erreur lors de la mise à jour du statut',
      code: 'UPDATE_RESERVATION_ERROR'
    });
  }
}));

export default router;

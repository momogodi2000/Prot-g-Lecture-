import express from 'express';
import { body, query, validationResult } from 'express-validator';
import { getDatabase } from '../config/database.js';
import { authenticateToken, requireRole, requirePrivilege } from '../middleware/auth.js';
import { asyncHandler } from '../middleware/errorHandler.js';
import multer from 'multer';
import { parseExcelFile } from '../utils/excel-parser.js';

// Configure multer for file upload
const upload = multer({
  storage: multer.memoryStorage(),
  fileFilter: (req, file, cb) => {
    if (file.mimetype === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' || 
        file.mimetype === 'application/vnd.ms-excel' ||
        file.mimetype === 'text/csv') {
      cb(null, true);
    } else {
      cb(new Error('Format de fichier non supporté. Utilisez .xlsx, .xls ou .csv'));
    }
  }
});

const router = express.Router();

// Route to handle Book table operations
// POST /api/admin/books - Create a new book
router.post('/books', 
  authenticateToken, 
  requirePrivilege('books', 'write'),
  [
    body('book_id').notEmpty().withMessage('Book ID is required'),
    body('title').notEmpty().withMessage('Title is required'),
    body('author').notEmpty().withMessage('Author is required')
  ],
  asyncHandler(async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        error: 'Validation failed',
        details: errors.array(),
        code: 'VALIDATION_ERROR'
      });
    }

    const { book_id, title, author, genre, publication_year, language, description, copies_available, location, category } = req.body;
    const db = getDatabase();

    try {
      // Check if book_id already exists
      const existingBook = db.prepare('SELECT id FROM Book WHERE book_id = ?').get(book_id);
      if (existingBook) {
        return res.status(400).json({
          error: 'Un livre avec cet ID existe déjà',
          code: 'DUPLICATE_BOOK_ID'
        });
      }

      const result = db.prepare(`
        INSERT INTO Book (book_id, title, author, genre, publication_year, language, description, copies_available, location, category)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `).run(
        book_id,
        title,
        author || '',
        genre || '',
        publication_year || null,
        language || 'Français',
        description || '',
        copies_available || 1,
        location || '',
        category || ''
      );

      // Log activity
      db.prepare(
        'INSERT INTO logs_activite (utilisateur_id, action, module, details, ip_address) VALUES (?, ?, ?, ?, ?)'
      ).run(
        req.user.id,
        'create_book',
        'books',
        JSON.stringify({ 
          book_id, 
          title, 
          author,
          timestamp: new Date().toISOString() 
        }),
        req.ip || req.connection.remoteAddress
      );

      res.status(201).json({
        success: true,
        message: 'Livre créé avec succès',
        book: {
          id: result.lastInsertRowid,
          book_id,
          title,
          author,
          genre,
          publication_year,
          language,
          description,
          copies_available,
          location,
          category
        }
      });

    } catch (error) {
      console.error('Error creating book:', error);
      res.status(500).json({
        error: 'Erreur lors de la création du livre',
        details: error.message,
        code: 'CREATE_BOOK_ERROR'
      });
    }
  })
);

// GET /api/admin/books - Get all books
router.get('/books',
  authenticateToken,
  requirePrivilege('books', 'read'),
  asyncHandler(async (req, res) => {
    const db = getDatabase();
    const { limit = 50, offset = 0, search } = req.query;

    try {
      let query = 'SELECT * FROM Book WHERE 1=1';
      const params = [];

      if (search) {
        query += ' AND (title LIKE ? OR author LIKE ? OR genre LIKE ?)';
        const searchTerm = `%${search}%`;
        params.push(searchTerm, searchTerm, searchTerm);
      }

      query += ' ORDER BY id DESC LIMIT ? OFFSET ?';
      params.push(parseInt(limit), parseInt(offset));

      const books = db.prepare(query).all(...params);
      const totalCount = db.prepare('SELECT COUNT(*) as count FROM Book').get();

      res.json({
        success: true,
        books,
        pagination: {
          total: totalCount.count,
          limit: parseInt(limit),
          offset: parseInt(offset),
          hasMore: offset + books.length < totalCount.count
        }
      });
    } catch (error) {
      console.error('Error fetching books:', error);
      res.status(500).json({
        error: 'Erreur lors de la récupération des livres',
        code: 'FETCH_BOOKS_ERROR'
      });
    }
  })
);

// PUT /api/admin/books/:id - Update a book
router.put('/books/:id',
  authenticateToken,
  requirePrivilege('books', 'write'),
  [
    body('title').notEmpty().withMessage('Title is required'),
    body('author').notEmpty().withMessage('Author is required')
  ],
  asyncHandler(async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        error: 'Validation failed',
        details: errors.array(),
        code: 'VALIDATION_ERROR'
      });
    }

    const { id } = req.params;
    const { book_id, title, author, genre, publication_year, language, description, copies_available, location, category } = req.body;
    const db = getDatabase();

    try {
      // Check if book exists
      const existingBook = db.prepare('SELECT id FROM Book WHERE id = ?').get(id);
      if (!existingBook) {
        return res.status(404).json({
          error: 'Livre non trouvé',
          code: 'BOOK_NOT_FOUND'
        });
      }

      // Check if book_id is being changed and if new book_id already exists
      if (book_id) {
        const duplicateBook = db.prepare('SELECT id FROM Book WHERE book_id = ? AND id != ?').get(book_id, id);
        if (duplicateBook) {
          return res.status(400).json({
            error: 'Un livre avec cet ID existe déjà',
            code: 'DUPLICATE_BOOK_ID'
          });
        }
      }

      db.prepare(`
        UPDATE Book SET 
          book_id = COALESCE(?, book_id),
          title = COALESCE(?, title),
          author = COALESCE(?, author),
          genre = COALESCE(?, genre),
          publication_year = COALESCE(?, publication_year),
          language = COALESCE(?, language),
          description = COALESCE(?, description),
          copies_available = COALESCE(?, copies_available),
          location = COALESCE(?, location),
          category = COALESCE(?, category)
        WHERE id = ?
      `).run(
        book_id, title, author, genre, publication_year, language, description, copies_available, location, category, id
      );

      // Log activity
      db.prepare(
        'INSERT INTO logs_activite (utilisateur_id, action, module, details, ip_address) VALUES (?, ?, ?, ?, ?)'
      ).run(
        req.user.id,
        'update_book',
        'books',
        JSON.stringify({ 
          book_id: id, 
          title, 
          author,
          timestamp: new Date().toISOString() 
        }),
        req.ip || req.connection.remoteAddress
      );

      res.json({
        success: true,
        message: 'Livre mis à jour avec succès'
      });

    } catch (error) {
      console.error('Error updating book:', error);
      res.status(500).json({
        error: 'Erreur lors de la mise à jour du livre',
        code: 'UPDATE_BOOK_ERROR'
      });
    }
  })
);

// DELETE /api/admin/books/:id - Delete a book
router.delete('/books/:id',
  authenticateToken,
  requirePrivilege('books', 'write'),
  asyncHandler(async (req, res) => {
    const { id } = req.params;
    const db = getDatabase();

    try {
      // Check if book exists
      const existingBook = db.prepare('SELECT id, book_id, title FROM Book WHERE id = ?').get(id);
      if (!existingBook) {
        return res.status(404).json({
          error: 'Livre non trouvé',
          code: 'BOOK_NOT_FOUND'
        });
      }

      // Delete the book
      db.prepare('DELETE FROM Book WHERE id = ?').run(id);

      // Log activity
      db.prepare(
        'INSERT INTO logs_activite (utilisateur_id, action, module, details, ip_address) VALUES (?, ?, ?, ?, ?)'
      ).run(
        req.user.id,
        'delete_book',
        'books',
        JSON.stringify({ 
          book_id: existingBook.book_id, 
          title: existingBook.title,
          timestamp: new Date().toISOString() 
        }),
        req.ip || req.connection.remoteAddress
      );

      res.json({
        success: true,
        message: 'Livre supprimé avec succès'
      });

    } catch (error) {
      console.error('Error deleting book:', error);
      res.status(500).json({
        error: 'Erreur lors de la suppression du livre',
        code: 'DELETE_BOOK_ERROR'
      });
    }
  })
);

// POST /api/admin/books/import/validate - Validate import file
router.post('/books/import/validate',
  authenticateToken,
  requirePrivilege('books', 'write'),
  upload.single('file'),
  asyncHandler(async (req, res) => {
    if (!req.file) {
      return res.status(400).json({
        error: 'Aucun fichier n\'a été téléchargé',
        code: 'NO_FILE_UPLOADED'
      });
    }

    try {
      let books = [];
      const fileExtension = req.file.originalname.split('.').pop().toLowerCase();

      if (req.file.mimetype === 'text/csv' || fileExtension === 'csv') {
        // Handle CSV file
        const csvString = req.file.buffer.toString('utf8');
        const lines = csvString.split('\n');
        const headers = lines[0].split(',').map(h => h.trim());

        books = lines.slice(1).map((line, index) => {
          if (!line.trim()) return null;
          
          const values = line.split(',').map(v => v.trim().replace(/^"|"$/g, ''));
          const book = {};
          
          headers.forEach((header, idx) => {
            book[header.toLowerCase()] = values[idx] || '';
          });

          return {
            rowNumber: index + 2,
            valid: !!(book.title || book.titre) && !!(book.author || book.auteur),
            title: book.title || book.titre || '',
            author: book.author || book.auteur || '',
            genre: book.genre || book.catégorie || 'Général',
            publication_year: parseInt(book.année || book.year || book['publication_year']) || new Date().getFullYear(),
            language: book.langue || book.language || 'Français',
            description: book.description || '',
            copies_available: parseInt(book.quantity || book['copies_available'] || book.quantité) || 1,
            location: book.location || 'Général'
          };
        }).filter(book => book);
      } else {
        // Handle Excel file
        books = parseExcelFile(req.file.buffer);
      }

      res.json({
        success: true,
        preview: books,
        total: books.length,
        valid: books.filter(b => b.valid).length
      });

    } catch (error) {
      console.error('Error validating import file:', error);
      res.status(500).json({
        error: 'Erreur lors de la validation du fichier',
        details: error.message,
        code: 'VALIDATION_ERROR'
      });
    }
  })
);

// POST /api/admin/books/import - Import books from Excel or CSV
router.post('/books/import', 
  authenticateToken, 
  requirePrivilege('books', 'write'),
  upload.single('file'),
  asyncHandler(async (req, res) => {
    if (!req.file) {
      return res.status(400).json({
        error: 'Aucun fichier n\'a été téléchargé',
        code: 'NO_FILE_UPLOADED'
      });
    }

    try {
      const db = getDatabase();
      let books = [];
      const fileExtension = req.file.originalname.split('.').pop().toLowerCase();

      if (req.file.mimetype === 'text/csv' || fileExtension === 'csv') {
        // Handle CSV file
        const csvString = req.file.buffer.toString('utf8');
        const lines = csvString.split('\n');
        const headers = lines[0].split(',').map(h => h.trim());
        
        books = lines.slice(1).map((line, index) => {
          if (!line.trim()) return null;
          
          const values = line.split(',').map(v => v.trim().replace(/^"|"$/g, ''));
          const book = {};
          
          headers.forEach((header, idx) => {
            book[header.toLowerCase()] = values[idx] || '';
          });

          return {
            rowNumber: index + 2,
            book_id: book.book_id || `IMP-${Date.now()}-${index}`,
            title: book.title || book.titre || '',
            author: book.author || book.auteur || '',
            genre: book.genre || book.catégorie || 'Général',
            publication_year: parseInt(book.année || book.year || book['publication_year']) || new Date().getFullYear(),
            language: book.langue || book.language || 'Français',
            description: book.description || '',
            copies_available: parseInt(book.quantity || book['copies_available'] || book.quantité) || 1,
            location: book.location || 'Général'
          };
        }).filter(book => book && book.title && book.author);
      } else {
        // Handle Excel file
        const excelBooks = parseExcelFile(req.file.buffer);
        books = excelBooks.map((book, index) => ({
          rowNumber: index + 2,
          book_id: book.book_id || `IMP-${Date.now()}-${index}`,
          title: book.titre || '',
          author: book.auteur || '',
          genre: book.categories || 'Général',
          publication_year: parseInt(book.annee_publication) || new Date().getFullYear(),
          language: book.langue || 'Français',
          description: book.description || '',
          copies_available: parseInt(book.nombre_exemplaires) || 1,
          location: book.emplacement || 'Général'
        }));
      }

      const stmt = db.prepare(`
        INSERT INTO Book (book_id, title, author, genre, publication_year, language, description, copies_available, location)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
      `);

      const insertedBooks = [];
      const errors = [];

      db.transaction(() => {
        books.forEach((book, index) => {
          try {
            // Check if book_id already exists
            const existingBook = db.prepare('SELECT id FROM Book WHERE book_id = ?').get(book.book_id);
            if (existingBook) {
              errors.push({
                row: book.rowNumber,
                error: 'Book ID already exists',
                book: book
              });
              return;
            }

            const result = stmt.run(
              book.book_id,
              book.title,
              book.author,
              book.genre,
              book.publication_year,
              book.language,
              book.description,
              book.copies_available,
              book.location
            );
            insertedBooks.push({ ...book, id: result.lastInsertRowid });
          } catch (error) {
            errors.push({
              row: book.rowNumber,
              error: error.message,
              book: book
            });
          }
        });
      })();

      // Log activity
      db.prepare(
        'INSERT INTO logs_activite (utilisateur_id, action, module, details, ip_address) VALUES (?, ?, ?, ?, ?)'
      ).run(
        req.user.id,
        'import_books',
        'books',
        JSON.stringify({ 
          insertedCount: insertedBooks.length,
          errorCount: errors.length,
          timestamp: new Date().toISOString() 
        }),
        req.ip || req.connection.remoteAddress
      );

      res.json({
        success: true,
        message: `${insertedBooks.length} livres importés avec succès`,
        inserted: insertedBooks,
        errors: errors
      });

    } catch (error) {
      console.error('Error importing books:', error);
      res.status(500).json({
        error: 'Erreur lors de l\'importation des livres',
        details: error.message,
        code: 'IMPORT_ERROR'
      });
    }
  })
);

// GET /api/admin/stats - Get dashboard statistics (super admin only)
router.get('/stats', authenticateToken, requireRole(['super_admin', 'admin']), asyncHandler(async (req, res) => {
  const db = getDatabase();

  try {
    // Get basic counts
    const booksCount = db.prepare('SELECT COUNT(*) as count FROM Book').get();
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

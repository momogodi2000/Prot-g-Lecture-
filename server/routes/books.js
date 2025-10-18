import express from 'express';
import { body, query, validationResult } from 'express-validator';
import multer from 'multer';
import XLSX from 'xlsx';
import { getDatabase } from '../config/database.js';
import { authenticateToken, requirePrivilege } from '../middleware/auth.js';
import { asyncHandler } from '../middleware/errorHandler.js';

const router = express.Router();

// Configure multer for file uploads
const upload = multer({ 
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
  fileFilter: (req, file, cb) => {
    if (file.mimetype.includes('spreadsheet') || 
        file.originalname.endsWith('.xlsx') || 
        file.originalname.endsWith('.xls')) {
      cb(null, true);
    } else {
      cb(new Error('Only Excel files are allowed'), false);
    }
  }
});

// GET /api/books - Get all books with optional filters
router.get('/', [
  query('search').optional().isLength({ min: 1 }),
  query('categorie_id').optional().isInt({ min: 1 }),
  query('auteur_id').optional().isInt({ min: 1 }),
  query('langue').optional().isIn(['FR', 'EN', 'ES', 'DE', 'AUTRE']),
  query('statut').optional().isIn(['disponible', 'reserve_complet', 'maintenance']),
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

  const { search, categorie_id, auteur_id, langue, statut, limit = 20, offset = 0 } = req.query;
  const db = getDatabase();

  try {
    let query = `
      SELECT 
        l.id, l.isbn, l.titre, l.resume, l.annee_publication, l.editeur, l.langue,
        l.nombre_pages, l.nombre_exemplaires, l.exemplaires_disponibles, l.statut,
        l.image_couverture, l.tags, l.cote, l.date_ajout, l.date_modification,
        a.id as auteur_id, a.nom_complet as auteur_nom, a.biographie as auteur_biographie,
        c.id as categorie_id, c.nom as categorie_nom, c.couleur_hex as categorie_couleur
      FROM livres l
      LEFT JOIN auteurs a ON l.auteur_id = a.id
      LEFT JOIN categories c ON l.categorie_id = c.id
      WHERE 1=1
    `;
    
    const params = [];

    // Apply filters
    if (search) {
      query += ` AND (l.titre LIKE ? OR l.isbn LIKE ? OR a.nom_complet LIKE ?)`;
      const searchTerm = `%${search}%`;
      params.push(searchTerm, searchTerm, searchTerm);
    }

    if (categorie_id) {
      query += ` AND l.categorie_id = ?`;
      params.push(categorie_id);
    }

    if (auteur_id) {
      query += ` AND l.auteur_id = ?`;
      params.push(auteur_id);
    }

    if (langue) {
      query += ` AND l.langue = ?`;
      params.push(langue);
    }

    if (statut) {
      query += ` AND l.statut = ?`;
      params.push(statut);
    }

    query += ` ORDER BY l.date_ajout DESC LIMIT ? OFFSET ?`;
    params.push(parseInt(limit), parseInt(offset));

    const books = db.prepare(query).all(...params);

    // Get total count for pagination
    let countQuery = `
      SELECT COUNT(*) as total
      FROM livres l
      LEFT JOIN auteurs a ON l.auteur_id = a.id
      WHERE 1=1
    `;
    const countParams = [];

    if (search) {
      countQuery += ` AND (l.titre LIKE ? OR l.isbn LIKE ? OR a.nom_complet LIKE ?)`;
      const searchTerm = `%${search}%`;
      countParams.push(searchTerm, searchTerm, searchTerm);
    }

    if (categorie_id) {
      countQuery += ` AND l.categorie_id = ?`;
      countParams.push(categorie_id);
    }

    if (auteur_id) {
      countQuery += ` AND l.auteur_id = ?`;
      countParams.push(auteur_id);
    }

    if (langue) {
      countQuery += ` AND l.langue = ?`;
      countParams.push(langue);
    }

    if (statut) {
      countQuery += ` AND l.statut = ?`;
      countParams.push(statut);
    }

    const totalResult = db.prepare(countQuery).get(...countParams);
    const total = totalResult.total;

    res.json({
      books,
      pagination: {
        total,
        limit: parseInt(limit),
        offset: parseInt(offset),
        hasMore: offset + books.length < total
      }
    });
  } catch (error) {
    console.error('Error fetching books:', error);
    res.status(500).json({
      error: 'Erreur lors de la récupération des livres',
      code: 'FETCH_BOOKS_ERROR'
    });
  }
}));

// GET /api/books/:id - Get a single book
router.get('/:id', asyncHandler(async (req, res) => {
  const { id } = req.params;
  const db = getDatabase();

  try {
    const book = db.prepare(`
      SELECT 
        l.id, l.isbn, l.titre, l.resume, l.annee_publication, l.editeur, l.langue,
        l.nombre_pages, l.nombre_exemplaires, l.exemplaires_disponibles, l.statut,
        l.image_couverture, l.tags, l.cote, l.date_ajout, l.date_modification,
        a.id as auteur_id, a.nom_complet as auteur_nom, a.biographie as auteur_biographie,
        c.id as categorie_id, c.nom as categorie_nom, c.couleur_hex as categorie_couleur
      FROM livres l
      LEFT JOIN auteurs a ON l.auteur_id = a.id
      LEFT JOIN categories c ON l.categorie_id = c.id
      WHERE l.id = ?
    `).get(id);

    if (!book) {
      return res.status(404).json({
        error: 'Livre non trouvé',
        code: 'BOOK_NOT_FOUND'
      });
    }

    res.json({ book });
  } catch (error) {
    console.error('Error fetching book:', error);
    res.status(500).json({
      error: 'Erreur lors de la récupération du livre',
      code: 'FETCH_BOOK_ERROR'
    });
  }
}));

// POST /api/books - Create a new book (admin only)
router.post('/', authenticateToken, requirePrivilege('livres', 'create'), [
  body('titre').isLength({ min: 1 }).withMessage('Le titre est requis'),
  body('auteur_id').isInt({ min: 1 }).withMessage('L\'auteur est requis'),
  body('categorie_id').isInt({ min: 1 }).withMessage('La catégorie est requise'),
  body('resume').isLength({ min: 10 }).withMessage('Le résumé doit contenir au moins 10 caractères'),
  body('annee_publication').isInt({ min: 1000, max: new Date().getFullYear() + 1 }).withMessage('Année de publication invalide'),
  body('langue').isIn(['FR', 'EN', 'ES', 'DE', 'AUTRE']).withMessage('Langue invalide'),
  body('nombre_exemplaires').isInt({ min: 1 }).withMessage('Le nombre d\'exemplaires doit être positif'),
  body('isbn').optional().isLength({ min: 10, max: 20 })
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
    isbn, titre, auteur_id, resume, categorie_id, annee_publication,
    editeur, langue, nombre_pages, nombre_exemplaires, statut,
    image_couverture, tags, cote
  } = req.body;

  const db = getDatabase();

  try {
    // Verify author and category exist
    const author = db.prepare('SELECT id FROM auteurs WHERE id = ?').get(auteur_id);
    if (!author) {
      return res.status(400).json({
        error: 'Auteur non trouvé',
        code: 'AUTHOR_NOT_FOUND'
      });
    }

    const category = db.prepare('SELECT id FROM categories WHERE id = ?').get(categorie_id);
    if (!category) {
      return res.status(400).json({
        error: 'Catégorie non trouvée',
        code: 'CATEGORY_NOT_FOUND'
      });
    }

    // Insert book
    const result = db.prepare(`
      INSERT INTO livres (
        isbn, titre, auteur_id, resume, categorie_id, annee_publication,
        editeur, langue, nombre_pages, nombre_exemplaires, exemplaires_disponibles,
        statut, image_couverture, tags, cote, ajoute_par
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).run(
      isbn || null, titre, auteur_id, resume, categorie_id, annee_publication,
      editeur || null, langue, nombre_pages || null, nombre_exemplaires, 
      nombre_exemplaires, statut || 'disponible', image_couverture || null,
      tags || null, cote || null, req.user.id
    );

    const bookId = result.lastInsertRowid;

    // Log activity
    db.prepare(
      'INSERT INTO logs_activite (utilisateur_id, action, module, details, ip_address) VALUES (?, ?, ?, ?, ?)'
    ).run(
      req.user.id,
      'creation_livre',
      'livres',
      JSON.stringify({ bookId, titre, timestamp: new Date().toISOString() }),
      req.ip || req.connection.remoteAddress
    );

    res.status(201).json({
      message: 'Livre créé avec succès',
      bookId
    });
  } catch (error) {
    console.error('Error creating book:', error);
    res.status(500).json({
      error: 'Erreur lors de la création du livre',
      code: 'CREATE_BOOK_ERROR'
    });
  }
}));

// PUT /api/books/:id - Update a book (admin only)
router.put('/:id', authenticateToken, requirePrivilege('livres', 'update'), [
  body('titre').optional().isLength({ min: 1 }).withMessage('Le titre ne peut pas être vide'),
  body('resume').optional().isLength({ min: 10 }).withMessage('Le résumé doit contenir au moins 10 caractères'),
  body('annee_publication').optional().isInt({ min: 1000, max: new Date().getFullYear() + 1 }),
  body('langue').optional().isIn(['FR', 'EN', 'ES', 'DE', 'AUTRE']),
  body('nombre_exemplaires').optional().isInt({ min: 1 })
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
    // Check if book exists
    const existingBook = db.prepare('SELECT id, titre FROM livres WHERE id = ?').get(id);
    if (!existingBook) {
      return res.status(404).json({
        error: 'Livre non trouvé',
        code: 'BOOK_NOT_FOUND'
      });
    }

    // Build update query dynamically
    const allowedFields = [
      'isbn', 'titre', 'auteur_id', 'resume', 'categorie_id', 'annee_publication',
      'editeur', 'langue', 'nombre_pages', 'nombre_exemplaires', 'exemplaires_disponibles',
      'statut', 'image_couverture', 'tags', 'cote'
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

    updateFields.push('date_modification = ?');
    updateValues.push(new Date().toISOString());
    updateValues.push(id);

    const updateQuery = `UPDATE livres SET ${updateFields.join(', ')} WHERE id = ?`;
    db.prepare(updateQuery).run(...updateValues);

    // Log activity
    db.prepare(
      'INSERT INTO logs_activite (utilisateur_id, action, module, details, ip_address) VALUES (?, ?, ?, ?, ?)'
    ).run(
      req.user.id,
      'modification_livre',
      'livres',
      JSON.stringify({ bookId: id, changes: updateData, timestamp: new Date().toISOString() }),
      req.ip || req.connection.remoteAddress
    );

    res.json({
      message: 'Livre mis à jour avec succès'
    });
  } catch (error) {
    console.error('Error updating book:', error);
    res.status(500).json({
      error: 'Erreur lors de la mise à jour du livre',
      code: 'UPDATE_BOOK_ERROR'
    });
  }
}));

// DELETE /api/books/:id - Delete a book (admin only)
router.delete('/:id', authenticateToken, requirePrivilege('livres', 'delete'), asyncHandler(async (req, res) => {
  const { id } = req.params;
  const db = getDatabase();

  try {
    // Check if book exists
    const book = db.prepare('SELECT id, titre FROM livres WHERE id = ?').get(id);
    if (!book) {
      return res.status(404).json({
        error: 'Livre non trouvé',
        code: 'BOOK_NOT_FOUND'
      });
    }

    // Check if book has active reservations
    const activeReservations = db.prepare(
      'SELECT COUNT(*) as count FROM reservations WHERE livre_id = ? AND statut IN (?, ?)'
    ).get(id, 'en_attente', 'validee');

    if (activeReservations.count > 0) {
      return res.status(400).json({
        error: 'Impossible de supprimer un livre avec des réservations actives',
        code: 'BOOK_HAS_ACTIVE_RESERVATIONS'
      });
    }

    // Delete the book
    db.prepare('DELETE FROM livres WHERE id = ?').run(id);

    // Log activity
    db.prepare(
      'INSERT INTO logs_activite (utilisateur_id, action, module, details, ip_address) VALUES (?, ?, ?, ?, ?)'
    ).run(
      req.user.id,
      'suppression_livre',
      'livres',
      JSON.stringify({ bookId: id, titre: book.titre, timestamp: new Date().toISOString() }),
      req.ip || req.connection.remoteAddress
    );

    res.json({
      message: 'Livre supprimé avec succès'
    });
  } catch (error) {
    console.error('Error deleting book:', error);
    res.status(500).json({
      error: 'Erreur lors de la suppression du livre',
      code: 'DELETE_BOOK_ERROR'
    });
  }
}));

// GET /api/books/authors - Get all authors
router.get('/authors/list', asyncHandler(async (req, res) => {
  const db = getDatabase();
  
  try {
    const authors = db.prepare(`
      SELECT id, nom_complet, biographie, nationalite, photo, nombre_livres
      FROM auteurs 
      ORDER BY nom_complet
    `).all();

    res.json({ authors });
  } catch (error) {
    console.error('Error fetching authors:', error);
    res.status(500).json({
      error: 'Erreur lors de la récupération des auteurs',
      code: 'FETCH_AUTHORS_ERROR'
    });
  }
}));

// GET /api/books/categories - Get all categories
router.get('/categories/list', asyncHandler(async (req, res) => {
  const db = getDatabase();
  
  try {
    const categories = db.prepare(`
      SELECT id, nom, description, couleur_hex, icone, nombre_livres, ordre_affichage
      FROM categories 
      ORDER BY ordre_affichage, nom
    `).all();

    res.json({ categories });
  } catch (error) {
    console.error('Error fetching categories:', error);
    res.status(500).json({
      error: 'Erreur lors de la récupération des catégories',
      code: 'FETCH_CATEGORIES_ERROR'
    });
  }
}));

// POST /api/books/authors - Create a new author (admin only)
router.post('/authors', authenticateToken, requirePrivilege('livres', 'create'), [
  body('nom_complet').isLength({ min: 1 }).withMessage('Le nom complet est requis'),
  body('biographie').optional().isLength({ max: 1000 }).withMessage('La biographie est trop longue'),
  body('nationalite').optional().isLength({ max: 100 }).withMessage('La nationalité est trop longue'),
  body('site_web').optional().isURL().withMessage('Site web invalide')
], asyncHandler(async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      error: 'Données de validation invalides',
      details: errors.array(),
      code: 'VALIDATION_ERROR'
    });
  }

  const { nom_complet, biographie, nationalite, date_naissance, site_web } = req.body;
  const db = getDatabase();

  try {
    // Check if author already exists
    const existingAuthor = db.prepare('SELECT id FROM auteurs WHERE nom_complet = ?').get(nom_complet);
    if (existingAuthor) {
      return res.status(409).json({
        error: 'Un auteur avec ce nom existe déjà',
        code: 'AUTHOR_EXISTS'
      });
    }

    // Create author
    const result = db.prepare(`
      INSERT INTO auteurs (nom_complet, biographie, nationalite, date_naissance, site_web)
      VALUES (?, ?, ?, ?, ?)
    `).run(
      nom_complet,
      biographie || null,
      nationalite || null,
      date_naissance || null,
      site_web || null
    );

    const authorId = result.lastInsertRowid;

    // Log activity
    db.prepare(
      'INSERT INTO logs_activite (utilisateur_id, action, module, details, ip_address) VALUES (?, ?, ?, ?, ?)'
    ).run(
      req.user.id,
      'creation_auteur',
      'livres',
      JSON.stringify({ authorId, nom_complet, timestamp: new Date().toISOString() }),
      req.ip || req.connection.remoteAddress
    );

    res.status(201).json({
      message: 'Auteur créé avec succès',
      authorId,
      author: { id: authorId, nom_complet }
    });
  } catch (error) {
    console.error('Error creating author:', error);
    res.status(500).json({
      error: 'Erreur lors de la création de l\'auteur',
      code: 'CREATE_AUTHOR_ERROR'
    });
  }
}));

// POST /api/books/categories - Create a new category (admin only)
router.post('/categories', authenticateToken, requirePrivilege('livres', 'create'), [
  body('nom').isLength({ min: 1 }).withMessage('Le nom de la catégorie est requis'),
  body('description').optional().isLength({ max: 500 }).withMessage('La description est trop longue'),
  body('couleur_hex').optional().isHexColor().withMessage('Couleur hexadécimale invalide')
], asyncHandler(async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      error: 'Données de validation invalides',
      details: errors.array(),
      code: 'VALIDATION_ERROR'
    });
  }

  const { nom, description, couleur_hex, icone, parent_id } = req.body;
  const db = getDatabase();

  try {
    // Check if category already exists
    const existingCategory = db.prepare('SELECT id FROM categories WHERE nom = ?').get(nom);
    if (existingCategory) {
      return res.status(409).json({
        error: 'Une catégorie avec ce nom existe déjà',
        code: 'CATEGORY_EXISTS'
      });
    }

    // Get the next order number
    const maxOrder = db.prepare('SELECT MAX(ordre_affichage) as max_order FROM categories').get();
    const nextOrder = (maxOrder.max_order || 0) + 1;

    // Create category
    const result = db.prepare(`
      INSERT INTO categories (nom, description, couleur_hex, icone, parent_id, ordre_affichage)
      VALUES (?, ?, ?, ?, ?, ?)
    `).run(
      nom,
      description || null,
      couleur_hex || '#A5D6A7',
      icone || null,
      parent_id || null,
      nextOrder
    );

    const categoryId = result.lastInsertRowid;

    // Log activity
    db.prepare(
      'INSERT INTO logs_activite (utilisateur_id, action, module, details, ip_address) VALUES (?, ?, ?, ?, ?)'
    ).run(
      req.user.id,
      'creation_categorie',
      'livres',
      JSON.stringify({ categoryId, nom, timestamp: new Date().toISOString() }),
      req.ip || req.connection.remoteAddress
    );

    res.status(201).json({
      message: 'Catégorie créée avec succès',
      categoryId,
      category: { id: categoryId, nom }
    });
  } catch (error) {
    console.error('Error creating category:', error);
    res.status(500).json({
      error: 'Erreur lors de la création de la catégorie',
      code: 'CREATE_CATEGORY_ERROR'
    });
  }
}));

// POST /api/books/import-excel - Import books from Excel file (admin only)
router.post('/import-excel', authenticateToken, requirePrivilege('livres', 'create'), upload.single('file'), asyncHandler(async (req, res) => {
  if (!req.file) {
    return res.status(400).json({
      error: 'Fichier Excel requis',
      code: 'MISSING_FILE'
    });
  }

  const db = getDatabase();

  try {
    // Read Excel file from buffer
    const workbook = XLSX.read(req.file.buffer, { type: 'buffer' });
    const sheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[sheetName];
    const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });

    if (jsonData.length < 2) {
      return res.status(400).json({
        error: 'Fichier Excel vide ou format invalide',
        code: 'EMPTY_EXCEL'
      });
    }

    const headers = jsonData[0];
    const dataRows = jsonData.slice(1);

    // Get admin and default category
    const admin = db.prepare('SELECT id FROM administrateurs WHERE id = ?').get(req.user.id);
    let defaultCategory = db.prepare('SELECT id FROM categories WHERE nom = ?').get('Général');
    
    if (!defaultCategory) {
      const createCategory = db.prepare(`
        INSERT INTO categories (nom, description, couleur_hex, ordre_affichage)
        VALUES (?, ?, ?, ?)
      `);
      const result = createCategory.run('Général', 'Livre sans catégorie spécifique', '#A5D6A7', 999);
      defaultCategory = { id: result.lastInsertRowid };
    }

    // Prepare statements
    const findAuthor = db.prepare('SELECT id FROM auteurs WHERE nom_complet = ?');
    const createAuthor = db.prepare(`
      INSERT INTO auteurs (nom_complet, biographie, nationalite)
      VALUES (?, ?, ?)
    `);
    const findCategory = db.prepare('SELECT id FROM categories WHERE nom = ?');
    const createCategory = db.prepare(`
      INSERT INTO categories (nom, description, couleur_hex, ordre_affichage)
      VALUES (?, ?, ?, ?)
    `);
    const insertBook = db.prepare(`
      INSERT INTO livres (
        titre, auteur_id, resume, categorie_id, annee_publication, 
        langue, nombre_exemplaires, exemplaires_disponibles,
        nombre_pages, editeur, isbn, ajoute_par
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    let successCount = 0;
    let errorCount = 0;
    let skippedCount = 0;
    const errors = [];

    for (let i = 0; i < dataRows.length; i++) {
      const row = dataRows[i];
      
      try {
        const bookData = mapRowToBookData(row, headers);
        
        if (!bookData.titre || !bookData.auteur) {
          errors.push(`Ligne ${i + 2}: Titre ou auteur manquant`);
          skippedCount++;
          continue;
        }
        
        // Find or create author
        let author = findAuthor.get(bookData.auteur);
        if (!author) {
          const authorResult = createAuthor.run(
            bookData.auteur,
            `Auteur de "${bookData.titre}"`,
            bookData.nationalite || null
          );
          author = { id: authorResult.lastInsertRowid };
        }
        
        // Find or create category
        let category = findCategory.get(bookData.categorie || 'Général');
        if (!category && bookData.categorie) {
          const categoryResult = createCategory.run(
            bookData.categorie,
            `Catégorie: ${bookData.categorie}`,
            '#A5D6A7',
            500
          );
          category = { id: categoryResult.lastInsertRowid };
        } else if (!category) {
          category = defaultCategory;
        }
        
        // Insert book
        insertBook.run(
          bookData.titre,
          author.id,
          bookData.resume || `Livre: ${bookData.titre}`,
          category.id,
          bookData.annee_publication || new Date().getFullYear(),
          bookData.langue || 'FR',
          bookData.nombre_exemplaires || 1,
          bookData.nombre_exemplaires || 1,
          bookData.nombre_pages || null,
          bookData.editeur || null,
          bookData.isbn || null,
          admin.id
        );
        
        successCount++;
        
      } catch (error) {
        errors.push(`Ligne ${i + 2}: ${error.message}`);
        errorCount++;
      }
    }

    // Log activity
    db.prepare(
      'INSERT INTO logs_activite (utilisateur_id, action, module, details, ip_address) VALUES (?, ?, ?, ?, ?)'
    ).run(
      req.user.id,
      'import_excel',
      'livres',
      JSON.stringify({ 
        successCount, 
        errorCount, 
        skippedCount, 
        timestamp: new Date().toISOString() 
      }),
      req.ip || req.connection.remoteAddress
    );

    res.json({
      message: 'Import Excel terminé',
      successCount,
      errorCount,
      skippedCount,
      errors: errors.slice(0, 10), // Limit error details
      totalProcessed: dataRows.length
    });

  } catch (error) {
    console.error('Excel import error:', error);
    res.status(500).json({
      error: 'Erreur lors de l\'import Excel',
      code: 'EXCEL_IMPORT_ERROR'
    });
  }
}));

// Helper function to map Excel row data
function mapRowToBookData(row, headers) {
  const data = {};
  headers.forEach((header, index) => {
    if (header && row[index] !== undefined) {
      data[header.toLowerCase().trim()] = row[index];
    }
  });
  
  return {
    titre: cleanValue(data.titre || data.nom || data.title || data['nom du livre'] || data['titre du livre']),
    auteur: cleanValue(data.auteur || data.author || data['nom auteur'] || data['nom de l\'auteur']),
    resume: cleanValue(data.resume || data.description || data.synopsis || data['résumé']),
    categorie: cleanValue(data.categorie || data.category || data['catégorie'] || data.type),
    annee_publication: parseInt(cleanValue(data['annee publication'] || data['année'] || data.year || data.date)),
    langue: cleanValue(data.langue || data.language || 'FR'),
    nombre_pages: parseInt(cleanValue(data.pages || data['nombre pages'] || data['nb pages'])),
    nombre_exemplaires: parseInt(cleanValue(data.quantite || data['nombre exemplaires'] || data.stock || 1)),
    editeur: cleanValue(data.editeur || data.publisher || data['maison édition']),
    isbn: cleanValue(data.isbn || data['numéro isbn'] || data['no isbn']),
    nationalite: cleanValue(data.nationalite || data.nationality || 'Inconnue')
  };
}

function cleanValue(value) {
  if (value === null || value === undefined) return null;
  if (typeof value === 'string') {
    return value.trim().replace(/\s+/g, ' ');
  }
  return value;
}

export default router;

import { useState, useEffect } from 'react';
import { useDatabase } from '../contexts/DatabaseContext';
import { useAuth } from '../contexts/AuthContext';
import toast from 'react-hot-toast';

export const useBooks = (filters = {}) => {
  const { db } = useDatabase();
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadBooks();
  }, [JSON.stringify(filters)]);

  const loadBooks = () => {
    try {
      setLoading(true);
      let query = `
        SELECT 
          l.*,
          a.nom_complet as auteur_nom,
          c.nom as categorie_nom,
          c.couleur_hex as categorie_couleur
        FROM livres l
        LEFT JOIN auteurs a ON l.auteur_id = a.id
        LEFT JOIN categories c ON l.categorie_id = c.id
        WHERE 1=1
      `;
      
      const params = [];

      // Apply filters
      if (filters.search) {
        query += ` AND (l.titre LIKE ? OR l.isbn LIKE ? OR a.nom_complet LIKE ?)`;
        const searchTerm = `%${filters.search}%`;
        params.push(searchTerm, searchTerm, searchTerm);
      }

      if (filters.categorie_id) {
        query += ` AND l.categorie_id = ?`;
        params.push(filters.categorie_id);
      }

      if (filters.auteur_id) {
        query += ` AND l.auteur_id = ?`;
        params.push(filters.auteur_id);
      }

      if (filters.statut) {
        query += ` AND l.statut = ?`;
        params.push(filters.statut);
      }

      if (filters.langue) {
        query += ` AND l.langue = ?`;
        params.push(filters.langue);
      }

      query += ` ORDER BY l.date_ajout DESC`;

      const results = db.query(query, params);
      setBooks(results || []);
      setError(null);
    } catch (err) {
      console.error('Error loading books:', err);
      setError(err.message);
      setBooks([]);
    } finally {
      setLoading(false);
    }
  };

  const getBook = (id) => {
    try {
      const query = `
        SELECT 
          l.*,
          a.nom_complet as auteur_nom,
          a.biographie as auteur_biographie,
          c.nom as categorie_nom,
          c.couleur_hex as categorie_couleur
        FROM livres l
        LEFT JOIN auteurs a ON l.auteur_id = a.id
        LEFT JOIN categories c ON l.categorie_id = c.id
        WHERE l.id = ?
      `;
      return db.queryOne(query, [id]);
    } catch (err) {
      console.error('Error getting book:', err);
      throw err;
    }
  };

  const createBook = (bookData) => {
    try {
      const { currentAdmin } = useAuth();
      const query = `
        INSERT INTO livres (
          isbn, titre, auteur_id, resume, categorie_id, 
          annee_publication, editeur, langue, nombre_pages,
          nombre_exemplaires, exemplaires_disponibles, statut,
          image_couverture, tags, cote, ajoute_par
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `;
      
      db.run(query, [
        bookData.isbn || null,
        bookData.titre,
        bookData.auteur_id,
        bookData.resume,
        bookData.categorie_id,
        bookData.annee_publication,
        bookData.editeur || null,
        bookData.langue,
        bookData.nombre_pages || null,
        bookData.nombre_exemplaires,
        bookData.exemplaires_disponibles || bookData.nombre_exemplaires,
        bookData.statut || 'disponible',
        bookData.image_couverture || null,
        bookData.tags || null,
        bookData.cote || null,
        currentAdmin?.id
      ]);

      const id = db.getLastInsertId();
      toast.success('Livre ajouté avec succès');
      loadBooks();
      return id;
    } catch (err) {
      console.error('Error creating book:', err);
      toast.error('Erreur lors de l\'ajout du livre');
      throw err;
    }
  };

  const updateBook = (id, bookData) => {
    try {
      const query = `
        UPDATE livres SET
          isbn = ?, titre = ?, auteur_id = ?, resume = ?, 
          categorie_id = ?, annee_publication = ?, editeur = ?,
          langue = ?, nombre_pages = ?, nombre_exemplaires = ?,
          exemplaires_disponibles = ?, statut = ?, image_couverture = ?,
          tags = ?, cote = ?
        WHERE id = ?
      `;
      
      db.run(query, [
        bookData.isbn || null,
        bookData.titre,
        bookData.auteur_id,
        bookData.resume,
        bookData.categorie_id,
        bookData.annee_publication,
        bookData.editeur || null,
        bookData.langue,
        bookData.nombre_pages || null,
        bookData.nombre_exemplaires,
        bookData.exemplaires_disponibles,
        bookData.statut,
        bookData.image_couverture || null,
        bookData.tags || null,
        bookData.cote || null,
        id
      ]);

      toast.success('Livre mis à jour avec succès');
      loadBooks();
    } catch (err) {
      console.error('Error updating book:', err);
      toast.error('Erreur lors de la mise à jour du livre');
      throw err;
    }
  };

  const deleteBook = (id) => {
    try {
      db.run('DELETE FROM livres WHERE id = ?', [id]);
      toast.success('Livre supprimé avec succès');
      loadBooks();
    } catch (err) {
      console.error('Error deleting book:', err);
      toast.error('Erreur lors de la suppression du livre');
      throw err;
    }
  };

  return {
    books,
    loading,
    error,
    loadBooks,
    getBook,
    createBook,
    updateBook,
    deleteBook
  };
};

export const useAuthors = () => {
  const { db } = useDatabase();
  const [authors, setAuthors] = useState([]);

  useEffect(() => {
    loadAuthors();
  }, []);

  const loadAuthors = () => {
    try {
      const results = db.query('SELECT * FROM auteurs ORDER BY nom_complet');
      setAuthors(results || []);
    } catch (err) {
      console.error('Error loading authors:', err);
    }
  };

  const createAuthor = (authorData) => {
    try {
      db.run(
        'INSERT INTO auteurs (nom_complet, biographie, nationalite, date_naissance, site_web) VALUES (?, ?, ?, ?, ?)',
        [authorData.nom_complet, authorData.biographie, authorData.nationalite, authorData.date_naissance, authorData.site_web]
      );
      loadAuthors();
      return db.getLastInsertId();
    } catch (err) {
      console.error('Error creating author:', err);
      throw err;
    }
  };

  return { authors, loadAuthors, createAuthor };
};

export const useCategories = () => {
  const { db } = useDatabase();
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    loadCategories();
  }, []);

  const loadCategories = () => {
    try {
      const results = db.query('SELECT * FROM categories ORDER BY ordre_affichage, nom');
      setCategories(results || []);
    } catch (err) {
      console.error('Error loading categories:', err);
    }
  };

  const createCategory = (categoryData) => {
    try {
      db.run(
        'INSERT INTO categories (nom, description, couleur_hex, icone, parent_id) VALUES (?, ?, ?, ?, ?)',
        [categoryData.nom, categoryData.description, categoryData.couleur_hex, categoryData.icone, categoryData.parent_id]
      );
      loadCategories();
      return db.getLastInsertId();
    } catch (err) {
      console.error('Error creating category:', err);
      throw err;
    }
  };

  return { categories, loadCategories, createCategory };
};


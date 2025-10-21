import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import apiService from '../services/api';
import toast from 'react-hot-toast';

export const useBooks = (filters = {}) => {
  const { currentAdmin } = useAuth();
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState(null);

  useEffect(() => {
    loadBooks();
  }, [JSON.stringify(filters)]);

  const loadBooks = async () => {
    try {
      setLoading(true);
      setError(null);

      // Build query parameters
      const params = {};
      if (filters.search) params.search = filters.search;
      if (filters.categorie_id) params.categorie_id = filters.categorie_id;
      if (filters.auteur_id) params.auteur_id = filters.auteur_id;
      if (filters.statut) params.statut = filters.statut;
      if (filters.langue) params.langue = filters.langue;
      if (filters.limit) params.limit = filters.limit;
      if (filters.offset) params.offset = filters.offset;

      const response = await apiService.getBooks(params);
      setBooks(response.books || []);
      setPagination(response.pagination || null);
    } catch (err) {
      console.error('Error loading books:', err);
      setError(err.message);
      setBooks([]);
    } finally {
      setLoading(false);
    }
  };

  const getBook = async (id) => {
    try {
      const response = await apiService.getBook(id);
      return response.book;
    } catch (err) {
      console.error('Error getting book:', err);
      throw err;
    }
  };

  const createBook = async (bookData) => {
    try {
      const response = await apiService.createBook(bookData);
      toast.success('Livre ajouté avec succès');
      loadBooks();
      return response.bookId;
    } catch (err) {
      console.error('Error creating book:', err);
      toast.error('Erreur lors de l\'ajout du livre');
      throw err;
    }
  };

  const updateBook = async (id, bookData) => {
    try {
      await apiService.updateBook(id, bookData);
      toast.success('Livre mis à jour avec succès');
      loadBooks();
    } catch (err) {
      console.error('Error updating book:', err);
      toast.error('Erreur lors de la mise à jour du livre');
      throw err;
    }
  };

  const deleteBook = async (id) => {
    try {
      await apiService.deleteBook(id);
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
    pagination,
    loadBooks,
    getBook,
    createBook,
    updateBook,
    deleteBook
  };
};

export const useAuthors = () => {
  const [authors, setAuthors] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadAuthors();
  }, []);

  const loadAuthors = async () => {
    try {
      setLoading(true);
      const response = await apiService.getAuthors();
      setAuthors(response.authors || []);
    } catch (err) {
      console.error('Error loading authors:', err);
      setAuthors([]);
    } finally {
      setLoading(false);
    }
  };

  return { authors, loading, loadAuthors };
};

export const useAdminBooks = (filters = {}) => {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState(null);

  useEffect(() => {
    loadBooks();
  }, [JSON.stringify(filters)]);

  const loadBooks = async () => {
    try {
      setLoading(true);
      setError(null);

      // Build query parameters for admin books API
      const params = {};
      if (filters.search) params.search = filters.search;
      if (filters.limit) params.limit = filters.limit;
      if (filters.offset) params.offset = filters.offset;

      const response = await apiService.getAdminBooks(params);
      setBooks(response.books || []);
      setPagination(response.pagination || null);
    } catch (err) {
      console.error('Error loading admin books:', err);
      setError(err.message);
      setBooks([]);
    } finally {
      setLoading(false);
    }
  };

  const createBook = async (bookData) => {
    try {
      const response = await apiService.createAdminBook(bookData);
      toast.success('Livre ajouté avec succès');
      loadBooks();
      return response;
    } catch (err) {
      console.error('Error creating admin book:', err);
      toast.error('Erreur lors de l\'ajout du livre');
      throw err;
    }
  };

  const updateBook = async (id, bookData) => {
    try {
      await apiService.updateAdminBook(id, bookData);
      toast.success('Livre mis à jour avec succès');
      loadBooks();
    } catch (err) {
      console.error('Error updating admin book:', err);
      toast.error('Erreur lors de la mise à jour du livre');
      throw err;
    }
  };

  const deleteBook = async (id) => {
    try {
      await apiService.deleteAdminBook(id);
      toast.success('Livre supprimé avec succès');
      loadBooks();
    } catch (err) {
      console.error('Error deleting admin book:', err);
      toast.error('Erreur lors de la suppression du livre');
      throw err;
    }
  };

  return {
    books,
    loading,
    error,
    pagination,
    loadBooks,
    createBook,
    updateBook,
    deleteBook
  };
};

export const useCategories = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadCategories();
  }, []);

  const loadCategories = async () => {
    try {
      setLoading(true);
      const response = await apiService.getCategories();
      setCategories(response.categories || []);
    } catch (err) {
      console.error('Error loading categories:', err);
      setCategories([]);
    } finally {
      setLoading(false);
    }
  };

  return { categories, loading, loadCategories };
};


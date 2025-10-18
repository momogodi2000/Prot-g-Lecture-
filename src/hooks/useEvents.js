import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useDatabase } from '../contexts/DatabaseContext';
import apiService from '../services/api';
import toast from 'react-hot-toast';

export const useEvents = (filters = {}) => {
  const { currentAdmin } = useAuth();
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState(null);

  useEffect(() => {
    loadEvents();
  }, [JSON.stringify(filters)]);

  const loadEvents = async () => {
    try {
      setLoading(true);
      
      // Build query parameters
      const params = {};
      if (filters.search) params.search = filters.search;
      if (filters.statut) params.statut = filters.statut;
      else if (!currentAdmin) params.statut = 'publie'; // Only show published events to visitors
      if (filters.type) params.type = filters.type;
      if (filters.limit) params.limit = filters.limit;
      if (filters.offset) params.offset = filters.offset;

      const response = await apiService.getEvents(params);
      setEvents(response.events || []);
      setPagination(response.pagination || null);
    } catch (err) {
      console.error('Error loading events:', err);
      setEvents([]);
      setPagination(null);
    } finally {
      setLoading(false);
    }
  };

  const getEvent = async (id) => {
    try {
      const response = await apiService.getEvent(id);
      return response.event;
    } catch (err) {
      console.error('Error getting event:', err);
      throw err;
    }
  };

  const createEvent = async (eventData) => {
    try {
      const response = await apiService.createEvent(eventData);
      toast.success('Événement créé avec succès');
      loadEvents();
      return response.eventId;
    } catch (err) {
      console.error('Error creating event:', err);
      toast.error('Erreur lors de la création de l\'événement');
      throw err;
    }
  };

  const updateEvent = async (id, eventData) => {
    try {
      await apiService.updateEvent(id, eventData);
      toast.success('Événement mis à jour avec succès');
      loadEvents();
    } catch (err) {
      console.error('Error updating event:', err);
      toast.error('Erreur lors de la mise à jour');
      throw err;
    }
  };

  const publishEvent = async (id) => {
    try {
      await updateEvent(id, { statut: 'publie' });
      toast.success('Événement publié');
      loadEvents();
    } catch (err) {
      console.error('Error publishing event:', err);
      toast.error('Erreur lors de la publication');
      throw err;
    }
  };

  const deleteEvent = async (id) => {
    try {
      await apiService.deleteEvent(id);
      toast.success('Événement supprimé');
      loadEvents();
    } catch (err) {
      console.error('Error deleting event:', err);
      toast.error('Erreur lors de la suppression');
      throw err;
    }
  };

  return {
    events,
    loading,
    pagination,
    loadEvents,
    getEvent,
    createEvent,
    updateEvent,
    publishEvent,
    deleteEvent
  };
};

export const useNews = (filters = {}) => {
  // Note: This hook still uses direct database access until backend API is implemented for news
  const { db } = useDatabase();
  const { currentAdmin } = useAuth();
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadNews();
  }, [JSON.stringify(filters)]);

  const loadNews = () => {
    try {
      setLoading(true);
      let query = `
        SELECT 
          a.*,
          adm.nom_complet as auteur_nom
        FROM actualites a
        LEFT JOIN administrateurs adm ON a.cree_par = adm.id
        WHERE 1=1
      `;
      
      const params = [];

      if (filters.statut) {
        query += ` AND a.statut = ?`;
        params.push(filters.statut);
      } else if (!currentAdmin) {
        query += ` AND a.statut = ?`;
        params.push('publie');
      }

      if (filters.categorie) {
        query += ` AND a.categorie = ?`;
        params.push(filters.categorie);
      }

      if (filters.search) {
        query += ` AND (a.titre LIKE ? OR a.contenu LIKE ?)`;
        const searchTerm = `%${filters.search}%`;
        params.push(searchTerm, searchTerm);
      }

      query += ` ORDER BY a.date_creation DESC`;

      const results = db.query(query, params);
      setNews(results || []);
    } catch (err) {
      console.error('Error loading news:', err);
      setNews([]);
    } finally {
      setLoading(false);
    }
  };

  const getNewsItem = (id) => {
    try {
      const query = `
        SELECT 
          a.*,
          adm.nom_complet as auteur_nom
        FROM actualites a
        LEFT JOIN administrateurs adm ON a.cree_par = adm.id
        WHERE a.id = ?
      `;
      return db.queryOne(query, [id]);
    } catch (err) {
      console.error('Error getting news:', err);
      throw err;
    }
  };

  const createNews = (newsData) => {
    try {
      const query = `
        INSERT INTO actualites (
          titre, contenu, resume, image_principale,
          categorie, tags, statut, cree_par
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)
      `;
      
      db.run(query, [
        newsData.titre,
        newsData.contenu,
        newsData.resume || null,
        newsData.image_principale || null,
        newsData.categorie || null,
        newsData.tags || null,
        newsData.statut || 'brouillon',
        currentAdmin?.id
      ]);

      const id = db.getLastInsertId();
      toast.success('Actualité créée avec succès');
      loadNews();
      return id;
    } catch (err) {
      console.error('Error creating news:', err);
      toast.error('Erreur lors de la création');
      throw err;
    }
  };

  const updateNews = (id, newsData) => {
    try {
      const query = `
        UPDATE actualites SET
          titre = ?, contenu = ?, resume = ?,
          image_principale = ?, categorie = ?, tags = ?, statut = ?
        WHERE id = ?
      `;
      
      db.run(query, [
        newsData.titre,
        newsData.contenu,
        newsData.resume,
        newsData.image_principale,
        newsData.categorie,
        newsData.tags,
        newsData.statut,
        id
      ]);

      toast.success('Actualité mise à jour');
      loadNews();
    } catch (err) {
      console.error('Error updating news:', err);
      toast.error('Erreur lors de la mise à jour');
      throw err;
    }
  };

  const publishNews = (id) => {
    try {
      db.run(
        'UPDATE actualites SET statut = ?, publie_le = ? WHERE id = ?',
        ['publie', new Date().toISOString(), id]
      );
      toast.success('Actualité publiée');
      loadNews();
    } catch (err) {
      console.error('Error publishing news:', err);
      toast.error('Erreur lors de la publication');
      throw err;
    }
  };

  const deleteNews = (id) => {
    try {
      db.run('DELETE FROM actualites WHERE id = ?', [id]);
      toast.success('Actualité supprimée');
      loadNews();
    } catch (err) {
      console.error('Error deleting news:', err);
      toast.error('Erreur lors de la suppression');
      throw err;
    }
  };

  return {
    news,
    loading,
    loadNews,
    getNewsItem,
    createNews,
    updateNews,
    publishNews,
    deleteNews
  };
};


import { useState, useEffect } from 'react';
import { useDatabase } from '../contexts/DatabaseContext';
import { useAuth } from '../contexts/AuthContext';
import toast from 'react-hot-toast';

export const useEvents = (filters = {}) => {
  const { db } = useDatabase();
  const { currentAdmin } = useAuth();
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadEvents();
  }, [JSON.stringify(filters)]);

  const loadEvents = () => {
    try {
      setLoading(true);
      let query = `
        SELECT 
          e.*,
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

      if (filters.statut) {
        query += ` AND e.statut = ?`;
        params.push(filters.statut);
      } else if (!currentAdmin) {
        // Only show published events to visitors
        query += ` AND e.statut = ?`;
        params.push('publie');
      }

      if (filters.type) {
        query += ` AND e.type = ?`;
        params.push(filters.type);
      }

      if (filters.search) {
        query += ` AND (e.titre LIKE ? OR e.description LIKE ?)`;
        const searchTerm = `%${filters.search}%`;
        params.push(searchTerm, searchTerm);
      }

      query += ` ORDER BY e.date_debut DESC`;

      const results = db.query(query, params);
      setEvents(results || []);
    } catch (err) {
      console.error('Error loading events:', err);
      setEvents([]);
    } finally {
      setLoading(false);
    }
  };

  const getEvent = (id) => {
    try {
      const query = `
        SELECT 
          e.*,
          g.nom as groupe_nom,
          l.titre as livre_titre,
          a.nom_complet as createur_nom
        FROM evenements e
        LEFT JOIN groupes_lecture g ON e.groupe_lie = g.id
        LEFT JOIN livres l ON e.livre_lie = l.id
        LEFT JOIN administrateurs a ON e.cree_par = a.id
        WHERE e.id = ?
      `;
      return db.queryOne(query, [id]);
    } catch (err) {
      console.error('Error getting event:', err);
      throw err;
    }
  };

  const createEvent = (eventData) => {
    try {
      const query = `
        INSERT INTO evenements (
          titre, description, type, date_debut, date_fin,
          lieu, image_principale, lien_externe, groupe_lie,
          livre_lie, statut, cree_par
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `;
      
      db.run(query, [
        eventData.titre,
        eventData.description,
        eventData.type,
        eventData.date_debut,
        eventData.date_fin || null,
        eventData.lieu || null,
        eventData.image_principale || null,
        eventData.lien_externe || null,
        eventData.groupe_lie || null,
        eventData.livre_lie || null,
        eventData.statut || 'brouillon',
        currentAdmin?.id
      ]);

      const id = db.getLastInsertId();
      toast.success('Événement créé avec succès');
      loadEvents();
      return id;
    } catch (err) {
      console.error('Error creating event:', err);
      toast.error('Erreur lors de la création de l\'événement');
      throw err;
    }
  };

  const updateEvent = (id, eventData) => {
    try {
      const query = `
        UPDATE evenements SET
          titre = ?, description = ?, type = ?, date_debut = ?,
          date_fin = ?, lieu = ?, image_principale = ?,
          lien_externe = ?, groupe_lie = ?, livre_lie = ?, statut = ?
        WHERE id = ?
      `;
      
      db.run(query, [
        eventData.titre,
        eventData.description,
        eventData.type,
        eventData.date_debut,
        eventData.date_fin,
        eventData.lieu,
        eventData.image_principale,
        eventData.lien_externe,
        eventData.groupe_lie,
        eventData.livre_lie,
        eventData.statut,
        id
      ]);

      toast.success('Événement mis à jour avec succès');
      loadEvents();
    } catch (err) {
      console.error('Error updating event:', err);
      toast.error('Erreur lors de la mise à jour');
      throw err;
    }
  };

  const publishEvent = (id) => {
    try {
      db.run(
        'UPDATE evenements SET statut = ?, publie_le = ? WHERE id = ?',
        ['publie', new Date().toISOString(), id]
      );
      toast.success('Événement publié');
      loadEvents();
    } catch (err) {
      console.error('Error publishing event:', err);
      toast.error('Erreur lors de la publication');
      throw err;
    }
  };

  const deleteEvent = (id) => {
    try {
      db.run('DELETE FROM evenements WHERE id = ?', [id]);
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
    loadEvents,
    getEvent,
    createEvent,
    updateEvent,
    publishEvent,
    deleteEvent
  };
};

export const useNews = (filters = {}) => {
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


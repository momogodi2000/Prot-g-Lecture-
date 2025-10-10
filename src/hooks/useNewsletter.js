import { useState, useEffect } from 'react';
import { useDatabase } from '../contexts/DatabaseContext';
import { useAuth } from '../contexts/AuthContext';
import toast from 'react-hot-toast';
import { generateId } from '../utils/helpers';
import emailService from '../services/email';

export const useNewsletter = (filters = {}) => {
  const { db } = useDatabase();
  const { currentAdmin } = useAuth();
  const [subscribers, setSubscribers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadSubscribers();
  }, [JSON.stringify(filters)]);

  const loadSubscribers = () => {
    try {
      setLoading(true);
      let query = `SELECT * FROM newsletter_abonnes WHERE 1=1`;
      const params = [];

      if (filters.statut) {
        query += ` AND statut = ?`;
        params.push(filters.statut);
      }

      if (filters.search) {
        query += ` AND (email LIKE ? OR nom_complet LIKE ?)`;
        const searchTerm = `%${filters.search}%`;
        params.push(searchTerm, searchTerm);
      }

      query += ` ORDER BY date_inscription DESC`;

      const results = db.query(query, params);
      setSubscribers(results || []);
    } catch (err) {
      console.error('Error loading subscribers:', err);
      setSubscribers([]);
    } finally {
      setLoading(false);
    }
  };

  const subscribe = async (email, nomComplet = null) => {
    try {
      // Check if already subscribed
      const existing = db.queryOne(
        'SELECT * FROM newsletter_abonnes WHERE email = ?',
        [email]
      );

      if (existing) {
        if (existing.statut === 'actif') {
          throw new Error('Cet email est déjà inscrit');
        } else {
          // Reactivate subscription
          db.run(
            'UPDATE newsletter_abonnes SET statut = ?, date_inscription = ? WHERE email = ?',
            ['actif', new Date().toISOString(), email]
          );
          toast.success('Inscription réactivée');
          return existing.id;
        }
      }

      // Create new subscription
      const token = generateId();
      const query = `
        INSERT INTO newsletter_abonnes (
          email, nom_complet, token_desinscription, statut
        ) VALUES (?, ?, ?, ?)
      `;
      
      db.run(query, [email, nomComplet, token, 'actif']);

      const id = db.getLastInsertId();

      // Send welcome email
      await emailService.sendNewsletterConfirmation({ email, nom_complet: nomComplet, token_desinscription: token });

      toast.success('Inscription réussie ! Vérifiez votre email.');
      loadSubscribers();
      return id;
    } catch (err) {
      console.error('Error subscribing:', err);
      toast.error(err.message || 'Erreur lors de l\'inscription');
      throw err;
    }
  };

  const unsubscribe = (token) => {
    try {
      db.run(
        'UPDATE newsletter_abonnes SET statut = ? WHERE token_desinscription = ?',
        ['desabonne', token]
      );
      toast.success('Désinscription réussie');
      loadSubscribers();
    } catch (err) {
      console.error('Error unsubscribing:', err);
      toast.error('Erreur lors de la désinscription');
      throw err;
    }
  };

  const deleteSubscriber = (id) => {
    try {
      db.run('DELETE FROM newsletter_abonnes WHERE id = ?', [id]);
      toast.success('Abonné supprimé');
      loadSubscribers();
    } catch (err) {
      console.error('Error deleting subscriber:', err);
      toast.error('Erreur');
      throw err;
    }
  };

  const getSubscriberStats = () => {
    try {
      return {
        total: db.queryOne('SELECT COUNT(*) as count FROM newsletter_abonnes')?.count || 0,
        actifs: db.queryOne('SELECT COUNT(*) as count FROM newsletter_abonnes WHERE statut = ?', ['actif'])?.count || 0,
        desabonnes: db.queryOne('SELECT COUNT(*) as count FROM newsletter_abonnes WHERE statut = ?', ['desabonne'])?.count || 0
      };
    } catch (err) {
      return {};
    }
  };

  const sendCampaign = async (campaignData, subscriberIds = []) => {
    try {
      // Get active subscribers
      let subscribersToSend = [];
      if (subscriberIds.length > 0) {
        subscribersToSend = db.query(
          `SELECT * FROM newsletter_abonnes WHERE id IN (${subscriberIds.join(',')}) AND statut = ?`,
          ['actif']
        );
      } else {
        subscribersToSend = db.query(
          'SELECT * FROM newsletter_abonnes WHERE statut = ?',
          ['actif']
        );
      }

      // Save campaign
      const query = `
        INSERT INTO newsletter_envois (
          objet, contenu, nombre_destinataires, envoye_par, statut
        ) VALUES (?, ?, ?, ?, ?)
      `;
      
      db.run(query, [
        campaignData.objet,
        campaignData.contenu,
        subscribersToSend.length,
        currentAdmin?.id,
        'envoye'
      ]);

      // Send emails (in production, this would be batched)
      await emailService.sendNewsletterCampaign(campaignData, subscribersToSend);

      toast.success(`Campagne envoyée à ${subscribersToSend.length} abonné(s)`);
      return db.getLastInsertId();
    } catch (err) {
      console.error('Error sending campaign:', err);
      toast.error('Erreur lors de l\'envoi de la campagne');
      throw err;
    }
  };

  return {
    subscribers,
    loading,
    loadSubscribers,
    subscribe,
    unsubscribe,
    deleteSubscriber,
    getSubscriberStats,
    sendCampaign
  };
};

